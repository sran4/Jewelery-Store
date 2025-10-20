# 🌐 Connecting Squarespace Domain to Vercel

## Complete Step-by-Step Guide

This guide will walk you through connecting your Squarespace domain to your Vercel-deployed Shergill Official jewelry store.

---

## 📋 **Prerequisites**

- ✅ Domain purchased from Squarespace Domains
- ✅ Vercel account with deployed project
- ✅ Access to Squarespace Domains dashboard
- ✅ Access to Vercel dashboard

**Time Required:** 15-30 minutes + DNS propagation (1-2 hours)

---

## 🎯 **Part 1: Get DNS Records from Vercel**

### **Step 1: Login to Vercel**

1. Go to: https://vercel.com/login
2. Sign in with your account
3. You'll see your dashboard with all projects

### **Step 2: Open Your Project**

1. Click on your project: **"Jewelery Store"** (or whatever you named it)
2. You'll see the project overview page

### **Step 3: Navigate to Domain Settings**

1. Click **"Settings"** in the top menu bar
2. Click **"Domains"** in the left sidebar
3. You'll see your current Vercel domain (e.g., `jewelery-store-abc123.vercel.app`)

### **Step 4: Add Your Custom Domain**

1. Click the **"Add"** button (usually top right or below existing domains)
2. A popup will appear asking for your domain
3. Type your domain: `yourdomain.com`
   - Example: `shergillofficial.com`
   - ⚠️ **Don't include** `https://` or `www`
   - ✅ Just the domain name
4. Click **"Add"** or **"Continue"**

### **Step 5: Copy DNS Records**

Vercel will now show you a page with DNS configuration instructions.

You'll see something like:

```
⚠️ Invalid Configuration

To configure yourdomain.com, add these DNS records:

┌─────────┬──────┬────────────────────────┐
│ Type    │ Name │ Value                  │
├─────────┼──────┼────────────────────────┤
│ A       │ @    │ 76.76.21.21           │
│ CNAME   │ www  │ cname.vercel-dns.com  │
└─────────┴──────┴────────────────────────┘
```

📝 **IMPORTANT:** Keep this tab open or write down these values:

- **A Record IP**: `76.76.21.21` (or whatever Vercel shows)
- **CNAME Target**: `cname.vercel-dns.com`

---

## 🟦 **Part 2: Configure DNS in Squarespace**

### **Step 6: Login to Squarespace Domains**

1. Go to: https://domains.squarespace.com
2. Sign in with your Squarespace account
3. You'll see a list of your domains

### **Step 7: Select Your Domain**

1. Click on the domain you want to connect
2. You'll be taken to the domain management page

### **Step 8: Open DNS Settings**

1. Look for **"DNS Settings"** or **"DNS"** in the left menu
2. Click on it
3. You'll see a list of existing DNS records

**Example of what you might see:**

```
Type    Host    Data                        TTL
A       @       142.251.32.14              3600
AAAA    @       2001:4860:4802:32::15      3600
```

### **Step 9: Remove Conflicting Records**

⚠️ **IMPORTANT:** Before adding new records, remove conflicting ones.

**Delete these record types (if they exist):**

- ✅ Any **A** record with Host `@`
- ✅ Any **AAAA** record with Host `@`
- ✅ Any **CNAME** record with Host `@`

**Keep these records (DO NOT DELETE):**

- ❌ **MX** records (for email)
- ❌ **TXT** records (for verification, SPF, DKIM)
- ❌ **CNAME** records for subdomains like `mail`, `calendar`, etc.

**To delete a record:**

1. Find the record in the list
2. Click the **trash icon** 🗑️ or **"Delete"** button next to it
3. Confirm deletion

### **Step 10: Add Vercel A Record**

Now add Vercel's A record:

1. Click **"Add Record"** or **"+"** button
2. Select **"A"** from the record type dropdown
3. Fill in the fields:

   | Field                                  | Value                               |
   | -------------------------------------- | ----------------------------------- |
   | **Type**                               | A                                   |
   | **Host**                               | `@` (or leave blank if auto-filled) |
   | **Points to** or **Value** or **Data** | `76.76.21.21` (IP from Vercel)      |
   | **TTL**                                | `3600` or `Auto`                    |

4. Click **"Save"** or **"Add"**

### **Step 11: Add WWW CNAME Record**

Now add the CNAME record for www subdomain:

1. Click **"Add Record"** or **"+"** button again
2. Select **"CNAME"** from the record type dropdown
3. Fill in the fields:

   | Field                                  | Value                  |
   | -------------------------------------- | ---------------------- |
   | **Type**                               | CNAME                  |
   | **Host**                               | `www`                  |
   | **Points to** or **Value** or **Data** | `cname.vercel-dns.com` |
   | **TTL**                                | `3600` or `Auto`       |

4. Click **"Save"** or **"Add"**

### **Step 12: Verify Your DNS Records**

Your DNS settings should now look like this:

```
Type    Host    Data/Points To              TTL
────────────────────────────────────────────────
A       @       76.76.21.21                3600
CNAME   www     cname.vercel-dns.com       3600
MX      @       [your email server]        3600  ← Keep existing
TXT     @       [verification codes]       3600  ← Keep existing
```

✅ **Correct!** You're done with Squarespace.

---

## 🔗 **Part 3: Add WWW Subdomain in Vercel**

### **Step 13: Return to Vercel**

Go back to your Vercel browser tab (Settings → Domains)

### **Step 14: Add WWW Subdomain**

1. Click **"Add"** button again (same as Step 4)
2. Type: `www.yourdomain.com`
   - Example: `www.shergillofficial.com`
3. Click **"Add"**

Vercel will automatically:

- Configure the www subdomain
- Set up redirect from www → main domain
- Issue SSL certificate for both

### **Step 15: Current Status Check**

At this point, your Vercel Domains page should show:

```
⏳ yourdomain.com        Pending Configuration    SSL: Pending
⏳ www.yourdomain.com    Pending Configuration    SSL: Pending
```

This is normal! DNS needs to propagate.

---

## ⏱️ **Part 4: Wait for DNS Propagation**

### **Step 16: Understanding DNS Propagation**

DNS changes take time to spread across the internet:

- **Minimum**: 10-30 minutes
- **Average**: 1-2 hours
- **Maximum**: 24-48 hours (rare)

☕ Take a break! Go get coffee while DNS propagates.

### **Step 17: Check DNS Propagation Status**

**Method A: Use DNS Checker Website**

1. Go to: https://dnschecker.org
2. Enter your domain (without https:// or www)
3. Select **"A"** from the dropdown
4. Click **"Search"**
5. You should see `76.76.21.21` appear globally (green checkmarks)

**Method B: Use Command Line (Windows)**

Open PowerShell and run:

```powershell
nslookup yourdomain.com
```

**Expected result:**

```
Name:    yourdomain.com
Address: 76.76.21.21
```

**Method C: Check Vercel Dashboard**

1. Go to Vercel → Settings → Domains
2. Refresh the page every 10-15 minutes
3. Wait for status to change from ⏳ to ✅

### **Step 18: Verify Configuration**

Once DNS propagates, your Vercel dashboard should show:

```
✅ yourdomain.com        Valid Configuration    SSL: Active
✅ www.yourdomain.com    Valid Configuration    SSL: Active
```

---

## 🔒 **Part 5: SSL Certificate (Automatic)**

### **Step 19: SSL Activation**

Vercel automatically issues free SSL certificates via Let's Encrypt!

**Timeline:**

- DNS must be valid first (see Step 18)
- SSL certificate issues within 5-10 minutes after DNS is valid
- Auto-renews every 90 days

**Check SSL Status:**

1. Vercel → Settings → Domains
2. Look for **"SSL"** column
3. Should say **"Active"** ✅

---

## 🌍 **Part 6: Update Site Configuration**

### **Step 20: Update Environment Variables**

Now that your domain is live, update your site URL:

1. Go to: **Vercel** → **Settings** → **Environment Variables**
2. Find: `NEXT_PUBLIC_SITE_URL`
3. Click **"Edit"** (pencil icon)
4. Change value to: `https://yourdomain.com`
   - Example: `https://shergillofficial.com`
   - ⚠️ Include `https://`
   - ⚠️ No trailing slash
5. Click **"Save"**

### **Step 21: Redeploy Your Site**

For the environment variable change to take effect:

1. Go to: **Vercel** → **Deployments**
2. Find the latest deployment (top of the list)
3. Click the **three dots (...)** on the right
4. Click **"Redeploy"**
5. Confirm the redeployment
6. Wait 2-3 minutes for deployment to complete

---

## ✅ **Part 7: Testing & Verification**

### **Step 22: Test Your Domain**

Open your browser and test these URLs:

**Test 1: Main Domain with HTTPS**

```
https://yourdomain.com
```

✅ Should load your site with padlock 🔒

**Test 2: WWW Subdomain**

```
https://www.yourdomain.com
```

✅ Should redirect to main domain

**Test 3: HTTP Redirect**

```
http://yourdomain.com
```

✅ Should redirect to HTTPS version

**Test 4: WWW without HTTPS**

```
http://www.yourdomain.com
```

✅ Should redirect to https://yourdomain.com

### **Step 23: Mobile Test**

- Open your phone
- Visit your domain
- Verify it loads correctly

### **Step 24: SSL Certificate Verification**

1. Visit your site
2. Click the **padlock icon** 🔒 in the address bar
3. Click **"Certificate"** or **"Connection is secure"**
4. Verify:
   - Issued by: Let's Encrypt
   - Valid for: yourdomain.com and www.yourdomain.com
   - Expiration: ~90 days from now

---

## 📊 **Part 8: Final Checklist**

Use this checklist to confirm everything is working:

### **Vercel Dashboard Checks**

- [ ] Domain shows **"Valid Configuration"** ✅
- [ ] WWW subdomain shows **"Valid Configuration"** ✅
- [ ] SSL status shows **"Active"** ✅
- [ ] Latest deployment is successful ✅
- [ ] `NEXT_PUBLIC_SITE_URL` is updated ✅

### **Squarespace Domains Checks**

- [ ] A record exists: `@ → 76.76.21.21` ✅
- [ ] CNAME record exists: `www → cname.vercel-dns.com` ✅
- [ ] No conflicting A/AAAA records ✅
- [ ] Email records (MX, TXT) still present ✅

### **Site Functionality Checks**

- [ ] `https://yourdomain.com` loads ✅
- [ ] `https://www.yourdomain.com` redirects ✅
- [ ] SSL certificate is valid 🔒 ✅
- [ ] HTTP redirects to HTTPS ✅
- [ ] Site loads on mobile ✅
- [ ] All pages work correctly ✅
- [ ] Images load properly ✅
- [ ] Admin panel accessible ✅

---

## 🆘 **Troubleshooting Guide**

### **Problem 1: "Invalid Configuration" After 2+ Hours**

**Symptoms:**

- Vercel still shows "Invalid Configuration"
- DNS propagation seems stuck

**Solutions:**

**Check 1: Verify DNS Records**

1. Login to Squarespace Domains
2. Go to DNS Settings
3. Verify records match exactly:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```

**Check 2: Look for Typos**

- Common mistake: `cname.vercel-dns.com` vs `cname.vercel.dns.com`
- Must be exact: `cname.vercel-dns.com`

**Check 3: Remove Duplicates**

- Make sure there's only ONE A record with `@`
- Delete any duplicate entries

**Check 4: Check DNS Globally**

```powershell
nslookup yourdomain.com 8.8.8.8
```

This checks Google's DNS servers specifically.

---

### **Problem 2: "Not Secure" Warning**

**Symptoms:**

- Site loads but shows "Not Secure" or broken padlock
- Browser warning about certificate

**Solutions:**

**Wait Longer**

- SSL issues 5-10 minutes AFTER DNS is valid
- Total time: DNS propagation + 10 minutes

**Force Refresh Vercel**

1. Go to Vercel → Settings → Domains
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Check if SSL status changed to "Active"

**Check Certificate Status**

1. Vercel → Settings → Domains
2. Click on your domain
3. Look for SSL certificate details
4. If it says "Issuing", wait 5-10 more minutes

---

### **Problem 3: Site Not Loading at All**

**Symptoms:**

- Browser shows "This site can't be reached"
- "DNS_PROBE_FINISHED_NXDOMAIN" error

**Solutions:**

**Clear Your DNS Cache**

**Windows:**

```powershell
ipconfig /flushdns
```

**Mac:**

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Try Different Network**

- Try mobile data instead of WiFi
- Try a different WiFi network
- Your local DNS might be cached

**Use Incognito/Private Mode**

- Opens a fresh browser session
- Bypasses local caching

**Check on Different Device**

- Try your phone
- Try a different computer
- Confirms it's not device-specific

---

### **Problem 4: WWW Not Redirecting**

**Symptoms:**

- `yourdomain.com` works
- `www.yourdomain.com` doesn't load or doesn't redirect

**Solutions:**

**Verify CNAME Record**

1. Squarespace → DNS Settings
2. Confirm: `www → cname.vercel-dns.com`
3. No typos in the target

**Re-add WWW in Vercel**

1. Vercel → Settings → Domains
2. Remove www subdomain
3. Wait 1 minute
4. Add it back again

**Check DNS for WWW**

```powershell
nslookup www.yourdomain.com
```

Should show CNAME pointing to Vercel.

---

### **Problem 5: Email Stopped Working**

**Symptoms:**

- Domain works for website
- Email stopped receiving/sending

**Solutions:**

**Restore Email Records**

You may have accidentally deleted email records. Add them back:

1. Login to Squarespace Domains
2. Go to DNS Settings
3. Add your email provider's records back

**Common email records:**

```
Type    Host    Data/Priority           TTL
────────────────────────────────────────────
MX      @       mail.yourdomain.com     10
TXT     @       v=spf1 include:...      3600
```

If you don't know your email records:

- Contact your email provider
- They'll give you the correct records
- Or check Squarespace email documentation

---

### **Problem 6: Old Site Still Showing**

**Symptoms:**

- Old website or placeholder appears
- Not showing your Vercel site

**Solutions:**

**Clear Browser Cache**

- Hard refresh: `Ctrl + Shift + R` or `Cmd + Shift + R`
- Or clear all browser data

**Check in Incognito**

- Opens without cache
- Shows actual current site

**Verify Vercel Deployment**

1. Vercel → Deployments
2. Make sure latest deployment is "Ready"
3. Visit the Vercel URL (e.g., `jewelery-store-abc123.vercel.app`)
4. If Vercel URL works but custom domain doesn't, it's DNS/caching

---

## 💡 **Best Practices**

### **Security**

- ✅ Always use HTTPS (Vercel handles this automatically)
- ✅ Keep Vercel deployments up to date
- ✅ Don't share environment variables publicly
- ✅ Use strong passwords for Squarespace and Vercel accounts

### **Performance**

- ✅ Vercel has global CDN (automatic)
- ✅ Enable image optimization (automatic in Next.js)
- ✅ Monitor Vercel Analytics
- ✅ Set up Vercel Speed Insights (optional)

### **Maintenance**

- ✅ SSL certificates auto-renew (no action needed)
- ✅ DNS records are "set and forget"
- ✅ Monitor Vercel deployments for failures
- ✅ Check domain renewal date in Squarespace

### **Backup Plan**

Keep a backup of your DNS records:

```
# DNS Records Backup (Save this somewhere safe)

Domain: yourdomain.com
Provider: Squarespace Domains
Date: [Today's Date]

A Record:
  Host: @
  Value: 76.76.21.21
  TTL: 3600

CNAME Record:
  Host: www
  Value: cname.vercel-dns.com
  TTL: 3600

[Add your email records here if applicable]
```

---

## 📞 **Support Resources**

### **Vercel Support**

- Documentation: https://vercel.com/docs
- Community Forum: https://github.com/vercel/vercel/discussions
- Support: https://vercel.com/support
- Status Page: https://www.vercel-status.com

### **Squarespace Domains Support**

- Help Center: https://support.squarespace.com/hc/en-us/sections/206545667-Domains
- DNS Documentation: https://support.squarespace.com/hc/en-us/articles/205812348
- Contact Support: https://support.squarespace.com/hc/en-us/articles/212926068

### **DNS Checking Tools**

- DNS Checker: https://dnschecker.org
- What's My DNS: https://whatsmydns.net
- DNS Propagation Checker: https://dnspropagation.net
- MX Toolbox: https://mxtoolbox.com (for email records)

---

## 🎉 **Success!**

Once everything is working, you should have:

✅ Your jewelry store live on your custom domain
✅ HTTPS security enabled automatically
✅ WWW subdomain redirecting properly
✅ Global CDN for fast loading worldwide
✅ Automatic deployments from GitHub
✅ Professional email (if configured)

**Your site is now live at:**

```
https://yourdomain.com
```

---

## 📝 **Quick Reference Card**

**Print this out or save it:**

```
═══════════════════════════════════════════════
    SQUARESPACE → VERCEL DOMAIN SETUP
═══════════════════════════════════════════════

STEP 1: VERCEL
  → Settings → Domains → Add
  → Copy DNS records

STEP 2: SQUARESPACE
  → DNS Settings
  → Delete conflicting records
  → Add: A @ 76.76.21.21
  → Add: CNAME www cname.vercel-dns.com

STEP 3: VERCEL
  → Add www subdomain
  → Wait 1-2 hours for DNS

STEP 4: UPDATE
  → Environment: NEXT_PUBLIC_SITE_URL
  → Redeploy site

STEP 5: TEST
  → https://yourdomain.com
  → Check SSL padlock 🔒

═══════════════════════════════════════════════
```

---

**Questions?** Refer to the Troubleshooting section or contact Vercel/Squarespace support.

**Last Updated:** October 2024
**For:** Shergill Official Jewelry Store
**Stack:** Next.js + Vercel + Squarespace Domains
