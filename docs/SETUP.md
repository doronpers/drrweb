# Setup Guide

Complete setup instructions for the DRR Web interactive installation.

## Prerequisites

- Node.js 18+ and npm
- Git (for cloning the repository)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

**Note:** If you encounter npm registry issues (e.g., custom registry errors), you can use the setup script:

```bash
./setup.sh
```

Or manually set the registry:

```bash
npm install --registry=https://registry.npmjs.org/
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Optional: For Echo Chamber (Supabase backend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: For AI-powered intent detection (choose one):
# Option 1: Anthropic Claude (recommended)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Option 2: Vercel AI Gateway (fallback)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key

# Optional: For voice generation (ElevenLabs)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

**Get API Keys:**
- **Anthropic**: https://console.anthropic.com/ → API Keys
- **Vercel AI Gateway**: Vercel Dashboard → AI Gateway section
- **ElevenLabs**: https://elevenlabs.io → Profile → API Keys

**Note:** 
- Without an AI API key, the system falls back to keyword matching (still functional)
- Without ElevenLabs API key, whispers will display as text only
- Without Supabase, the Echo Chamber uses mock data

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup (Optional)

The Echo Chamber feature requires a Supabase backend. If you skip this, the site will work with mock data.

### Step 1: Create Supabase Account & Project

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

### Step 2: Create the Database Table

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

### Step 3: Get Your API Keys

1. **Go to Project Settings** (gear icon in left sidebar)

2. **Click "API"** (under Project Settings)

3. **You'll see two important values**:

   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **Publishable key**: Long string starting with `sb_publishable_...` or `eyJ...`
     - This is safe to use in the browser (with RLS enabled)
     - Also called "anon public key" in some interfaces

4. **Copy both values** (keep them handy!)

### Step 4: Add Keys to Your Project

#### For Local Development

1. **Edit `.env.local`** in your project root

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

#### For Production

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

### Step 5: Test It Out

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

### Step 6: Approve Messages (Moderation)

Messages need to be approved before they show publicly:

1. **Go to Supabase Dashboard** → Table Editor → `echoes`

2. **Find messages with `approved: false`**

3. **Click the row** to edit it

4. **Change `approved` from `false` to `true`**

5. **Save**

6. **Refresh your website** - the message should now appear!

### Step 7: Verify Table Setup

If you encounter "requested path is invalid" errors:

1. **Check if table exists**: Table Editor → Look for `echoes` table

2. **Verify table settings**:
   - Table name is exactly `echoes` (lowercase)
   - Schema is `public`
   - RLS is enabled (you'll see a shield icon)

3. **Test connection**:
   ```bash
   # Restart dev server
   npm run dev
   ```
   
   Check browser console for detailed error messages.

4. **Quick test query** (in Supabase SQL Editor):
   ```sql
   SELECT * FROM public.echoes WHERE approved = true;
   ```

## Troubleshooting

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
- Make sure variables start with `NEXT_PUBLIC_` for client-side access
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

### Table exists but still getting error
- Make sure RLS is enabled and policies are created
- Re-run the SQL from Step 2
- Check that table name is exactly `echoes` (lowercase)

## Quick Reference

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

## Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] API keys added (optional)
- [ ] Supabase account created (optional)
- [ ] Supabase project created (optional)
- [ ] `echoes` table created (optional)
- [ ] RLS enabled and policies created (optional)
- [ ] Supabase API keys added to `.env.local` (optional)
- [ ] Dev server running (`npm run dev`)
- [ ] Site accessible at http://localhost:3000

---

**Need more help?** Check the [Supabase docs](https://supabase.com/docs) or the comments in `lib/supabase.ts`.
