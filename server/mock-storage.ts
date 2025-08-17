import { 
  type User, 
  type InsertUser,
  type Contest,
  type InsertContest,
  type ContestParticipant,
  type InsertContestParticipant,
  type ContestWinner,
  type InsertContestWinner
} from "@shared/schema";
import { type IStorage } from "./storage";

// In-memory mock storage for demo purposes
export class MockStorage implements IStorage {
  private users: User[] = [];
  private contests: Contest[] = [];
  private participants: ContestParticipant[] = [];
  private winners: ContestWinner[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return this.users.find(u => u.walletAddress === walletAddress);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress: user.walletAddress,
      username: user.username || user.walletAddress.slice(0, 8) + "...",
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getContests(filters?: { status?: string; category?: string }): Promise<Contest[]> {
    let filtered = this.contests;
    
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getContestById(id: string): Promise<Contest | undefined> {
    return this.contests.find(c => c.id === id);
  }

  async createContest(contest: InsertContest): Promise<Contest> {
    const newContest: Contest = {
      id: `contest_${Math.random().toString(36).substr(2, 9)}`,
      title: contest.title,
      description: contest.description,
      category: contest.category,
      creatorId: contest.creatorId,
      contractAddress: contest.contractAddress || null,
      prizePool: contest.prizePool,
      entryFee: contest.entryFee,
      maxParticipants: contest.maxParticipants,
      status: contest.status,
      prizeType: contest.prizeType,
      startTime: contest.startTime,
      endTime: contest.endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contests.push(newContest);
    return newContest;
  }

  async updateContest(id: string, updates: Partial<Contest>): Promise<Contest | undefined> {
    const index = this.contests.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.contests[index] = {
      ...this.contests[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.contests[index];
  }

  async joinContest(participation: InsertContestParticipant): Promise<ContestParticipant> {
    const newParticipant: ContestParticipant = {
      id: `participant_${Math.random().toString(36).substr(2, 9)}`,
      contestId: participation.contestId,
      userId: participation.userId,
      entryTxHash: participation.entryTxHash || null,
      joinedAt: new Date(),
    };
    this.participants.push(newParticipant);
    return newParticipant;
  }

  async getContestParticipants(contestId: string): Promise<ContestParticipant[]> {
    return this.participants
      .filter(p => p.contestId === contestId)
      .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
  }

  async getUserCreatedContests(userId: string): Promise<Contest[]> {
    return this.contests
      .filter(c => c.creatorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserParticipatedContests(userId: string): Promise<Contest[]> {
    const userParticipations = this.participants.filter(p => p.userId === userId);
    const contestIds = userParticipations.map(p => p.contestId);
    return this.contests
      .filter(c => contestIds.includes(c.id))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPlatformStats(): Promise<{
    totalPrizes: number;
    activeContests: number;
    totalParticipants: number;
    contestsCompleted: number;
  }> {
    return {
      totalPrizes: this.contests.reduce((sum, c) => sum + Number(c.prizePool), 0),
      activeContests: this.contests.filter(c => c.status === "active").length,
      totalParticipants: this.participants.length,
      contestsCompleted: this.contests.filter(c => c.status === "completed").length,
    };
  }
}

export const mockStorage = new MockStorage();
