# How to Find and Change Production Branch in Vercel

## Method 1: Via Project Settings (Most Common)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in

2. **Select Your Project**
   - Click on `drrweb` (or your project name)

3. **Go to Settings**
   - Click **Settings** in the top navigation bar
   - (It's usually next to "Deployments" and "Analytics")

4. **Find Git Section**
   - In the left sidebar under Settings, look for:
     - **Git** (most common name)
     - **Git Repository** 
     - **Source**
     - **Repository**

5. **Look for Branch Settings**
   - You should see:
     - **Production Branch** (dropdown or input field)
     - **Branch** settings
     - Or it might be under **Deployment** section

## Method 2: Check Project Overview

Sometimes the branch is shown on the main project page:

1. Go to your project dashboard
2. Look at the top right or project header
3. You might see the current branch displayed
4. Click on it to change

## Method 3: Via Deployments Tab

1. Go to **Deployments** tab
2. Look for a settings icon or "..." menu on a deployment
3. Check for branch configuration options

## Method 4: Via Vercel CLI (Alternative)

If you can't find it in the UI, use the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to project (if not already)
cd /path/to/drrweb
vercel link

# Check current settings
vercel project ls

# The branch is usually set when you first connect the repo
# You may need to disconnect and reconnect to change it
```

## Method 5: Disconnect and Reconnect Git Repository

If you can't find the setting:

1. **Settings** → **Git** (or **Repository**)
2. Look for **Disconnect** or **Remove** button
3. Click it to disconnect the repository
4. Click **Connect Git Repository** or **Add Git Repository**
5. Select your repository again
6. **During connection**, you'll be asked which branch to use for production
7. Select: `cursor/sync-local-repo-to-github-gpt-5.1-codex-high-faf5` or `main`

## Method 6: Check All Settings Sections

The branch setting might be in different places depending on Vercel's UI version:

- **Settings** → **Git** → **Production Branch**
- **Settings** → **General** → **Production Branch**
- **Settings** → **Deployments** → **Production Branch**
- **Settings** → **Repository** → **Branch**

## Visual Guide

Look for these UI elements:
- A dropdown menu labeled "Branch" or "Production Branch"
- A text input field showing the current branch name
- A section header that says "Git" or "Repository"
- Settings icon (gear) in the top right of project page

## If Still Can't Find It

1. **Check Vercel Documentation**: https://vercel.com/docs/concepts/git
2. **Contact Vercel Support**: They can help locate the setting
3. **Use the CLI method** (Method 4) - it's more reliable
4. **Disconnect/Reconnect** (Method 5) - this always works

## Quick Alternative: Create a New Deployment

If changing the branch is too difficult:

1. Go to **Deployments** tab
2. Click **Create Deployment** (or **Deploy** button)
3. Select branch: `cursor/sync-local-repo-to-github-gpt-5.1-codex-high-faf5`
4. Deploy it
5. Promote it to Production (if needed)

This will deploy from the correct branch even if the default branch setting isn't changed.
