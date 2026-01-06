# Deployment Guide

Complete deployment instructions for various hosting platforms.

## 🚀 Recommended: Vercel (Easiest for Next.js)

Vercel is made by the creators of Next.js and offers the best integration.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Sign up/Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (easiest)

3. **Import your project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

4. **Configure environment variables**:
   - In project settings → Environment Variables
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL` (if using Supabase)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using Supabase)
     - `ANTHROPIC_API_KEY` (if using Anthropic)
     - `AI_GATEWAY_API_KEY` (if using Vercel AI Gateway)
     - `ELEVENLABS_API_KEY` (if using voice generation)
   - Click "Redeploy" after adding variables

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `your-project-name.vercel.app`

6. **Custom domain** (optional):
   - Go to Project Settings → Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Follow DNS instructions (see DNS Setup section below)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No (first time)
# - Project name? (press enter for default)
# - Directory? (press enter for ./)
# - Override settings? No

# For production deployment:
vercel --prod
```

### Vercel DNS Setup

After deploying to Vercel and adding your custom domain:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. **Add your domain**: `yourdomain.com` and `www.yourdomain.com`
3. **Vercel will show you the DNS records needed**

#### For Root Domain (yourdomain.com)

**Option A: Using A Records**
- **Type**: `A`
- **Name**: `@` (or leave blank - represents root domain)
- **Value**: `76.76.21.21` (Vercel's IP - verify current IPs in Vercel dashboard)
- **TTL**: `3600` (or default)

**Option B: Using CNAME (if your DNS provider supports it)**
- **Type**: `CNAME` (or `ALIAS` if supported)
- **Name**: `@` (or leave blank)
- **Value**: `cname.vercel-dns.com`
- **TTL**: `3600`

#### For WWW Subdomain (www.yourdomain.com)

- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`
- **TTL**: `3600`

**Note:** Vercel IPs can change. Always verify current IPs in the Vercel dashboard or documentation.

## 🌐 Alternative: Netlify

1. **Push to GitHub** (same as above)

2. **Sign up at [netlify.com](https://netlify.com)**

3. **Add new site from Git**:
   - Connect GitHub
   - Select your repository

4. **Build settings** (auto-detected, but verify):
   - Build command: `npm run build`
   - Publish directory: `.next` (or `out` if using static export)

5. **Environment variables**:
   - Site settings → Environment variables
   - Add all variables from your `.env.local`

6. **Deploy**

## 🐳 Alternative: Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **New Project → Deploy from GitHub**

3. **Select your repository**

4. **Add environment variables** (if using Supabase/AI)

5. **Deploy** - Railway auto-detects Next.js

## 📦 Self-Hosted (VPS/Docker)

### Using Docker:

1. **Create `Dockerfile`**:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

2. **Update `next.config.mjs`** to enable standalone output:
```javascript
const nextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

3. **Build and run**:
```bash
docker build -t drrweb .
docker run -p 3000:3000 drrweb
```

### Using VPS (Ionos, DigitalOcean, etc.)

1. **Connect to your VPS via SSH**

2. **Install Node.js** (if not already installed):
   ```bash
   # For Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Upload your project**:
   ```bash
   # On VPS
   cd /var/www
   git clone your-repository-url drrweb
   cd drrweb
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set environment variables**:
   ```bash
   # Create .env.local
   nano .env.local
   # Add your environment variables
   ```

6. **Build the project**:
   ```bash
   npm run build
   ```

7. **Run with PM2** (process manager):
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start the app
   pm2 start npm --name "drrweb" -- start
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

8. **Set up reverse proxy** (Nginx):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [ ] **Test locally**: `npm run build && npm start`
- [ ] **Fix any build errors**
- [ ] **Set up Supabase** (optional, but recommended for Echo Chamber)
- [ ] **Update contact links** (email, LinkedIn, etc.)
- [ ] **Check environment variables** (if using Supabase/AI)
- [ ] **Review security headers** (already configured in `next.config.mjs`)
- [ ] **Verify repository URL** in `package.json`

## 🔧 Environment Variables Setup

### For Supabase (Optional):

1. **Create Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to initialize

2. **Set up database**:
   - Go to SQL Editor
   - Run the SQL from [SETUP.md](./SETUP.md)

3. **Get credentials**:
   - Project Settings → API
   - Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Add to deployment platform**:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Railway: Variables tab
   - VPS: Add to `.env.local` file

### For AI Services:

- **Anthropic**: `ANTHROPIC_API_KEY` (from console.anthropic.com)
- **Vercel AI Gateway**: `AI_GATEWAY_API_KEY` (from Vercel dashboard)
- **ElevenLabs**: `ELEVENLABS_API_KEY` (from elevenlabs.io)

## 🎯 Quick Start (Vercel - Fastest)

```bash
# 1. Make sure code is committed
git add .
git commit -m "Ready to deploy"
git push

# 2. Install Vercel CLI
npm i -g vercel

# 3. Deploy
vercel --prod

# Done! Your site is live.
```

## 📝 Post-Deployment

After deployment:

1. **Test your live site**
2. **Check Echo Chamber** (if Supabase is set up)
3. **Set up custom domain** (optional)
4. **Enable HTTPS** (automatic on Vercel/Netlify)
5. **Set up analytics** (optional - Vercel Analytics, Plausible, etc.)

## 🆘 Troubleshooting

### Build fails:
- Check `npm run build` works locally
- Review build logs in deployment platform
- Ensure all dependencies are in `package.json`

### Environment variables not working:
- Make sure they start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Check variable names match exactly

### Supabase not connecting:
- Verify environment variables are set
- Check Supabase project is active
- Review browser console for errors
- Site will work without Supabase (uses mock data)

### Audio not working:
- Check browser console for errors
- Some browsers block autoplay (expected behavior)
- User interaction required to start audio (by design)

### DNS not propagating:
- Usually takes 5 minutes to 48 hours
- Average: 1-2 hours
- Check status: Use `dig yourdomain.com` or online DNS checker
- Verify records are correct in your DNS provider

## 💰 Cost Estimates

- **Vercel**: Free tier (hobby) is generous, $20/mo for pro
- **Netlify**: Free tier available, $19/mo for pro
- **Railway**: Pay-as-you-go, ~$5-10/mo for small sites
- **Supabase**: Free tier available, $25/mo for pro
- **VPS**: Varies by provider, typically $5-20/mo

**Recommended**: Start with Vercel free tier + Supabase free tier = $0/month

---

**Need help?** Check the [Next.js deployment docs](https://nextjs.org/docs/deployment) or platform-specific documentation.
