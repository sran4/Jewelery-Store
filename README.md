# 💎 Luxury Jewelry Store

A modern, SEO-friendly jewelry e-commerce store built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Dark/Light Mode** - Seamless theme switching with persistent preference
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🔍 **Advanced Filtering** - Filter by price, availability, discounts, and new arrivals
- 🖼️ **Image Gallery** - Interactive product images with zoom functionality
- 🎯 **SEO Optimized** - Meta tags, Open Graph, and lazy loading
- 🎭 **Smooth Animations** - Powered by Framer Motion
- 📧 **Contact Form** - Integrated with Web3Forms
- 🏷️ **Product Categories** - Rings, Bracelets, Necklaces, Earrings
- 🎉 **Promotional Features** - Dismissible promo bar and floating action buttons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd jewelery-store
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/              # Next.js 14 App Router pages
├── components/       # React components
├── context/          # React Context providers
├── data/            # JSON data files
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Updating Products

Edit `src/data/products.json` to add, modify, or remove products.

### Changing Theme Colors

Modify the CSS variables in `src/app/globals.css` and Tailwind config in `tailwind.config.ts`.

### Contact Form

Update the Web3Forms API key in the contact form component.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and React
