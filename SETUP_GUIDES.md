# 🔧 Complete Setup Guides for Backend Services

## 📚 Table of Contents
1. [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
2. [Cloudinary Setup](#2-cloudinary-setup)
3. [SendGrid Setup](#3-sendgrid-setup)
4. [Google OAuth Setup](#4-google-oauth-setup)
5. [Facebook Pixel Setup](#5-facebook-pixel-setup)
6. [Google Analytics Setup](#6-google-analytics-setup)

---

## 1. MongoDB Atlas Setup

### Step 1: Create Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Start Free"**
3. Sign up with Google or Email

### Step 2: Create Cluster
1. Choose **FREE** tier (M0 Sandbox)
2. Select **AWS** provider (recommended)
3. Choose closest region to your users
4. Cluster name: `JewelryStore` (or your preference)
5. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Database Access
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `jewelryAdmin` (save this)
5. Click **"Autogenerate Secure Password"** (save this)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - IP: `0.0.0.0/0`
4. For production, add your Vercel deployment IPs

### Step 5: Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://jewelryAdmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add database name before `?`: `mongodb+srv://...mongodb.net/jewelrystore?retryWrites=true...`

### Step 6: Add to .env.local
```env
MONGODB_URI=mongodb+srv://jewelryAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jewelrystore?retryWrites=true&w=majority
```

### ✅ Verification
Test connection in your app. You should see: `MongoDB Connected Successfully!`

---

## 2. Cloudinary Setup

### Step 1: Create Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Sign up with Google or Email
4. Choose **"Developers"** as your role

### Step 2: Get Credentials
1. Go to **Dashboard** (auto-redirected after signup)
2. You'll see your **Account Details**:
   - **Cloud Name**: `dxxxxxxxx`
   - **API Key**: `123456789012345`
   - **API Secret**: (click to reveal)

### Step 3: Configure Upload Preset
1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **"Add upload preset"**
4. Settings:
   - Preset name: `jewelry-products`
   - Signing Mode: **Signed**
   - Folder: `jewelry-store/products`
   - Format: **Auto**
   - Quality: **Auto**
   - Max file size: **5MB**
   - Allowed formats: `jpg,png,webp`
   - Transformations: 
     - Resize: Limit, Width: 2000, Height: 2000
     - Quality: Auto
     - Format: Auto
5. Click **"Save"**

### Step 4: Create Image Transformations
1. Go to **Settings** → **Upload** → **Upload presets**
2. Create additional presets:
   - `jewelry-thumbnails`: 400x400, Quality 80
   - `jewelry-gallery`: 1200x1200, Quality 90

### Step 5: Add to .env.local
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=jewelry-products
```

### ✅ Verification
Upload a test image via API. You should get back URLs and public IDs.

### 💡 **Image Upload Best Practices:**
- **Dimensions**: 2000×2000px (min 1200×1200px)
- **File Size**: Under 5MB
- **Format**: JPEG (90% quality) or WebP
- **Aspect Ratio**: 1:1 (Square)
- **Color Space**: sRGB
- **File Names**: Use product SKU in filename

---

## 3. SendGrid Setup

### Step 1: Create Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Click **"Start for Free"**
3. Sign up (Email verification required)
4. Complete account setup form

### Step 2: Verify Sender Identity
1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - From Name: `LuxeJewels`
   - From Email: `noreply@yourdomain.com` (or your email)
   - Reply To: `admin@yourdomain.com`
   - Company Address: Your business address
4. Check your email and verify
5. Wait for approval (usually instant)

### Step 3: Create API Key
1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: `Jewelry Store Production`
4. Permissions: **Full Access** (or Restricted Access → Mail Send)
5. Click **"Create & View"**
6. **COPY THE KEY NOW** (you won't see it again!)

### Step 4: Add to .env.local
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

### Step 5: Test Email Template
```javascript
// Test email structure
{
  to: 'admin@yourdomain.com',
  from: 'noreply@yourdomain.com',
  subject: 'New Contact Form Submission - Jewelry Store',
  html: '<strong>You have a new inquiry!</strong>'
}
```

### ✅ Verification
Send a test email. Check both inbox and spam folder.

### 📊 **Free Tier Limits:**
- 100 emails/day forever free
- Perfect for contact form notifications!

---

## 4. Google OAuth Setup

### Step 1: Google Cloud Console
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: **"Jewelry Store Auth"**
3. Select the project

### Step 2: Enable APIs
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"**
3. Fill in:
   - App name: `LuxeJewels Admin`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users: **Your admin Google email**
6. Click **"Save and Continue"**

### Step 4: Create Credentials
1. Go to **"Credentials"** → **"Create Credentials"** → **"OAuth client ID"**
2. Application type: **"Web application"**
3. Name: `Jewelry Store Admin Login`
4. Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
6. Click **"Create"**
7. **COPY** Client ID and Client Secret

### Step 5: Add to .env.local
```env
GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_ADMIN_EMAIL=youradmin@gmail.com
```

### ✅ Verification
Test Google login. Only your whitelisted email should work.

---

## 5. Facebook Pixel Setup

### Step 1: Create Facebook Business Manager
1. Go to [business.facebook.com](https://business.facebook.com)
2. Click **"Create Account"**
3. Enter business details

### Step 2: Create Pixel
1. Go to **Events Manager**
2. Click **"Connect Data Sources"** → **"Web"** → **"Facebook Pixel"**
3. Enter Pixel name: `LuxeJewels Pixel`
4. Optional: Enter website URL
5. Click **"Create Pixel"**

### Step 3: Get Pixel ID
1. In Events Manager, click your pixel
2. Copy the **Pixel ID** (15-16 digit number)
   - Example: `123456789012345`

### Step 4: Add to .env.local
```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
```

### Step 5: Events to Track
- PageView (automatic)
- ViewContent (product pages)
- Contact (form submissions)
- Search (product search)

### ✅ Verification
1. Install **Facebook Pixel Helper** Chrome extension
2. Visit your site
3. Extension should show green checkmark
4. Events should appear in Facebook Events Manager

---

## 6. Google Analytics Setup

### Step 1: Create GA4 Property
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **"Start measuring"**
3. Account name: `Jewelry Store`
4. Property name: `LuxeJewels Website`
5. Time zone and currency: Select yours
6. Click **"Next"**

### Step 2: Setup Data Stream
1. Choose **"Web"**
2. Website URL: `https://yourdomain.com`
3. Stream name: `LuxeJewels Main Site`
4. Click **"Create stream"**

### Step 3: Get Measurement ID
1. You'll see your **Measurement ID**:
   - Format: `G-XXXXXXXXXX`
2. **COPY** this ID

### Step 4: Add to .env.local
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 5: Events to Track
- page_view (automatic)
- product_view
- search
- contact_form_submit
- category_click

### ✅ Verification
1. Visit your site
2. Go to GA4 → **Reports** → **Realtime**
3. You should see yourself as active user
4. Events should appear within seconds

---

## 📧 Email Service Comparison

| Feature | SendGrid | EmailJS |
|---------|----------|---------|
| **Free Tier** | 100/day | 200/month |
| **Deliverability** | Excellent | Good |
| **Templates** | Yes | Limited |
| **Analytics** | Yes | Basic |
| **API Quality** | Professional | Simple |
| **Setup Complexity** | Medium | Easy |

**Recommendation**: **SendGrid** - Better for professional use, more reliable delivery

---

## 🔑 Complete .env.example Template

```env
# =================================
# DATABASE
# =================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jewelrystore?retryWrites=true&w=majority

# =================================
# AUTHENTICATION
# =================================
# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=30d

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Initial Admin Credentials (for first-time setup)
ADMIN_EMAIL=admin@luxuryjewelry.com
ADMIN_PASSWORD=YourSecure123!Pass

# =================================
# GOOGLE OAUTH (Backup Login)
# =================================
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_ADMIN_EMAIL=youradmin@gmail.com

# =================================
# CLOUDINARY (Image Storage)
# =================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=jewelry-products

# =================================
# EMAIL (SendGrid)
# =================================
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com

# =================================
# ANALYTICS
# =================================
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# =================================
# SITE
# =================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# =================================
# SECURITY
# =================================
# Rate Limiting
RATE_LIMIT_LOGIN_ATTEMPTS=5
RATE_LIMIT_CONTACT_SUBMISSIONS=10
RATE_LIMIT_API_CALLS=100
```

---

## 🎨 Admin Image Upload - Quality Guidelines

### **Recommended Upload Specifications:**

#### **For Best Quality at 5MB:**
- **Dimensions**: 2000×2000 pixels (for high-res displays)
- **Format**: JPEG at 90% quality
- **Aspect Ratio**: 1:1 (Square) - enforced by cropper
- **Color Mode**: RGB (sRGB color space)
- **Resolution**: 72 DPI (web standard)
- **File Size**: 2-5MB per image

#### **What Cloudinary Does Automatically:**
1. **Optimization**: Reduces file size without quality loss
2. **Format Conversion**: Creates WebP versions
3. **Responsive Images**: Generates multiple sizes
   - Thumbnail: 400×400px
   - Medium: 800×800px
   - Large: 1200×1200px
   - Original: 2000×2000px
4. **CDN Delivery**: Fast global delivery
5. **Lazy Loading**: Automatic loading optimization

#### **Admin Upload Form Notes:**
Will display these guidelines:
```
📸 Image Upload Guidelines:
• Format: JPEG, PNG, or WebP
• Maximum Size: 5MB per image
• Minimum Dimensions: 1200×1200 pixels
• Recommended: 2000×2000 pixels (for best quality)
• Aspect Ratio: 1:1 (Square - will be cropped)
• Quantity: 1-5 images per product
• First image will be the featured image
```

---

## 🔐 Security Best Practices

### **Password Requirements Display:**
```
Your password must contain:
✓ At least 8 characters
✓ One uppercase letter (A-Z)
✓ One lowercase letter (a-z)
✓ One number (0-9)
✓ One special character (!@#$%^&*)

Password Strength: [======    ] Medium
```

### **Rate Limiting:**
- **Login**: 5 attempts per hour per IP
- **Contact Form**: 10 submissions per hour per IP
- **API Calls**: 100 requests per hour per IP

### **Admin Access:**
- Only your whitelisted Google email can login via OAuth
- Case-insensitive username (admin@site.com = ADMIN@SITE.COM)
- Session expires after 30 days (with remember me)
- Session expires after 24 hours (without remember me)

---

## 📊 Quick Reference - Where to Get What

| Service | Website | Free Tier | What You Need |
|---------|---------|-----------|---------------|
| **MongoDB** | mongodb.com/atlas | 512MB storage | Connection URI |
| **Cloudinary** | cloudinary.com | 25GB storage, 25GB bandwidth | Cloud name, API key, Secret |
| **SendGrid** | sendgrid.com | 100 emails/day | API Key |
| **Google OAuth** | console.cloud.google.com | Unlimited | Client ID, Secret |
| **Facebook Pixel** | business.facebook.com | Free | Pixel ID |
| **Google Analytics** | analytics.google.com | Free | Measurement ID |

---

## 🚀 Implementation Order

1. **MongoDB** (Day 1) - Database foundation
2. **Authentication** (Day 2) - Secure admin access
3. **Cloudinary** (Day 3) - Image management
4. **SendGrid** (Day 4) - Email notifications
5. **Analytics** (Day 5) - Tracking setup
6. **Testing** (Day 6) - Verify everything

---

## 🆘 Troubleshooting

### MongoDB Connection Issues:
- Check IP whitelist in Network Access
- Verify username/password
- Ensure connection string has database name
- Check firewall settings

### Cloudinary Upload Fails:
- Verify API credentials
- Check file size (max 5MB)
- Ensure correct upload preset
- Check allowed formats

### SendGrid Emails Not Received:
- Verify sender email address
- Check spam folder
- Verify API key permissions
- Check daily limit (100 emails)

### Google OAuth Not Working:
- Verify redirect URIs match exactly
- Check authorized domains
- Ensure admin email is whitelisted
- Clear browser cookies

---

## 📝 Next Steps

After setting up all services:
1. ✅ Copy all credentials to `.env.local`
2. ✅ Test each service individually
3. ✅ Verify all integrations work
4. ✅ Ready to implement admin panel!

**All services have generous free tiers - perfect for getting started!** 🎉

