# Competer Architecture

## Overview

Competer is built as a full-stack web application with a React frontend, Express.js backend, and PostgreSQL database. The application follows modern web development patterns with a focus on type safety and developer experience.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express.js API │    │   PostgreSQL    │
│                 │    │                 │    │                 │
│ • Pages         │◄──►│ • Routes        │◄──►│ • Users         │
│ • Components    │    │ • Storage       │    │ • Contests      │
│ • Hooks         │    │ • Validation    │    │ • Participants  │
│ • State Mgmt    │    │                 │    │ • Winners       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Base Chain    │    │    OnchainKit   │    │  Smart Contracts│
│                 │    │                 │    │                 │
│ • Transactions  │    │ • Wallet Conn.  │    │ • Contest Logic │
│ • Token Mgmt    │    │ • Account Mgmt  │    │ • Prize Distrib │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Structure
```
client/src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── contest-*        # Contest-related components
│   ├── user-*           # User-related components
│   └── layout/          # Layout components
├── pages/               # Route pages
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── main.tsx            # Application entry point
```

### State Management

- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Local State**: Component-level state with useState
- **Context**: Shared application state (wallet, theme)

### Key Design Patterns

1. **Container/Presentation**: Pages act as containers, components handle presentation
2. **Custom Hooks**: Encapsulate data fetching and business logic
3. **Type Safety**: Full TypeScript coverage with shared types
4. **Error Boundaries**: Graceful error handling at component level

## Backend Architecture

### Service Layer Structure
```
server/
├── index.ts          # Application entry point
├── routes.ts         # API route definitions
├── storage.ts        # Data access layer
├── db.ts             # Database connection
└── vite.ts           # Development server integration
```

### Data Access Pattern

```typescript
interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>
  createUser(user: InsertUser): Promise<User>
  
  // Contest operations  
  getContests(filters?: FilterOptions): Promise<Contest[]>
  createContest(contest: InsertContest): Promise<Contest>
  
  // Participation
  joinContest(participation: InsertContestParticipant): Promise<ContestParticipant>
}
```

### API Design

- **RESTful Routes**: Standard HTTP methods and status codes
- **Request Validation**: Zod schemas for type-safe validation
- **Error Handling**: Consistent error response format
- **JSON Communication**: All data exchange in JSON format

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│    Users    │    │     Contests     │    │ Participants│
│             │    │                  │    │             │
│ id (PK)     │◄──┐│ id (PK)          │┌──►│ id (PK)     │
│ wallet_addr │   ││ creator_id (FK)  ││   │ contest_id  │
│ username    │   ││ title            ││   │ user_id     │
│ created_at  │   ││ description      ││   │ entry_hash  │
└─────────────┘   ││ category         ││   │ joined_at   │
                  ││ prize_pool       ││   └─────────────┘
                  ││ entry_fee        ││
                  ││ max_participants ││   ┌─────────────┐
                  ││ status           ││   │   Winners   │
                  ││ prize_type       ││   │             │
                  ││ start_time       ││   │ id (PK)     │
                  ││ end_time         │└──►│ contest_id  │
                  │└─ created_at      │    │ user_id     │
                  └─ updated_at       │    │ position    │
                    contract_address  │    │ prize_amount│
                  └──────────────────┘    │ prize_hash  │
                                          └─────────────┘
```

### Schema Design Principles

1. **Normalized Structure**: Minimize data duplication
2. **Foreign Key Constraints**: Ensure referential integrity
3. **Indexed Columns**: Optimize for common query patterns
4. **Timestamps**: Track creation and modification times
5. **UUIDs**: Use UUID primary keys for distributed systems

## Blockchain Integration

### Smart Contract Architecture

```solidity
// Contest Factory Pattern
contract ContestFactory {
    function createContest(
        string memory title,
        uint256 entryFee,
        uint256 maxParticipants,
        uint256 duration
    ) external returns (address contestAddress);
}

// Individual Contest Contract
contract Contest {
    function joinContest() external payable;
    function endContest() external;
    function distributePrizes(address[] memory winners) external;
}
```

### OnchainKit Integration

```typescript
// Wallet Connection
const { address, isConnected } = useAccount();

// Transaction Handling
const { writeContract } = useWriteContract();

// Contract Interaction
const contestContract = getContract({
    address: contestAddress,
    abi: ContestABI,
});
```

## Security Considerations

### Frontend Security
- **Input Validation**: Client-side validation with server-side verification
- **XSS Prevention**: Sanitize user inputs and use secure rendering
- **CSRF Protection**: Use proper CORS configuration
- **Wallet Security**: Secure wallet connection and transaction signing

### Backend Security
- **SQL Injection**: Use parameterized queries with Drizzle ORM
- **Rate Limiting**: Implement API rate limiting
- **Environment Variables**: Secure storage of sensitive configuration
- **Input Validation**: Server-side validation with Zod schemas

### Blockchain Security
- **Smart Contract Auditing**: Comprehensive contract testing
- **Reentrancy Protection**: Use OpenZeppelin security patterns
- **Access Control**: Proper role-based permissions
- **Prize Pool Security**: Secure escrow mechanisms

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy load components and routes
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Compressed and responsive images
- **Caching**: Browser caching and React Query caching

### Backend Performance
- **Database Indexing**: Optimize query performance
- **Connection Pooling**: Efficient database connections
- **Response Compression**: Gzip compression for responses
- **Caching**: Redis caching for frequent queries

### Blockchain Performance
- **Batch Transactions**: Group multiple operations
- **Gas Optimization**: Efficient contract execution
- **Network Selection**: Use Base for lower costs
- **Transaction Monitoring**: Track and optimize gas usage

## Deployment Architecture

### Development Environment
```
Local Machine
├── React Dev Server (Vite)
├── Express.js Server
├── PostgreSQL Database
└── Smart Contract Testing
```

### Production Environment
```
Replit Platform
├── Containerized Application
├── Neon PostgreSQL
├── Base Mainnet
└── CDN Asset Delivery
```

## Monitoring and Analytics

### Application Monitoring
- **Error Tracking**: Capture and analyze errors
- **Performance Metrics**: Monitor response times and throughput
- **User Analytics**: Track user engagement and behavior
- **Database Monitoring**: Query performance and connection health

### Blockchain Monitoring
- **Transaction Status**: Monitor transaction success/failure
- **Gas Usage**: Track and optimize gas consumption
- **Contract Events**: Listen for important contract events
- **Network Health**: Monitor Base network status

## Future Architecture Considerations

### Scalability Improvements
- **Microservices**: Break down monolithic backend
- **Caching Layer**: Implement Redis for session and data caching
- **CDN Integration**: Global content delivery network
- **Load Balancing**: Horizontal scaling with multiple instances

### Feature Enhancements
- **Real-time Updates**: WebSocket integration for live updates
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Comprehensive dashboard and reporting
- **Multi-chain Support**: Extend beyond Base blockchain

This architecture provides a solid foundation for the Competer platform while maintaining flexibility for future growth and enhancements.