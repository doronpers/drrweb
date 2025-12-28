# Debugging 404 Error

## Step 1: Check Browser Console

1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Look for any red error messages
4. Copy the exact error message

## Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page (Cmd+R or F5)
3. Look for any requests with **404** status (red)
4. Click on the 404 request
5. Check the **Request URL** - what URL is it trying to access?

## Common 404 Sources:

### 1. Supabase API (Most Likely)
- **URL pattern**: `https://YOUR_PROJECT.supabase.co/rest/v1/echoes`
- **Cause**: Table doesn't exist or incorrect URL/key
- **Fix**: Run the SQL setup script in Supabase Dashboard and verify environment variables

### 2. Favicon
- **URL**: `/favicon.ico` or `/favicon.svg`
- **Fix**: Already created, should be fixed

### 3. Next.js Internal Routes
- **URL**: `/_next/static/...`
- **Fix**: Usually means build issue - try `npm run build`

### 4. Fonts
- **URL**: `https://fonts.gstatic.com/...`
- **Fix**: Network issue, not critical

## Quick Test

Run this in your browser console to test Supabase:

```javascript
// Test Supabase connection
// Replace YOUR_SUPABASE_URL and YOUR_ANON_KEY with your actual values from .env.local
fetch('YOUR_SUPABASE_URL/rest/v1/echoes?select=*&approved=eq.true', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

If you get a 404, the table doesn't exist. If you get a 200 with empty array, it's working!

## What to Share

Please share:
1. The exact URL that's 404ing (from Network tab)
2. The error message (from Console tab)
3. Whether you've run the SQL setup script in Supabase

