# Vercel Deployment Checklist

## ✅ Pre-Deployment Fixes Applied

1. **CSP Headers Fixed**
   - Added `https://api.elevenlabs.io` to `connect-src` in `next.config.mjs`
   - This allows voice generation API calls to work

2. **Build Script Fixed**
   - Removed `prebuild` script entirely (docs generation is optional)
   - Changed docs generation from `ts-node` to `tsx` (for manual use)
   - Build now succeeds without any docs generation step

3. **Build Verified**
   - Local build succeeds: `npm run build` ✅
   - All routes compile successfully ✅
   - No TypeScript errors ✅

## 🔧 Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Optional (Site works without these, but features will be limited):

1. **Supabase (for Echo Chamber)**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

2. **AI Intent Detection (choose one)**
   - `ANTHROPIC_API_KEY` - Anthropic Claude API key (recommended)
   - OR `AI_GATEWAY_API_KEY` - Vercel AI Gateway key (fallback)

3. **Voice Generation**
   - `ELEVENLABS_API_KEY` - ElevenLabs API key for voice synthesis

### Important Notes:
- Without AI keys: Site works, but uses keyword matching instead of AI routing
- Without ElevenLabs key: Whispers display as text only (no voice)
- Without Supabase: Echo Chamber uses mock data

## 🚀 Deployment Steps

1. **Push latest changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push
   ```

2. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Add all required variables (see above)
   - Make sure to set them for **Production**, **Preview**, and **Development** environments

3. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger auto-deploy

4. **Verify:**
   - Check build logs for success
   - Visit your site URL
   - Test all three modes (Architect, Author, Lab)
   - Test Echo Chamber (if Supabase configured)
   - Test voice generation (if ElevenLabs configured)

## 🐛 Troubleshooting

### Build Fails with "Cannot find module"
- **Solution**: The prebuild script now fails gracefully. If you see this error, it's non-critical and the build should continue.

### Environment Variables Not Working
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### CSP Errors in Browser Console
- Verify `next.config.mjs` has ElevenLabs API in `connect-src`
- Check that Supabase URL is in `connect-src` (should be `https://*.supabase.co`)

### Audio Not Working
- This is expected - browsers require user interaction to start audio
- Audio will work after user clicks/interacts with the page

## 📝 Post-Deployment

After successful deployment:

1. ✅ Test the live site
2. ✅ Verify all three modes work
3. ✅ Check Echo Chamber (if configured)
4. ✅ Test voice generation (if configured)
5. ✅ Set up custom domain (optional)
6. ✅ Enable Vercel Analytics (optional)

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
