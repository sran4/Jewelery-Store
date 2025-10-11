# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/jewelry-store.git
   git push -u origin main
   ```

2. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Environment Variables (Optional):**
   - Add `WEB3FORMS_ACCESS_KEY` if you want contact form to work
   - Add `NEXT_PUBLIC_SITE_URL` for your domain

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

## Pre-Deployment Checklist ✅

### ✅ Build Test

```bash
npm run build
npm run start
```

### ✅ Environment Setup

- [ ] Update contact form with your Web3Forms key
- [ ] Update site settings in `src/data/products.json`
- [ ] Replace placeholder images with your own (optional)

### ✅ Custom Domain (Optional)

- [ ] Add custom domain in Vercel dashboard
- [ ] Update DNS settings
- [ ] Update `SITE_URL` in constants

## Configuration Files

### `next.config.js` ✅

- External images configured
- Optimized for Vercel
- Standalone output enabled

### `package.json` ✅

- All dependencies included
- Build scripts ready

### `vercel.json` (Auto-generated)

Vercel will create this automatically for Next.js projects.

## Performance Optimizations

### Images

- ✅ Next.js Image optimization enabled
- ✅ WebP/AVIF formats supported
- ✅ Lazy loading implemented
- ✅ Responsive images with proper sizes

### SEO

- ✅ Meta tags configured
- ✅ Open Graph tags
- ✅ Structured data ready
- ✅ Sitemap generation (auto)

### Core Web Vitals

- ✅ Font optimization
- ✅ Code splitting
- ✅ Static generation where possible
- ✅ Optimized bundle size

## Troubleshooting

### Build Issues

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Image Issues

- Ensure external image URLs are accessible
- Check `next.config.js` remotePatterns
- Use relative paths for local images

### Contact Form

- Get Web3Forms access key: [web3forms.com](https://web3forms.com)
- Add to Vercel environment variables
- Update `src/components/contact/ContactForm.tsx`

## Post-Deployment

### 1. Test All Features

- [ ] Homepage loads
- [ ] Product pages work
- [ ] Filtering/sorting works
- [ ] Contact form submits
- [ ] Dark/light mode toggles
- [ ] Mobile responsiveness

### 2. SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (optional)
- [ ] Test social media sharing

### 3. Performance Check

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on different devices

## Support

If you encounter any issues:

1. Check Vercel deployment logs
2. Run `npm run build` locally first
3. Ensure all environment variables are set
4. Check external image URLs are accessible

---

**Ready to deploy! 🎉**
