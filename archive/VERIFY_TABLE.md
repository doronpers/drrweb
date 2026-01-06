# Verify Your Supabase Table Setup

The "requested path is invalid" error means Supabase can't find the `echoes` table. Let's verify everything is set up correctly.

## Step 1: Check if Table Exists

1. **Go to Supabase Dashboard**
2. **Click "Table Editor"** (left sidebar)
3. **Look for `echoes` table** in the list

**If you DON'T see `echoes` table:**
- The table wasn't created
- Go to Step 2 below

**If you DO see `echoes` table:**
- Check Step 3 below

---

## Step 2: Create the Table (If Missing)

1. **Go to SQL Editor** (left sidebar, `</>` icon)
2. **Click "New query"**
3. **Copy and paste this ENTIRE SQL**:

```sql
-- Create the echoes table
CREATE TABLE IF NOT EXISTS public.echoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL CHECK (char_length(text) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.echoes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can read approved echoes" ON public.echoes;
DROP POLICY IF EXISTS "Anyone can insert echoes for moderation" ON public.echoes;

-- Policy: Anyone can read approved echoes
CREATE POLICY "Public can read approved echoes"
ON public.echoes FOR SELECT
USING (approved = true);

-- Policy: Anyone can insert new echoes (they'll need approval)
CREATE POLICY "Anyone can insert echoes for moderation"
ON public.echoes FOR INSERT
WITH CHECK (true);
```

4. **Click "Run"** (or Cmd/Ctrl + Enter)
5. **You should see**: "Success. No rows returned"

---

## Step 3: Verify Table Settings

If the table exists, check these settings:

1. **Go to Table Editor → `echoes`**
2. **Click the "..." menu** (three dots) → **"View table"**
3. **Check these things**:
   - ✅ Table name is exactly `echoes` (lowercase)
   - ✅ Schema is `public`
   - ✅ RLS is enabled (you'll see a shield icon)

---

## Step 4: Test the Connection

After creating/verifying the table:

1. **Restart your dev server**:
   ```bash
   # Stop it (Ctrl+C)
   npm run dev
   ```

2. **Open browser console** (F12 or Cmd+Option+I)

3. **Look for errors** - you should see detailed error messages now

4. **Check the Network tab**:
   - Look for requests to `supabase.co`
   - Check if they're returning errors

---

## Common Issues

### Issue: Table exists but still getting error
**Solution**: Make sure RLS is enabled and policies are created. Re-run the SQL from Step 2.

### Issue: "relation does not exist"
**Solution**: The table name might be wrong. Check it's exactly `echoes` (lowercase, no quotes).

### Issue: "permission denied"
**Solution**: RLS policies aren't set up correctly. Re-run the CREATE POLICY statements.

### Issue: Environment variables not loading
**Solution**: 
- Make sure `.env.local` is in the project root
- Restart your dev server after adding variables
- Check the file has no extra spaces or quotes

---

## Quick Test Query

You can test directly in Supabase SQL Editor:

```sql
-- This should return empty array (or your data if you have any)
SELECT * FROM public.echoes WHERE approved = true;
```

If this works in SQL Editor but not in your app, it's likely an environment variable or RLS policy issue.

---

## Still Not Working?

Check the browser console for the detailed error message. The updated code will now show:
- Error message
- Error code
- Error details
- Error hint

Share these details and I can help debug further!

