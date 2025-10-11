# 🚀 Jewelry Store Setup Guide

Welcome to your luxury jewelry e-commerce store! This guide will help you get your project up and running.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download here](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm** package manager
- A code editor (VS Code recommended)

## 🛠️ Installation Steps

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install all required packages including Next.js, React, Tailwind CSS, Framer Motion, and more.

### 2. Set Up Environment Variables

1. Copy the `.env.example` file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Get your Web3Forms API key:
   - Visit [https://web3forms.com/](https://web3forms.com/)
   - Sign up for a free account
   - Copy your Access Key
   - Replace `your_access_key_here` in `.env.local` with your actual key

### 3. Update Contact Form

Open `src/components/contact/ContactForm.tsx` and update line 45:

```typescript
access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Replace with actual key from .env
```

Change to:

```typescript
access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
```

### 4. Run the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Your site will be available at [http://localhost:3000](http://localhost:3000)

## 🎨 Customization Guide

### Updating Products

Edit `src/data/products.json` to add, modify, or remove products. Each product should follow this structure:

```json
{
  "id": "prod_001",
  "sku": "RNG-GLD-001",
  "title": "Product Name",
  "description": "Product description",
  "price": 2999.99,
  "discountPrice": 2399.99,
  "discount": 20,
  "category": "rings",
  "material": "18K Gold",
  "inStock": true,
  "quantityInStock": 5,
  "isNew": true,
  "isFeatured": true,
  "popularityScore": 95,
  "images": ["url1", "url2", "url3", "url4"],
  "rating": 4.8,
  "tags": ["diamond", "luxury"]
}
```

### Changing Colors

Colors are managed in two places:

1. **`src/app/globals.css`** - CSS variables for light and dark modes
2. **`tailwind.config.ts`** - Tailwind theme configuration

### Updating Site Information

Edit `src/data/products.json` under the `siteSettings` section:

```json
{
  "siteSettings": {
    "promotionalMessage": "Your promo message",
    "phone": "+1-234-567-8900",
    "whatsapp": "+1234567890",
    "email": "contact@yoursite.com",
    "address": "Your address",
    "socialMedia": {
      "facebook": "https://facebook.com/yourpage",
      "instagram": "https://instagram.com/yourpage",
      "pinterest": "https://pinterest.com/yourpage"
    }
  }
}
```

### Getting Free Product Images

Use these resources for high-quality jewelry images:

- [Unsplash](https://unsplash.com/s/photos/jewelry) - Free high-resolution photos
- [Pexels](https://www.pexels.com/search/jewelry/) - Free stock photos
- [Pixabay](https://pixabay.com/images/search/jewelry/) - Free images

## 📱 Font Options

The site is configured with both serif and sans-serif fonts:

### Current Setup:

- **Serif**: Playfair Display (elegant, luxury feel)
- **Sans-serif**: Inter (clean, modern)

### To Test Different Fonts:

Open `src/app/layout.tsx` and import different Google Fonts:

```typescript
// For elegant serif alternatives:
import { Cormorant_Garamond, Crimson_Text } from "next/font/google";

// For modern sans-serif alternatives:
import { Poppins, Montserrat } from "next/font/google";
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in project settings
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables
7. Deploy!

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Homepage
│   ├── products/          # Products pages
│   ├── contact/           # Contact page
│   ├── about/             # About page
│   └── ...
├── components/            # React components
│   ├── layout/           # Header, Footer, etc.
│   ├── home/             # Homepage components
│   ├── products/         # Product components
│   ├── product-detail/   # Product detail components
│   ├── contact/          # Contact components
│   ├── ui/               # UI components
│   └── common/           # Shared components
├── data/                 # JSON data
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript types
```

## ✅ Features Checklist

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light mode with theme persistence
- ✅ Product filtering and sorting
- ✅ Product search
- ✅ Quick view modal
- ✅ Image gallery with zoom
- ✅ Product detail pages
- ✅ Similar products recommendations
- ✅ Contact form with Web3Forms
- ✅ Floating action buttons (phone, WhatsApp, contact)
- ✅ Social media sharing
- ✅ SEO optimization
- ✅ Smooth animations with Framer Motion
- ✅ Dismissible promotional bar
- ✅ About, Privacy Policy, Terms pages
- ✅ Breadcrumb navigation

## 🎯 Testing Your Site

### Desktop Testing

- Chrome, Firefox, Safari, Edge
- Test at 1920px, 1440px, 1280px widths

### Tablet Testing

- iPad (768px - 1024px)
- Test both portrait and landscape

### Mobile Testing

- iPhone (375px - 414px)
- Android (360px - 480px)

### Dark/Light Mode

- Toggle between themes
- Check contrast and readability
- Ensure all elements are visible

## 🐛 Troubleshooting

### Images Not Loading

- Check image URLs in `products.json`
- Ensure URLs are publicly accessible
- Check Next.js image optimization settings in `next.config.js`

### Contact Form Not Working

- Verify Web3Forms API key is set correctly
- Check browser console for errors
- Test with a different email address

### Styles Not Applying

- Clear browser cache
- Restart development server
- Check for Tailwind class conflicts

## 📚 Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web3Forms Documentation](https://docs.web3forms.com/)

## 💡 Tips for Success

1. **Start with your data**: Update `products.json` with your actual products
2. **Test thoroughly**: Check all features on different devices
3. **Optimize images**: Use WebP format and appropriate sizes
4. **Monitor performance**: Use Lighthouse for performance audits
5. **Gather feedback**: Test with real users before launching

## 🤝 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Review the troubleshooting section
3. Ensure all dependencies are installed
4. Verify environment variables are set

---

**Happy coding! 🚀** Your luxury jewelry store is ready to shine!
