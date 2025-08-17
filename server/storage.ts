import { 
  users, 
  contests, 
  contestParticipants, 
  contestWinners,
  type User, 
  type InsertUser,
  type Contest,
  type InsertContest,
  type ContestParticipant,
  type InsertContestParticipant,
  type ContestWinner,
  type InsertContestWinner
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contest operations
  getContests(filters?: { status?: string; category?: string }): Promise<Contest[]>;
  getContestById(id: string): Promise<Contest | undefined>;
  createContest(contest: InsertContest): Promise<Contest>;
  updateContest(id: string, updates: Partial<Contest>): Promise<Contest | undefined>;

  // Contest participation
  joinContest(participation: InsertContestParticipant): Promise<ContestParticipant>;
  getContestParticipants(contestId: string): Promise<ContestParticipant[]>;
  getUserCreatedContests(userId: string): Promise<Contest[]>;
  getUserParticipatedContests(userId: string): Promise<Contest[]>;

  // Platform stats
  getPlatformStats(): Promise<{
    totalPrizes: number;
    activeContests: number;
    totalParticipants: number;
    contestsCompleted: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getContests(filters?: { status?: string; category?: string }): Promise<Contest[]> {
    let query = db.select().from(contests);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(contests.status, filters.status as any));
    }
    if (filters?.category) {
      conditions.push(eq(contests.category, filters.category as any));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(contests.createdAt));
  }

  async getContestById(id: string): Promise<Contest | undefined> {
    const [contest] = await db.select().from(contests).where(eq(contests.id, id));
    return contest || undefined;
  }

  async createContest(insertContest: InsertContest): Promise<Contest> {
    const [contest] = await db
      .insert(contests)
      .values(insertContest)
      .returning();
    return contest;
  }

  async updateContest(id: string, updates: Partial<Contest>): Promise<Contest | undefined> {
    const [contest] = await db
      .update(contests)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(contests.id, id))
      .returning();
    return contest || undefined;
  }

  async joinContest(participation: InsertContestParticipant): Promise<ContestParticipant> {
    const [participant] = await db
      .insert(contestParticipants)
      .values(participation)
      .returning();
    return participant;
  }

  async getContestParticipants(contestId: string): Promise<ContestParticipant[]> {
    return db
      .select()
      .from(contestParticipants)
      .where(eq(contestParticipants.contestId, contestId))
      .orderBy(desc(contestParticipants.joinedAt));
  }

  async getUserCreatedContests(userId: string): Promise<Contest[]> {
    return db
      .select()
      .from(contests)
      .where(eq(contests.creatorId, userId))
      .orderBy(desc(contests.createdAt));
  }

  async getUserParticipatedContests(userId: string): Promise<Contest[]> {
    const participatedContests = await db
      .select({
        contest: contests,
      })
      .from(contestParticipants)
      .innerJoin(contests, eq(contestParticipants.contestId, contests.id))
      .where(eq(contestParticipants.userId, userId))
      .orderBy(desc(contestParticipants.joinedAt));

    return participatedContests.map(row => row.contest);
  }

  async getPlatformStats(): Promise<{
    totalPrizes: number;
    activeContests: number;
    totalParticipants: number;
    contestsCompleted: number;
  }> {
    const [totalPrizesResult] = await db
      .select({ value: sum(contests.prizePool) })
      .from(contests);

    const [activeContestsResult] = await db
      .select({ value: count() })
      .from(contests)
      .where(eq(contests.status, "active"));

    const [totalParticipantsResult] = await db
      .select({ value: count() })
      .from(contestParticipants);

    const [completedContestsResult] = await db
      .select({ value: count() })
      .from(contests)
      .where(eq(contests.status, "completed"));

    return {
      totalPrizes: Number(totalPrizesResult?.value || 0),
      activeContests: Number(activeContestsResult?.value || 0),
      totalParticipants: Number(totalParticipantsResult?.value || 0),
      contestsCompleted: Number(completedContestsResult?.value || 0),
    };
  }
}

export const storage = new DatabaseStorage();
