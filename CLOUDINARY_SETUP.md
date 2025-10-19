# Cloudinary Setup Guide

## 🎯 Purpose
This guide will help you set up Cloudinary for image uploads in your jewelry store application.

---

## 📋 Step 1: Create Cloudinary Account

1. **Go to**: https://cloudinary.com/users/register_free
2. **Sign up** for a free account
3. **Verify your email**
4. **Login to your dashboard**

---

## 🔑 Step 2: Get Your Credentials

1. **Go to Dashboard**: https://console.cloudinary.com/
2. **Copy these values:**
   - **Cloud Name** - At the top of the dashboard
   - **API Key** - In the "Account Details" section
   - **API Secret** - Click "Show" to reveal, then copy

---

## 🔓 Step 3: Create Unsigned Upload Preset (IMPORTANT!)

This allows client-side uploads without exposing your API secret.

### In Cloudinary Dashboard:

1. **Go to Settings** (gear icon) → **Upload**
2. **Scroll to "Upload presets"**
3. **Click "Add upload preset"**
4. **Configure:**
   - **Preset name**: `ml_default` (or any name you prefer)
   - **Signing Mode**: Select **"Unsigned"** ⚠️ IMPORTANT!
   - **Folder**: `jewelry-store` (optional but recommended)
   - **Access Mode**: `public`
5. **Click "Save"**

### Why Unsigned?

- ✅ Allows direct browser uploads
- ✅ No authentication errors
- ✅ Faster uploads (no server proxy)
- ✅ Reduces server load
- ⚠️ Still secure with upload preset restrictions

---

## 🔧 Step 4: Add to Environment Variables

### Local Development (`.env.local`):

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret-here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### Vercel Deployment:

1. **Go to**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add each variable**:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` = `ml_default` (or your preset name)
3. **Select environments**: Production, Preview, Development
4. **Click "Save"**
5. **Redeploy** your application

---

## ✅ Step 5: Test the Upload

1. **Login to admin panel**: `/admin/login`
2. **Go to Categories**: `/admin/categories`
3. **Click "Add New Category"**
4. **Upload an image**
5. **Should see**: "Image uploaded successfully!" ✅

---

## 🔍 Troubleshooting

### Error: "Cloudinary not configured"

**Cause**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is not set

**Fix**:
1. Check `.env.local` has the variable
2. Restart your dev server: `npm run dev`
3. For Vercel: Add the variable and redeploy

---

### Error: "Upload failed" or "Invalid signature"

**Cause**: Upload preset is not set to "Unsigned" mode

**Fix**:
1. Go to Cloudinary Settings → Upload → Upload Presets
2. Edit your preset
3. Change **Signing Mode** to **"Unsigned"**
4. Save and try again

---

### Error: "Preset not found"

**Cause**: The preset name doesn't match

**Fix**:
1. Check your preset name in Cloudinary dashboard
2. Update `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`
3. Restart dev server

---

### Images Upload but Don't Display

**Cause**: Image URLs are not accessible

**Fix**:
1. Check Cloudinary Settings → Security
2. Ensure **Resource Access Control** allows public access
3. Check if **Allowed fetch domains** includes your domain

---

## 🎨 Optional: Configure Upload Restrictions

In your upload preset, you can set:

### Allowed Formats:
- JPG, PNG, WebP, GIF

### File Size Limit:
- Maximum: 5 MB (recommended for web)
- Minimum: 1 KB

### Image Transformations:
- **Auto Format**: Yes (converts to optimal format)
- **Auto Quality**: Yes (balances quality/size)
- **Max Width**: 2000px (prevents huge uploads)
- **Max Height**: 2000px

---

## 📊 Monitor Usage

**Free Tier Limits:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25,000 transformations/month

**Check usage:**
- Cloudinary Dashboard → Reports → Usage

---

## 🔐 Security Best Practices

1. **Never commit** `.env.local` to Git
2. **Use unsigned presets** for client uploads
3. **Keep API secret** in environment variables only
4. **Enable upload restrictions** in preset settings
5. **Monitor usage** regularly to detect abuse

---

## 💡 Pro Tips

### 1. Auto-Optimize Images:

In your upload preset, enable:
- **Format**: Auto
- **Quality**: Auto
- **Fetch Format**: Auto

### 2. Organize with Folders:

Use different folders for different image types:
- `jewelry-store/categories`
- `jewelry-store/products`
- `jewelry-store/banners`

### 3. Add Transformations:

Cloudinary can automatically:
- Resize images
- Convert formats
- Compress for web
- Generate thumbnails

---

## 📞 Need Help?

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Support**: https://support.cloudinary.com/
- **Community**: https://community.cloudinary.com/

---

## ✨ Your Setup is Complete!

Once you've:
1. ✅ Created a Cloudinary account
2. ✅ Created an unsigned upload preset
3. ✅ Added environment variables
4. ✅ Restarted your dev server

**You're ready to upload images!** 🎉

---

*Last Updated: October 2025*
*For: SherGill Official Jewelry Store*

