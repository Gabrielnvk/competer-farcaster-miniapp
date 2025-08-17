import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContestSchema, insertUserSchema, insertContestParticipantSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.address);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Contest routes
  app.get("/api/contests", async (req, res) => {
    try {
      const { status, category } = req.query;
      const contests = await storage.getContests({
        status: status as string,
        category: category as string,
      });
      res.json(contests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contests" });
    }
  });

  app.get("/api/contests/:id", async (req, res) => {
    try {
      const contest = await storage.getContestById(req.params.id);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }
      res.json(contest);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contest" });
    }
  });

  app.post("/api/contests", async (req, res) => {
    try {
      // Convert date strings to Date objects
      const bodyWithDates = {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      };
      
      const contestData = insertContestSchema.parse(bodyWithDates);
      const contest = await storage.createContest(contestData);
      res.json(contest);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ 
          error: "Invalid contest data", 
          details: error.message 
        });
      }
      res.status(400).json({ error: "Invalid contest data", details: "Unknown error" });
    }
  });

  app.put("/api/contests/:id", async (req, res) => {
    try {
      const updates = req.body;
      const contest = await storage.updateContest(req.params.id, updates);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }
      res.json(contest);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contest" });
    }
  });

  // Contest participation routes
  app.post("/api/contests/:id/join", async (req, res) => {
    try {
      const { userId, entryTxHash } = req.body;
      const participation = await storage.joinContest({
        contestId: req.params.id,
        userId,
        entryTxHash,
      });
      res.json(participation);
    } catch (error) {
      res.status(400).json({ error: "Failed to join contest" });
    }
  });

  app.get("/api/contests/:id/participants", async (req, res) => {
    try {
      const participants = await storage.getContestParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  // User contests
  app.get("/api/users/:id/created-contests", async (req, res) => {
    try {
      const contests = await storage.getUserCreatedContests(req.params.id);
      res.json(contests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch created contests" });
    }
  });

  app.get("/api/users/:id/participated-contests", async (req, res) => {
    try {
      const contests = await storage.getUserParticipatedContests(req.params.id);
      res.json(contests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participated contests" });
    }
  });

  // Platform stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
