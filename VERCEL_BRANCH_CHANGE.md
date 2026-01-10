# How to Change Vercel Deployment Branch

## Current Situation
- Vercel is deploying from: `copilot/sub-pr-32` (has build errors)
- Recommended branch: `main` (after applying fix) or `cursor/sync-local-repo-to-github-gpt-5.1-codex-high-faf5` (has all fixes)

## Steps to Change Branch in Vercel Dashboard

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in to your account

2. **Select Your Project**
   - Click on the `drrweb` project (or your project name)

3. **Go to Settings**
   - Click on **Settings** tab (top navigation)

4. **Navigate to Git**
   - In the left sidebar, click **Git**

5. **Change Production Branch**
   - Find **Production Branch** section
   - Click the dropdown/input field
   - Change from `copilot/sub-pr-32` to `main`
   - Click **Save**

6. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or wait for the next push to `main` to auto-deploy

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# Link to your project (if not already linked)
vercel link

# Set production branch
vercel git connect
# Follow prompts to select branch

# Or update project settings
vercel project ls
# Then update via dashboard
```

## Important: Apply Fix to Main First

Before changing to `main`, you need to apply the deployment fix:

**The fix needed in `package.json` on `main`:**
- Remove the `prebuild` script line entirely

**Quick fix command (run from main branch):**
```bash
git checkout main
# Edit package.json to remove "prebuild" line
git add package.json
git commit -m "Remove prebuild script for Vercel deployment"
git push origin main
```

## Alternative: Use Fixed Branch Directly

If you want to deploy from the already-fixed branch:

1. In Vercel Dashboard → Settings → Git
2. Change **Production Branch** to: `cursor/sync-local-repo-to-github-gpt-5.1-codex-high-faf5`
3. Save and redeploy

This branch already has all the fixes applied.

## Verify the Fix

After changing the branch, check that:
- ✅ Build succeeds (no prebuild errors)
- ✅ Site deploys successfully
- ✅ All routes work
- ✅ Environment variables are set (if needed)

## After Changing Branch

1. **Set Environment Variables** (if not already set):
   - Go to Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, etc.
   - Make sure they're set for **Production** environment

2. **Redeploy**:
   - The next push to the new branch will auto-deploy
   - Or manually trigger a redeploy from Deployments tab

3. **Test**:
   - Visit your Vercel URL
   - Test all three modes
   - Verify features work
