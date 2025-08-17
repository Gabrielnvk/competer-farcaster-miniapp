# Contributing to Competer

Thank you for your interest in contributing to Competer! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/competer-miniapp.git
   cd competer-miniapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your development environment following the README instructions

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Use Prettier for code formatting
- **Linting**: Follow ESLint rules
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Add comments for complex logic and business rules

### Architecture Principles

1. **Frontend First**: Keep business logic in the frontend when possible
2. **Minimal Backend**: Backend should focus on data persistence and API calls
3. **Type Safety**: Use Zod schemas for validation and type inference
4. **Component Reusability**: Create reusable components in the components directory

### Database Changes

1. **Schema First**: Always update `shared/schema.ts` first
2. **Migrations**: Use `npm run db:push` for schema changes
3. **Relations**: Explicitly model all relations using Drizzle relations
4. **Validation**: Update Zod schemas when changing database structure

## Submitting Changes

### Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the guidelines above

3. Test your changes:
   ```bash
   npm run dev
   # Test all functionality affected by your changes
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request on GitHub

### Commit Message Format

Use conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Requirements

- [ ] Code follows the project style guidelines
- [ ] Changes are tested and working
- [ ] Documentation is updated if needed
- [ ] No breaking changes without discussion
- [ ] All CI checks pass

## Feature Requests

1. Check existing issues first
2. Create a new issue with the "enhancement" label
3. Describe the feature and its benefits
4. Discuss implementation approach if complex

## Bug Reports

1. Check if the bug already exists in issues
2. Create a detailed bug report including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser/environment details
   - Screenshots if applicable

## Code Review Process

1. All changes require review before merging
2. Address all review comments
3. Ensure CI passes
4. Maintainer will merge approved PRs

## Development Setup

### Required Tools

- Node.js 18+
- npm or yarn
- PostgreSQL (or Neon account)
- Git

### Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Update with your configuration:
   ```bash
   DATABASE_URL="your-database-url"
   ```

3. Initialize database:
   ```bash
   npm run db:push
   ```

### Testing

- Test all user flows manually
- Verify database operations work correctly
- Check responsive design on different screen sizes
- Test wallet connection functionality

## Resources

- [Project Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Base Blockchain Docs](https://docs.base.org/)

## Questions?

Feel free to open an issue for any questions about contributing or reach out to the maintainers.

Thank you for contributing to Competer! 🎉