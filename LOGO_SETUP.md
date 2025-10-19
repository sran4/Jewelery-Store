# 🎨 Logo Setup Guide

Quick guide to add your logo to the site.

---

## 📁 **Step 1: Add Your Logo**

1. **Save your logo as**: `logo.png`
2. **Place it in**: `public/logo.png`

**Path should be:**

```
Jewelery Store/
  └── public/
      └── logo.png
```

---

## 📐 **Logo Requirements:**

### **Recommended Specifications:**

- **Format**: PNG (with transparent background)
- **Dimensions**: 200×200 pixels (square)
- **File Size**: Under 100KB
- **Background**: Transparent (for best results)

### **Accepted Formats:**

- ✅ PNG (recommended)
- ✅ SVG (also works)
- ✅ JPG (if no transparency needed)
- ✅ WebP

---

## 🎯 **Where Your Logo Appears:**

Once added, your logo will automatically display in:

1. ✅ **Header** (top navigation)
   - Size: 48×48px
   - Hover effect: scales 110%
2. ✅ **Footer** (bottom of page)

   - Size: 40×40px
   - With brand name

3. ✅ **Admin Panel** (sidebar)
   - Size: 40×40px
   - With "Admin Panel" text

---

## 💻 **Implementation:**

The logo is already integrated in these files:

- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/admin/AdminLayout.tsx`

**Code Example:**

```typescript
<Image
  src="/logo.png"
  alt="SherGill Official Logo"
  fill
  className="object-contain"
/>
```

---

## 🔄 **If Logo Doesn't Show:**

### **Check 1: File Location**

Make sure the file is in the correct location:

```
public/logo.png
```

NOT in `src/` or any other folder!

### **Check 2: File Name**

Must be exactly: `logo.png` (lowercase)

### **Check 3: Restart Server**

After adding the logo:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Check 4: Clear Cache**

In browser:

- Press `Ctrl+Shift+R` (hard refresh)
- Or clear browser cache

---

## 🎨 **Logo Fallback:**

If logo.png is missing, you'll see:

- ✨ Sparkles icon (Header & Footer)
- 📦 Package icon (Admin Panel)

**No broken images!**

---

## ✅ **Verification:**

After adding your logo:

1. Visit http://localhost:3000 (should see logo in header)
2. Scroll to footer (should see logo there too)
3. Visit http://localhost:3000/admin (should see logo in admin sidebar)

---

## 📝 **Alternative: Use SVG**

For better scalability, you can use SVG:

1. Save as `public/logo.svg`
2. Update file paths from `/logo.png` to `/logo.svg`

**Benefits:**

- Perfect at any size
- Smaller file size
- No quality loss

---

## 🎯 **Current Status:**

✅ Logo integration code is ready  
✅ All components updated to use logo  
✅ Fallback icons in place  
⏳ **Waiting for**: You to add `public/logo.png`

**Once you add the logo file, it will automatically appear everywhere!** 🎉
