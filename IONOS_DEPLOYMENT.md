# Deploying to Ionos Hosting

Ionos offers different hosting options. Here's how to deploy your Next.js site to each:

---

## Option 1: Ionos VPS (Recommended for Next.js)

If you have an Ionos VPS or can upgrade to one, this is the best option.

### Step 1: Prepare Your Code

1. **Build your site locally**:
   ```bash
   npm run build
   ```

2. **Test it works**:
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` to verify

### Step 2: Upload to Ionos VPS

**Via SSH:**

1. **Connect to your VPS**:
   ```bash
   ssh your-username@your-server-ip
   ```

2. **Install Node.js** (if not already installed):
   ```bash
   # For Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

3. **Upload your project** (choose one method):

   **Method A: Git (Recommended)**
   ```bash
   # On VPS
   cd /var/www
   git clone your-repository-url drrweb
   cd drrweb
   npm install
   npm run build
   ```

   **Method B: SCP/SFTP**
   ```bash
   # From your local machine
   scp -r /Volumes/Treehorn/Gits/drrweb your-username@your-server-ip:/var/www/drrweb
   
   # Then SSH in and:
   cd /var/www/drrweb
   npm install
   npm run build
   ```

4. **Set up environment variables**:
   ```bash
   # On VPS
   cd /var/www/drrweb
   nano .env.local
   ```
   
   Add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://vczocswqgejdxsszcmqc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Sg9WlSlGiuy9-V6hUUuV5w_J8Ecg69y
   ```

5. **Set up PM2** (process manager to keep Node.js running):
   ```bash
   # Install PM2 globally
   sudo npm install -g pm2

   # Start your app
   cd /var/www/drrweb
   pm2 start npm --name "drrweb" -- start
   pm2 save
   pm2 startup  # Follow instructions to enable on boot
   ```

6. **Configure Nginx** (reverse proxy):
   ```bash
   sudo nano /etc/nginx/sites-available/drrweb
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/drrweb /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

7. **Set up SSL** (Let's Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## Option 2: Static Export (If Ionos Only Supports Static Files)

If Ionos only supports static file hosting (no Node.js), you can export your Next.js app as static files.

### Step 1: Configure for Static Export

Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Remove async headers() - not supported in static export
  // Keep experimental settings
  experimental: {
    optimizePackageImports: ['framer-motion', 'tone'],
  },
};

export default nextConfig;
```

### Step 2: Build Static Files

```bash
npm run build
```

This creates an `out` folder with all static files.

### Step 3: Upload to Ionos

1. **Via FTP/SFTP**:
   - Connect to your Ionos FTP account
   - Upload **all contents** of the `out` folder to your web root (usually `htdocs` or `public_html`)

2. **Via File Manager** (Ionos Control Panel):
   - Log into Ionos Control Panel
   - Go to File Manager
   - Navigate to your domain's root folder
   - Upload all files from the `out` folder

### Step 4: Configure Environment Variables

Since static export doesn't support server-side env vars, you'll need to:

1. **Create a config file** that gets included in the build
2. **Or** hardcode the Supabase URL/key in your code (not recommended for security)

Better approach - create `lib/config.ts`:
```typescript
export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};
```

Then build with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key npm run build
```

---

## Option 3: Ionos Managed Hosting (If Available)

Some Ionos plans offer managed Node.js hosting:

1. **Check Ionos Control Panel** for "Node.js" or "Application Hosting"
2. **Follow their deployment guide** (usually involves Git deployment)
3. **Set environment variables** in their control panel
4. **Deploy** via their interface

---

## Quick Comparison

| Method | Pros | Cons |
|--------|------|------|
| **VPS** | Full control, Node.js support, best performance | Requires server management |
| **Static Export** | Simple, works on any hosting | No server-side features, larger bundle |
| **Managed** | Easy, no server management | May have limitations, costs more |

---

## Recommended: Use VPS or Static Export

**If you have VPS access**: Use Option 1 (best performance, full features)

**If you only have shared hosting**: Use Option 2 (static export)

---

## Troubleshooting

### Static Export Issues

**Problem**: Build fails with "Image Optimization" error
**Solution**: Already handled with `images: { unoptimized: true }`

**Problem**: Routes don't work
**Solution**: Make sure you upload the `out` folder contents, not the folder itself

**Problem**: Environment variables not working
**Solution**: They must be set at build time, not runtime

### VPS Issues

**Problem**: PM2 app stops after SSH disconnect
**Solution**: Run `pm2 startup` and follow instructions

**Problem**: Nginx 502 error
**Solution**: Check that Node.js is running: `pm2 list`

**Problem**: Port 3000 not accessible
**Solution**: Check firewall: `sudo ufw allow 3000`

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (Architect, Author, Lab modes)
- [ ] Supabase Echo Chamber works (if configured)
- [ ] Audio works (muted by default)
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain points to correct server
- [ ] Environment variables set correctly

---

## Need Help?

- **Ionos Support**: Check their documentation for your specific hosting plan
- **VPS Setup**: Ionos VPS documentation
- **Static Export**: Next.js static export docs

---

**Note**: If you're unsure which option you have, check your Ionos Control Panel or contact Ionos support to confirm what hosting type you're using.

