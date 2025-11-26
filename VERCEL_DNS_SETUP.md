# Vercel DNS Setup for Ionos Domain

## Step 1: Get Your Vercel Domain Information

After deploying to Vercel:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. **Add your domain**: `doronreizes.com` and `www.doronreizes.com`
3. **Vercel will show you the DNS records needed**

---

## Step 2: DNS Records to Add in Ionos

### Option A: Using A Records (Root Domain)

For `doronreizes.com` (root domain):

**A Record:**
- **Type**: `A`
- **Name**: `@` (or leave blank/empty - represents root domain)
- **Value**: `76.76.21.21` (Vercel's IP - verify current IPs below)
- **TTL**: `3600` (or default)

**CNAME Record (for www):**
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`
- **TTL**: `3600` (or default)

### Option B: Using CNAME Only (Easier)

Some DNS providers allow CNAME for root domain (ALIAS/ANAME):

**CNAME Record (root):**
- **Type**: `CNAME` (or `ALIAS` if Ionos supports it)
- **Name**: `@` (or leave blank)
- **Value**: `cname.vercel-dns.com`
- **TTL**: `3600`

**CNAME Record (www):**
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`
- **TTL**: `3600`

---

## Step 3: How to Find Vercel's Current IP Addresses

### Method 1: Check Vercel Documentation
- Go to: https://vercel.com/docs/concepts/projects/domains
- Look for "DNS Configuration" section
- IP addresses are listed there

### Method 2: Use Command Line
```bash
# Check current IPs for vercel-dns.com
dig cname.vercel-dns.com

# Or check A records
dig @8.8.8.8 cname.vercel-dns.com
```

### Method 3: Check in Vercel Dashboard
1. Go to **Settings** → **Domains**
2. Add your domain
3. Vercel will show you the exact DNS records needed

### Method 4: Common Vercel IPs (Verify These!)

**As of 2024, Vercel typically uses:**
- `76.76.21.21`
- `76.223.126.88`

**⚠️ Important**: These IPs can change! Always verify in Vercel dashboard or documentation.

---

## Step 4: Add DNS Records in Ionos

1. **Go to Ionos Control Panel**
2. **Click on your domain** (`doronreizes.com`)
3. **Click "DNS"** (from the options you saw earlier)
4. **Add the records**:

   **For root domain:**
   - Click "Add Record" or "+"
   - **Type**: `A`
   - **Name**: `@` (or leave blank)
   - **Value**: `76.76.21.21` (verify current IP from Vercel)
   - **TTL**: `3600`
   - **Save**

   **For www subdomain:**
   - Click "Add Record" or "+"
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: `3600`
   - **Save**

---

## Step 5: Verify in Vercel

1. **Go back to Vercel Dashboard** → **Settings** → **Domains**
2. **Vercel will verify** the DNS records
3. **Status should show**: "Valid Configuration" or "DNS Verified"

---

## Step 6: Wait for DNS Propagation

- **Usually takes**: 5 minutes to 48 hours
- **Average**: 1-2 hours
- **Check status**: Use `dig doronreizes.com` or online DNS checker

---

## Troubleshooting

### DNS Not Working After 24 Hours

1. **Verify records are correct**:
   ```bash
   dig doronreizes.com
   dig www.doronreizes.com
   ```

2. **Check Vercel dashboard** for any errors

3. **Make sure**:
   - No conflicting records
   - TTL is reasonable (3600 seconds)
   - Records are saved correctly

### Ionos Doesn't Allow CNAME for Root

If Ionos doesn't support CNAME for root domain (`@`):
- Use **A record** pointing to Vercel's IP
- Use **CNAME** for `www` subdomain

### Multiple IPs Listed

If Vercel shows multiple IPs:
- Add **multiple A records** (one for each IP)
- This provides redundancy

---

## Quick Reference

**Root Domain (doronreizes.com):**
```
Type: A
Name: @ (or blank)
Value: 76.76.21.21
```

**WWW Subdomain (www.doronreizes.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Verify Current Vercel IPs

Run this command to check current IPs:
```bash
dig +short cname.vercel-dns.com
# or
nslookup cname.vercel-dns.com
```

Or check Vercel's official documentation:
https://vercel.com/docs/concepts/projects/domains/configure-dns

