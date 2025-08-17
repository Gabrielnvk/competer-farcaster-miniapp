import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, numeric, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contestStatusEnum = pgEnum("contest_status", ["draft", "active", "completed", "cancelled"]);
export const contestCategoryEnum = pgEnum("contest_category", ["hackathon", "gaming", "sports", "creative", "prediction", "custom"]);
export const prizeTypeEnum = pgEnum("prize_type", ["winner-takes-all", "top-three", "sponsor-funded"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: varchar("wallet_address").notNull().unique(),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contests = pgTable("contests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: contestCategoryEnum("category").notNull(),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  contractAddress: varchar("contract_address"),
  prizePool: numeric("prize_pool", { precision: 18, scale: 8 }).notNull().default("0"),
  entryFee: numeric("entry_fee", { precision: 18, scale: 8 }).notNull().default("0"),
  maxParticipants: integer("max_participants").notNull(),
  status: contestStatusEnum("status").notNull().default("draft"),
  prizeType: prizeTypeEnum("prize_type").notNull().default("winner-takes-all"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contestParticipants = pgTable("contest_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestId: varchar("contest_id").references(() => contests.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  entryTxHash: varchar("entry_tx_hash"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const contestWinners = pgTable("contest_winners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestId: varchar("contest_id").references(() => contests.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  position: integer("position").notNull(),
  prizeAmount: numeric("prize_amount", { precision: 18, scale: 8 }).notNull(),
  prizeTxHash: varchar("prize_tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdContests: many(contests),
  participatedContests: many(contestParticipants),
  wonContests: many(contestWinners),
}));

export const contestsRelations = relations(contests, ({ one, many }) => ({
  creator: one(users, {
    fields: [contests.creatorId],
    references: [users.id],
  }),
  participants: many(contestParticipants),
  winners: many(contestWinners),
}));

export const contestParticipantsRelations = relations(contestParticipants, ({ one }) => ({
  contest: one(contests, {
    fields: [contestParticipants.contestId],
    references: [contests.id],
  }),
  user: one(users, {
    fields: [contestParticipants.userId],
    references: [users.id],
  }),
}));

export const contestWinnersRelations = relations(contestWinners, ({ one }) => ({
  contest: one(contests, {
    fields: [contestWinners.contestId],
    references: [contests.id],
  }),
  user: one(users, {
    fields: [contestWinners.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContestSchema = createInsertSchema(contests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContestParticipantSchema = createInsertSchema(contestParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertContestWinnerSchema = createInsertSchema(contestWinners).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Contest = typeof contests.$inferSelect;
export type InsertContest = z.infer<typeof insertContestSchema>;
export type ContestParticipant = typeof contestParticipants.$inferSelect;
export type InsertContestParticipant = z.infer<typeof insertContestParticipantSchema>;
export type ContestWinner = typeof contestWinners.$inferSelect;
export type InsertContestWinner = z.infer<typeof insertContestWinnerSchema>;
