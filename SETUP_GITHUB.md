# GitHub Repository Setup Guide

## Prerequisites

1. GitHub account
2. Git installed on your local machine
3. GitHub CLI (optional but recommended)

## Method 1: Using GitHub Web Interface (Recommended)

### Step 1: Create Repository on GitHub
1. Go to [GitHub](https://github.com)
2. Click "New repository" or go to https://github.com/new
3. Set repository name: `competer-miniapp`
4. Set description: "On-chain contest platform mini-app on Base blockchain for Farcaster"
5. Choose "Public" repository
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 2: Download All Files from Replit
1. In Replit, go to the file explorer
2. Click the three dots menu (⋮) next to the project name
3. Select "Download as zip"
4. Extract the zip file to your local machine

### Step 3: Initialize Git and Push
Open terminal in the extracted folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Competer contest platform"

# Add GitHub remote (replace 'Gabrielnvk' with your username if different)
git remote add origin https://github.com/Gabrielnvk/competer-miniapp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Method 2: Using GitHub CLI (If you have it installed)

```bash
# Create repository directly from command line
gh repo create Gabrielnvk/competer-miniapp --public --description "On-chain contest platform mini-app on Base blockchain for Farcaster"

# Initialize git and push
git init
git add .
git commit -m "Initial commit: Complete Competer contest platform"
git remote add origin https://github.com/Gabrielnvk/competer-miniapp.git
git branch -M main
git push -u origin main
```

## Method 3: Direct Upload via GitHub Web Interface

If you prefer not to use Git command line:

1. Create the repository on GitHub (Step 1 above)
2. Click "uploading an existing file" on the empty repository page
3. Drag and drop all files from your Replit project
4. Write commit message: "Initial commit: Complete Competer contest platform"
5. Click "Commit changes"

## Verify Repository Contents

After pushing, your repository should contain:

### Root Files
- README.md
- LICENSE
- .gitignore
- .env.example
- package.json
- package-lock.json
- tsconfig.json
- tailwind.config.ts
- vite.config.ts
- drizzle.config.ts
- postcss.config.js
- components.json
- replit.md

### Documentation
- CONTRIBUTING.md
- ARCHITECTURE.md
- FEATURES.md
- DEPLOYMENT.md
- SETUP_GITHUB.md

### Source Code
- client/ (React frontend)
- server/ (Express backend)
- shared/ (Shared schemas)
- contracts/ (Smart contracts)
- public/ (Static assets)

## Post-Push Setup

### 1. Repository Settings
- Go to repository Settings
- Under "General" → "Features", enable:
  - Issues
  - Discussions (optional)
  - Projects (optional)

### 2. Branch Protection (Optional)
- Go to Settings → Branches
- Add rule for `main` branch
- Enable "Require pull request reviews before merging"

### 3. Repository Topics
Add these topics to help with discovery:
- farcaster
- base-blockchain
- ethereum
- contest-platform
- react
- typescript
- web3
- onchain
- miniapp

### 4. Update Repository Description
Set description: "🏆 On-chain contest platform mini-app built for Farcaster on Base blockchain. Create and participate in contests with automated prize distribution."

## Troubleshooting

### Authentication Issues
If you get authentication errors:
1. Use personal access token instead of password
2. Generate token at: GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Use token as password when prompted

### Large File Issues
If any files are too large:
1. Add them to .gitignore
2. Use Git LFS for large assets
3. Consider alternative hosting for large media files

### Permission Issues
Make sure you have:
1. Write access to the repository
2. Correct repository URL
3. Valid authentication credentials

## Success Verification

After successful push, verify:
1. All files are visible on GitHub
2. README.md displays properly
3. Package.json shows correct dependencies
4. Repository has proper description and topics
5. Issues and discussions are enabled if desired

Your repository is now live at: https://github.com/Gabrielnvk/competer-miniapp

## Next Steps

1. Share repository with collaborators
2. Set up deployment on Replit or other platforms
3. Configure continuous integration (optional)
4. Start accepting contributions from the community