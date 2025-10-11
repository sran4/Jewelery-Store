# ⚡ Quick Start Guide

Get your jewelry store running in 5 minutes!

## 🚀 Super Quick Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Your jewelry store is now live! 🎉

## 📝 Optional: Set Up Contact Form

To enable the contact form:

1. Get a free API key from [Web3Forms](https://web3forms.com/)

2. Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_key_here
   ```

3. Update `src/components/contact/ContactForm.tsx` line 45:
   ```typescript
   access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
   ```

## 🎨 Quick Customization

### Update Products

Edit `src/data/products.json` - add/remove/modify products

### Change Contact Info

Edit `src/data/products.json` under `siteSettings`

### Change Colors

Edit `src/app/globals.css` (CSS variables)

## 📱 Test Your Site

- **Desktop**: Check at different sizes (1920px, 1440px, 1280px)
- **Tablet**: Test in DevTools at 768px - 1024px
- **Mobile**: Test at 375px - 414px
- **Dark/Light Mode**: Toggle in header

## 🎯 What Works Out of the Box

✅ All 7 pages (Home, Products, Product Detail, Contact, About, Privacy, Terms)  
✅ Product filtering and sorting  
✅ Search functionality  
✅ Dark/Light mode  
✅ Responsive design  
✅ Image galleries  
✅ Floating action buttons  
✅ Beautiful animations

## 🔧 Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check for errors
```

## 📚 Need More Help?

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `FEATURES.md` for complete feature list
- See `README.md` for project overview

---

**That's it! Start customizing your jewelry store!** 💎
