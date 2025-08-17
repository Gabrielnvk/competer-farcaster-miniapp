# Deployment Guide

## Replit Deployment (Recommended)

1. **Import Repository**:
   - Go to [Replit](https://replit.com)
   - Click "Create Repl"
   - Select "Import from GitHub"
   - Enter: `https://github.com/Gabrielnvk/competer-miniapp`

2. **Configure Environment**:
   - Go to "Secrets" tab in Replit
   - Add the following environment variables:
     ```
     DATABASE_URL=your_neon_postgres_url
     NODE_ENV=production
     ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Setup Database**:
   ```bash
   npm run db:push
   ```

5. **Deploy**:
   - Click the "Deploy" button in Replit
   - Your app will be available at `https://your-repl-name.your-username.repl.co`

## Database Setup (Neon)

1. **Create Neon Account**:
   - Go to [Neon](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Connection String**:
   - Copy the connection string from your Neon dashboard
   - Add it to your environment variables as `DATABASE_URL`

3. **Initialize Schema**:
   ```bash
   npm run db:push
   ```

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production" for deployment

### Optional
- `COINBASE_API_KEY` - For enhanced wallet features
- `BASE_RPC_URL` - Custom Base network RPC endpoint

## Production Considerations

1. **Security**:
   - Ensure all environment variables are properly set
   - Use HTTPS in production
   - Validate all user inputs

2. **Performance**:
   - Database connection pooling is configured
   - Frontend assets are optimized with Vite
   - Consider CDN for static assets

3. **Monitoring**:
   - Set up error tracking
   - Monitor database performance
   - Track user engagement metrics

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Verify `DATABASE_URL` is correct
   - Check network connectivity
   - Ensure database is running

2. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Wallet Connection Issues**:
   - Ensure OnchainKit is properly configured
   - Check Base network settings
   - Verify wallet extension is installed

### Support

For deployment issues:
1. Check the [Issues](https://github.com/Gabrielnvk/competer-miniapp/issues) page
2. Create a new issue with deployment logs
3. Contact the development team