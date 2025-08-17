# Competer - On-Chain Contest Platform

## Overview

Competer is a Farcaster Mini-App that enables users to create and participate in on-chain contests with automated prize distribution. Built on the Base blockchain, the platform supports various contest types including hackathons, sports betting, online games, creative challenges, and prediction markets. The application features smart contract integration for secure escrow and prize distribution, with a modern React frontend and Express.js backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Blockchain Integration**: 
  - OnchainKit for Coinbase wallet connectivity and Base blockchain interactions
  - ConnectKit for wallet connection UI
  - Wagmi for Ethereum wallet interactions

### Backend Architecture
- **Framework**: Express.js with TypeScript running in ESM mode
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL with connection pooling
- **API Design**: RESTful API with CRUD operations for users, contests, and participation
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon with the following schema:
  - Users table with wallet address and username
  - Contests table with comprehensive contest metadata, prize pools, and timing
  - Contest participants table tracking user participation and transaction hashes
  - Contest winners table for prize distribution records
- **Schema Management**: Drizzle migrations with type-safe schema definitions
- **Validation**: Zod schemas for runtime type validation and form validation

### Authentication and Authorization
- **Wallet-Based Authentication**: Users authenticate using their Ethereum wallet addresses
- **Automatic User Creation**: New users are automatically created when connecting a wallet for the first time
- **Session Management**: Server-side sessions stored in PostgreSQL for maintaining user state

### External Dependencies
- **Blockchain Network**: Base (Ethereum L2) for low-cost transactions
- **Wallet Providers**: Coinbase Wallet integration with OnchainKit
- **Database**: Neon serverless PostgreSQL
- **Farcaster Integration**: MiniKit for Farcaster Mini-App functionality
- **Smart Contract Integration**: Custom contest factory and individual contest contracts for escrow and prize distribution
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Form Management**: React Hook Form with Zod resolvers for type-safe form validation