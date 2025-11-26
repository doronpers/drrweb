# Ionos Domain Setup Guide

## Step 1: Determine Your Hosting Situation

**Do you already have Ionos webspace/hosting?**
- ✅ Yes → Go to "Connect to webspace"
- ❌ No → You need to create webspace first OR use external hosting

---

## Option A: You Have Ionos Webspace/Hosting

### Step 1: Connect Domain to Webspace

1. **Click "Connect to webspace"**
2. **Select your webspace** from the dropdown
3. **Choose a directory** (usually `htdocs` or leave default)
4. **Save**

### Step 2: Deploy Your Next.js Site

**If your Ionos hosting supports Node.js:**
- Follow the VPS instructions in `IONOS_DEPLOYMENT.md`

**If your Ionos hosting only supports static files:**
- Use static export (see below)

---

## Option B: You DON'T Have Ionos Hosting Yet

### Option B1: Create Ionos Webspace (Recommended if staying with Ionos)

1. **Go to Ionos Control Panel** → **Websites & Stores**
2. **Click "Create Website"** or **"Add Webspace"**
3. **Choose a plan** (even basic shared hosting works for static sites)
4. **After webspace is created**, go back to domain settings
5. **Click "Connect to webspace"** and select your new webspace

### Option B2: Use External Hosting (Vercel, Netlify, etc.)

If you want to use Vercel/Netlify (easier for Next.js):

1. **Deploy to Vercel** (see `DEPLOYMENT.md`)
2. **Get your Vercel URL** (e.g., `your-site.vercel.app`)
3. **In Ionos domain settings**, click **"DNS"**
4. **Add a CNAME record**:
   - **Name**: `@` or `www`
   - **Type**: `CNAME`
   - **Value**: `cname.vercel-dns.com`
   - **Or use A record** pointing to Vercel's IP (check Vercel docs)

---

## Option C: Static Export to Ionos Webspace

If you have Ionos webspace but it doesn't support Node.js:

### Step 1: Build Static Version

```bash
# Backup your current config
cp next.config.mjs next.config.original.mjs

# Use static export config
cp next.config.static.mjs next.config.mjs

# Build with environment variables
NEXT_PUBLIC_SUPABASE_URL=https://vczocswqgejdxsszcmqc.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Sg9WlSlGiuy9-V6hUUuV5w_J8Ecg69y \
npm run build
```

This creates an `out` folder.

### Step 2: Upload to Ionos

**Via FTP:**
1. **Get FTP credentials** from Ionos Control Panel → Your Webspace → FTP
2. **Connect via FTP client** (FileZilla, Cyberduck, etc.)
3. **Upload all contents** of the `out` folder to `htdocs` (or root directory)

**Via File Manager:**
1. **Ionos Control Panel** → Your Webspace → File Manager
2. **Navigate to `htdocs`** (or root)
3. **Upload all files** from the `out` folder

### Step 3: Connect Domain

1. **Go back to domain settings**
2. **Click "Connect to webspace"**
3. **Select your webspace**
4. **Save**

---

## Quick Decision Tree

```
Do you have Ionos webspace/hosting?
│
├─ YES → Does it support Node.js?
│   │
│   ├─ YES → Use VPS deployment (IONOS_DEPLOYMENT.md Option 1)
│   │
│   └─ NO → Use static export (Option C above)
│
└─ NO → Choose one:
    │
    ├─ Create Ionos webspace → Then use Option C
    │
    └─ Use Vercel/Netlify → Configure DNS (Option B2)
```

---

## Recommended: Easiest Path

**For simplicity, I recommend:**

1. **Deploy to Vercel** (free, 5 minutes)
   - See `DEPLOYMENT.md` → Vercel section
   - Your site will be live at `your-site.vercel.app`

2. **In Ionos**, click **"DNS"**

3. **Add DNS records**:
   - **A Record**: `@` → Vercel's IP (check Vercel docs for current IPs)
   - **CNAME Record**: `www` → `cname.vercel-dns.com`

4. **Wait 24-48 hours** for DNS propagation

5. **Done!** Your domain will point to your Vercel-hosted site

---

## What You Need Right Now

**Tell me:**
1. Do you already have Ionos webspace/hosting? (Yes/No)
2. If yes, does it support Node.js? (Check your plan details)
3. Do you want to use Ionos hosting or external (Vercel/Netlify)?

Based on your answer, I'll give you the exact steps!

