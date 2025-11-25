# Supabase Setup Guide - Step by Step

This guide will walk you through setting up Supabase for the Echo Chamber feature. **Don't worry - it's optional!** Your site works fine without it (it just uses mock data).

---

## 🎯 Quick Overview

Supabase is a free database service. We're using it to store and display messages in the "Echo Chamber" feature. Here's what we need to do:

1. Create a Supabase account and project
2. Create a database table
3. Set up security rules
4. Get your API keys
5. Add keys to your project

**Time needed:** ~10 minutes

---

## Step 1: Create Supabase Account & Project

1. **Go to [supabase.com](https://supabase.com)**

2. **Click "Start your project"** (or "Sign up" if you don't have an account)

3. **Sign up with GitHub** (easiest) or email

4. **Create a new project**:
   - Click "New Project"
   - **Organization**: Create new or use existing
   - **Name**: `drrweb` (or whatever you want)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., "US East" or "EU West")
   - **Pricing Plan**: Free tier is fine

5. **Click "Create new project"**
   - ⏳ Wait 2-3 minutes for database to initialize

---

## Step 2: Create the Database Table

Once your project is ready:

1. **Open your project** (click on it in the dashboard)

2. **Go to SQL Editor** (left sidebar, icon looks like `</>`)

3. **Click "New query"**

4. **Copy and paste this entire SQL code**:

```sql
-- Create the echoes table
CREATE TABLE echoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL CHECK (char_length(text) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE echoes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved echoes
CREATE POLICY "Public can read approved echoes"
ON echoes FOR SELECT
USING (approved = true);

-- Policy: Anyone can insert new echoes (they'll need approval)
CREATE POLICY "Anyone can insert echoes for moderation"
ON echoes FOR INSERT
WITH CHECK (true);
```

5. **Click "Run"** (or press Cmd/Ctrl + Enter)

6. **You should see**: "Success. No rows returned"

✅ **Table created!**

---

## Step 3: Get Your API Keys

1. **Go to Project Settings** (gear icon in left sidebar)

2. **Click "API"** (under Project Settings)

3. **You'll see two important values**:

   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **Publishable key**: Long string starting with `sb_publishable_...` or `eyJ...`
     - This is safe to use in the browser (with RLS enabled)
     - Also called "anon public key" in some interfaces

4. **Copy both values** (keep them handy!)

---

## Step 4: Add Keys to Your Project

### Option A: For Local Development

1. **Create a file called `.env.local`** in your project root (same folder as `package.json`)

2. **Add these two lines** (replace with YOUR values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxx
```

**Important:**
- Replace `https://xxxxxxxxxxxxx.supabase.co` with YOUR Project URL
- Replace `sb_publishable_...` with YOUR publishable key (from the dashboard)
- The environment variable name is still `NEXT_PUBLIC_SUPABASE_ANON_KEY` (even though Supabase calls it "publishable key")
- No quotes around the values
- No spaces around the `=` sign

3. **Save the file**

4. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

### Option B: For Production (Vercel/Netlify/etc.)

When you deploy, add these same environment variables in your hosting platform:

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xxxxxxxxxxxxx.supabase.co`
3. Add:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_...` (your publishable key)
4. Click "Save"
5. Redeploy your site

**Netlify:**
1. Site settings → Environment variables
2. Add both variables (same as above)

---

## Step 5: Test It Out

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Open your site** in browser

3. **Navigate to a mode** (Architect, Author, or Lab)

4. **Look for the Echo Chamber** (floating messages in the background)

5. **Try submitting a message** (if there's an input form)

6. **Check Supabase Dashboard**:
   - Go to Table Editor → `echoes` table
   - You should see your message with `approved: false`

---

## Step 6: Approve Messages (Moderation)

Messages need to be approved before they show publicly:

1. **Go to Supabase Dashboard** → Table Editor → `echoes`

2. **Find messages with `approved: false`**

3. **Click the row** to edit it

4. **Change `approved` from `false` to `true`**

5. **Save**

6. **Refresh your website** - the message should now appear!

---

## 🐛 Troubleshooting

### "Supabase not configured" warning in console
- ✅ This is normal if you haven't set up `.env.local` yet
- The site will work with mock data
- Once you add the environment variables, the warning will go away

### Can't see messages on the site
- Check that messages are `approved: true` in Supabase
- Check browser console for errors
- Make sure environment variables are set correctly

### Environment variables not working
- Make sure file is named `.env.local` (not `.env` or `.env.local.txt`)
- Make sure variables start with `NEXT_PUBLIC_`
- Restart your dev server after adding variables
- No quotes around values
- No spaces around `=`

### SQL errors when creating table
- Make sure you're copying the ENTIRE SQL block
- Run each statement separately if needed
- Check that RLS is enabled: Table Editor → `echoes` → Settings → Enable RLS

### Can't find API keys
- Go to: Project Settings → API
- Look for "Project URL" and "Publishable key" (or "anon public" key)
- The publishable key is safe to use in the browser (with RLS enabled)
- Make sure you're in the right project

---

## 📋 Quick Reference

**Where to find things in Supabase:**

- **SQL Editor**: Left sidebar → `</>` icon
- **Table Editor**: Left sidebar → "Table Editor" → `echoes`
- **API Keys**: Left sidebar → Settings (gear) → API
- **Project URL**: Settings → API → "Project URL"
- **Anon Key**: Settings → API → "anon public" key

**Environment Variables Needed:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key_here
```

**Note:** Even though Supabase calls it a "publishable key" in the dashboard, the environment variable name is still `NEXT_PUBLIC_SUPABASE_ANON_KEY` (this is what the Supabase client library expects).

---

## ✅ Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Created `echoes` table (via SQL)
- [ ] Enabled RLS
- [ ] Created read policy
- [ ] Created insert policy
- [ ] Got Project URL from Settings → API
- [ ] Got publishable key from Settings → API
- [ ] Created `.env.local` file
- [ ] Added both environment variables
- [ ] Restarted dev server
- [ ] Tested submitting a message
- [ ] Approved a message in Supabase
- [ ] Saw message appear on site

---

## 🆘 Still Stuck?

1. **Check the browser console** for specific error messages
2. **Check Supabase logs**: Dashboard → Logs
3. **Verify your SQL ran successfully** (should say "Success")
4. **Make sure `.env.local` is in the project root** (same folder as `package.json`)
5. **Remember**: The site works WITHOUT Supabase - it's optional!

---

**Need more help?** Check the [Supabase docs](https://supabase.com/docs) or the comments in `lib/supabase.ts`.

