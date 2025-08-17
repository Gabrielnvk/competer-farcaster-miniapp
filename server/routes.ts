import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mockStorage } from "./mock-storage";
import { insertContestSchema, insertUserSchema, insertContestParticipantSchema } from "@shared/schema";
import { z } from "zod";

// Use mock storage temporarily until Supabase certificate is refreshed
const activeStorage = mockStorage;

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await activeStorage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const user = await activeStorage.getUserByWallet(req.params.address);
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
      const contests = await activeStorage.getContests({
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
      const contest = await activeStorage.getContestById(req.params.id);
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
      const contest = await activeStorage.createContest(contestData);
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
      const contest = await activeStorage.updateContest(req.params.id, updates);
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
      const participation = await activeStorage.joinContest({
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
      const participants = await activeStorage.getContestParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  // User contests
  app.get("/api/users/:id/created-contests", async (req, res) => {
    try {
      const contests = await activeStorage.getUserCreatedContests(req.params.id);
      res.json(contests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch created contests" });
    }
  });

  app.get("/api/users/:id/participated-contests", async (req, res) => {
    try {
      const contests = await activeStorage.getUserParticipatedContests(req.params.id);
      res.json(contests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participated contests" });
    }
  });

  // Platform stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await activeStorage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Farcaster Frame endpoints
  app.get("/api/frames/contest/:id/image", async (req, res) => {
    try {
      const contest = await activeStorage.getContestById(req.params.id);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      // Generate frame image HTML with CSS styling
      const html = `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 40px;
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 1200px;
                height: 630px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
              }
              .container {
                text-align: center;
                max-width: 1000px;
              }
              .title {
                font-size: 56px;
                font-weight: bold;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              }
              .description {
                font-size: 24px;
                margin-bottom: 30px;
                opacity: 0.9;
                line-height: 1.4;
              }
              .stats {
                display: flex;
                justify-content: center;
                gap: 60px;
                margin-top: 40px;
              }
              .stat {
                text-align: center;
              }
              .stat-value {
                font-size: 36px;
                font-weight: bold;
                display: block;
              }
              .stat-label {
                font-size: 18px;
                opacity: 0.8;
              }
              .emoji {
                font-size: 48px;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="emoji">🏆</div>
              <h1 class="title">${contest.title}</h1>
              <p class="description">${contest.description.substring(0, 150)}${contest.description.length > 150 ? '...' : ''}</p>
              <div class="stats">
                <div class="stat">
                  <span class="stat-value">${contest.prizePool}</span>
                  <span class="stat-label">ETH Prize</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${contest.entryFee}</span>
                  <span class="stat-label">Entry Fee</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${contest.maxParticipants}</span>
                  <span class="stat-label">Max Players</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate frame image" });
    }
  });

  app.post("/api/frames/contest/:id/join", async (req, res) => {
    try {
      const contest = await activeStorage.getContestById(req.params.id);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      // Farcaster frame response
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:title" content="Contest Joined!" />
            <meta property="fc:frame:description" content="Successfully joined ${contest.title}" />
            <meta property="fc:frame:image" content="${req.protocol}://${req.get('host')}/api/frames/contest/${contest.id}/success" />
            <meta property="fc:frame:button:1" content="View Contest" />
            <meta property="fc:frame:button:1:action" content="link" />
            <meta property="fc:frame:button:1:target" content="${req.protocol}://${req.get('host')}/contest/${contest.id}" />
          </head>
          <body>
            <h1>Joined ${contest.title}!</h1>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).json({ error: "Failed to join contest" });
    }
  });

  app.get("/api/frames/contest/:id/success", async (req, res) => {
    try {
      const contest = await activeStorage.getContestById(req.params.id);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      const html = `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 40px;
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
                color: white;
                width: 1200px;
                height: 630px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                text-align: center;
              }
              .emoji {
                font-size: 120px;
                margin-bottom: 30px;
              }
              .title {
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .subtitle {
                font-size: 24px;
                opacity: 0.9;
              }
            </style>
          </head>
          <body>
            <div class="emoji">🎉</div>
            <h1 class="title">Successfully Joined!</h1>
            <p class="subtitle">Welcome to ${contest.title}</p>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate success image" });
    }
  });

  // Farcaster webhook endpoint
  app.post("/api/webhooks/farcaster", async (req, res) => {
    try {
      console.log('📨 Farcaster webhook received:', req.body);
      // Handle Farcaster events here
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
