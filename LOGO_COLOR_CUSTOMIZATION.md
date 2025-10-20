# 🎨 Logo Ring Color Customization Guide

**Current Color**: Dark Red (`red-700/red-800`)  
**Status**: Applied to all logos (NOT pushed to GitHub yet)

---

## 📍 Files to Edit for Ring Color

All logos are located in these **6 files**:

### 1. **Header Logo** (Top navigation - all pages)

**File**: `src/components/layout/Header.tsx`  
**Line**: ~42

```tsx
// CURRENT (Dark Red)
ring-2 ring-red-700/40
bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20
group-hover:shadow-red-700/50
group-hover:ring-red-700/70
```

---

### 2. **Footer Logo** (Bottom of all pages)

**File**: `src/components/layout/Footer.tsx`  
**Line**: ~93

```tsx
// CURRENT (Dark Red)
ring-2 ring-red-700/40
bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20
```

---

### 3. **Admin Login Logo** (Large animated logo)

**File**: `src/app/admin/login/page.tsx`  
**Line**: ~79

```tsx
// CURRENT (Dark Red)
ring-4 ring-red-700/70
bg-gradient-to-br from-red-700/30 via-red-800/30 to-red-700/30
```

---

### 4. **Admin Sidebar Logo** (Admin panel navigation)

**File**: `src/components/admin/AdminLayout.tsx`  
**Line**: ~69

```tsx
// CURRENT (Dark Red)
ring-2 ring-red-700/40
bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20
group-hover:from-red-700/30 group-hover:via-red-800/30 group-hover:to-red-700/30
```

---

### 5. **Maintenance Page Logo**

**File**: `src/app/maintenance/page.tsx`  
**Line**: ~12

```tsx
// CURRENT (Dark Red)
ring-4 ring-red-700/40
bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20
```

---

### 6. **Contact Form Logo**

**File**: `src/components/contact/ContactForm.tsx`  
**Line**: ~135

```tsx
// CURRENT (Dark Red)
ring-2 ring-red-700/40
bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20
```

---

## 🎨 Color Options to Try

### Option 1: **Brighter Red** (More vibrant, eye-catching)

```tsx
ring-2 ring-red-600/50
bg-gradient-to-br from-red-600/25 via-red-700/25 to-red-600/25
```

**Best for**: Making logo pop, modern look

---

### Option 2: **True Red** (Classic, bold)

```tsx
ring-2 ring-red-500/50
bg-gradient-to-br from-red-500/30 via-red-600/30 to-red-500/30
```

**Best for**: Traditional red brand identity

---

### Option 3: **Burgundy/Wine** (Elegant, luxury)

```tsx
ring-2 ring-red-900/60
bg-gradient-to-br from-red-900/30 via-red-950/30 to-red-900/30
```

**Best for**: High-end, sophisticated look

---

### Option 4: **Rose Red** (Softer, feminine)

```tsx
ring-2 ring-rose-600/50
bg-gradient-to-br from-rose-600/25 via-rose-700/25 to-rose-600/25
```

**Best for**: Elegant jewelry brand

---

### Option 5: **Orange-Red** (Warm, energetic)

```tsx
ring-2 ring-orange-700/50
bg-gradient-to-br from-orange-700/25 via-red-700/25 to-orange-700/25
```

**Best for**: Warm, inviting feel

---

### Option 6: **Gold Ring** (Matches brand text - RECOMMENDED)

```tsx
ring-2 ring-amber-600/50
bg-gradient-to-br from-amber-500/25 via-yellow-500/25 to-amber-600/25
```

**Best for**: Luxury jewelry, matches "Shergill Official" gold text

---

### Option 7: **Pink-Red** (Playful, modern)

```tsx
ring-2 ring-pink-600/50
bg-gradient-to-br from-pink-600/25 via-red-600/25 to-pink-600/25
```

**Best for**: Modern, trendy look

---

### Option 8: **Blue** (Professional, trustworthy)

```tsx
ring-2 ring-blue-600/50
bg-gradient-to-br from-blue-600/25 via-blue-700/25 to-blue-600/25
```

**Best for**: Professional, corporate feel

---

### Option 9: **Green** (Natural, growth)

```tsx
ring-2 ring-emerald-600/50
bg-gradient-to-br from-emerald-600/25 via-emerald-700/25 to-emerald-600/25
```

**Best for**: Natural, eco-friendly brand

---

### Option 10: **Purple** (Luxury, creative)

```tsx
ring-2 ring-purple-600/50
bg-gradient-to-br from-purple-600/25 via-purple-700/25 to-purple-600/25
```

**Best for**: Creative, artistic brand

---

## 🔧 How to Change Colors

### Method 1: Search & Replace (All at once)

1. **Open Find & Replace** in VS Code: `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)

2. **Find**: `ring-red-700/40`  
   **Replace**: `ring-amber-600/50` (or any color from options above)

3. **Find**: `from-red-700/20 via-red-800/20 to-red-700/20`  
   **Replace**: `from-amber-500/25 via-yellow-500/25 to-amber-600/25`

4. **Find**: `ring-red-700/70` (for admin login)  
   **Replace**: `ring-amber-600/70`

5. **Find**: `from-red-700/30 via-red-800/30 to-red-700/30`  
   **Replace**: `from-amber-500/30 via-yellow-500/30 to-amber-600/30`

6. **Find**: `shadow-red-700/50` (hover effect)  
   **Replace**: `shadow-amber-600/50`

---

### Method 2: Manual (File by file)

Open each file and change the colors manually. This gives you more control.

---

## 💡 Understanding the Color Values

### Ring Color: `ring-red-700/40`

- `red-700` = Color shade (darker = higher number)
- `/40` = Opacity (0-100, higher = more opaque)

**Try these combinations**:

- `ring-red-600/50` = Brighter, more visible
- `ring-red-800/60` = Darker, more subtle
- `ring-red-700/30` = Same color, more transparent

---

### Gradient: `from-red-700/20 via-red-800/20 to-red-700/20`

- `from-` = Start color
- `via-` = Middle color (creates depth)
- `to-` = End color
- `/20` = Background opacity (subtle)

**For stronger gradients**: Increase to `/30` or `/40`  
**For subtler gradients**: Decrease to `/10` or `/15`

---

## 🎯 My Recommendation: GOLD RING

Since your brand uses gold/amber text, matching the ring would create consistency:

**Replace all instances of**:

```tsx
// OLD (Dark Red)
ring-2 ring-red-700/40
bg-gradient-to-br from-red-700/20 via-red-800/20 to-red-700/20
```

**With** (Gold):

```tsx
// NEW (Gold - matches brand)
ring-2 ring-amber-600/50
bg-gradient-to-br from-amber-500/25 via-yellow-500/25 to-amber-600/25
```

---

## 🧪 Test Before Committing

1. Make changes in VS Code
2. Save files (`Ctrl+S`)
3. Dev server will auto-refresh
4. Check logo in browser (light + dark mode)
5. If you like it, tell me and I'll commit + push!

---

## 📝 Current Status

✅ Footer logo updated to dark red  
⏳ Waiting for your color preference  
❌ NOT pushed to GitHub yet

---

## 🚀 Quick Color Test Commands

You can use VS Code's Find & Replace across all files:

**Press**: `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)  
**Check**: "Use Regular Expression" (icon: `.*`)  
**Search in**: Include the 6 files listed above

---

**Let me know which color you prefer, and I can apply it instantly!** 🎨
