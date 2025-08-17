# 🏆 Competer - Farcaster Mini-App

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/competer-farcaster-miniapp)

## 🎯 Overview

Competer is a **Farcaster Mini-App** that enables users to create and participate in on-chain contests with automated prize distribution. Built on the **Base blockchain** using **OnchainKit** and **MiniKit**, the platform supports various contest types including hackathons, sports betting, online games, creative challenges, and prediction markets.

## ✨ Farcaster Integration Features

- 📱 **Native Mini-App**: Runs seamlessly within Farcaster clients
- 🖼️ **Contest Frames**: Beautiful, shareable contest cards in Farcaster feeds  
- 📤 **Native Sharing**: One-click sharing of contests on Farcaster
- 🔐 **Farcaster Auth**: Login with your Farcaster identity (FID-based)
- ⚡ **Real-time Updates**: Live contest stats and notifications

## Features

- **Contest Creation**: Create contests with configurable parameters (title, description, entry fee, duration, prize mechanism)
- **Multiple Contest Types**: Support for hackathons, gaming, sports, creative challenges, prediction markets, and custom contests
- **Prize Distribution**: Automated prize distribution through smart contracts with multiple distribution types:
  - Winner takes all
  - Top three prizes
  - Sponsor-funded rewards
- **Wallet Integration**: Seamless wallet connection using OnchainKit for Base blockchain
- **Real-time Updates**: Live contest stats and participant tracking
- **Responsive Design**: Modern UI that works across desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Tailwind CSS** with shadcn/ui components
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **OnchainKit** for Coinbase wallet and Base blockchain integration

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Neon** for serverless PostgreSQL hosting
- **Zod** for runtime validation

### Blockchain
- **Base** (Ethereum L2) for low-cost transactions
- **Smart Contracts** for contest management and prize distribution
- **Solidity** for contract development

## Project Structure

```
competer-miniapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── main.tsx       # App entry point
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── db.ts             # Database connection
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
├── contracts/            # Smart contracts
│   ├── ContestFactory.sol
│   └── Contest.sol
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gabrielnvk/competer-miniapp.git
cd competer-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Add your database URL
DATABASE_URL="your-postgresql-connection-string"
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🚀 Deploy to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/competer-farcaster-miniapp)

### Manual Deployment

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/competer-farcaster-miniapp.git
cd competer-farcaster-miniapp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Deploy to Vercel**:
```bash
npx vercel --prod
```

### Environment Variables

Set these in your Vercel dashboard:

- `DATABASE_URL` - Your PostgreSQL database URL (Supabase/Neon)
- `NODE_ENV` - Set to `production`

## 📱 Farcaster Mini-App Setup

After deployment:

1. **Update Manifest**: Replace URLs in `public/.well-known/farcaster.json` with your live domain
2. **Test Frames**: Visit `/api/frames/contest/[id]/image` to test frame generation
3. **Submit to Farcaster**: Use Farcaster Developer Tools to register your Mini-App

## 🖼️ Frame Endpoints

- `GET /.well-known/farcaster.json` - Farcaster manifest
- `GET /api/frames/contest/:id/image` - Contest frame image
- `POST /api/frames/contest/:id/join` - Join contest action
- `POST /api/webhooks/farcaster` - Farcaster webhook handler

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User profiles with wallet addresses
- **contests**: Contest information including metadata, prizes, and timing
- **contest_participants**: Tracks user participation in contests
- **contest_winners**: Records prize distribution and winners

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/wallet/:address` - Get user by wallet address

### Contests
- `GET /api/contests` - List contests with optional filtering
- `POST /api/contests` - Create a new contest
- `GET /api/contests/:id` - Get specific contest details
- `POST /api/contests/:id/join` - Join a contest
- `GET /api/contests/:id/participants` - Get contest participants

### Stats
- `GET /api/stats` - Get platform statistics

## Smart Contracts

### ContestFactory.sol
Factory contract for deploying individual contest contracts with standardized functionality.

### Contest.sol
Individual contest contract managing:
- Entry fee collection
- Prize pool escrow
- Automated distribution
- Winner selection and validation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to your branch: `git push origin feature-name`
5. Submit a pull request

## Deployment

The application is designed to be deployed on Replit with automatic deployment capabilities:

1. Connect your Replit account to this repository
2. Configure environment variables in Replit
3. Use Replit's deployment feature for production hosting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the Farcaster ecosystem on Base blockchain.