# Development Best Practices & Workflow

## 🎯 Purpose
This document outlines the best practices and workflows to avoid TypeScript errors, build failures, and deployment issues in Next.js projects. Follow these guidelines to save time and ensure smooth deployments.

---

## 📋 Pre-Deployment Checklist

### Before Every Git Push:

```bash
# 1. Run TypeScript check (10-30 seconds)
npm run type-check

# 2. Run linter
npm run lint

# 3. If both pass, push to GitHub
git add .
git commit -m "your commit message"
git push origin main
```

**This simple workflow prevents 95% of Vercel build failures!**

---

## 🛠️ Essential NPM Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint",
    "build:check": "npm run validate && npm run build",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Script Explanations:

- **`type-check`** - Fast TypeScript validation without building (10-30 sec)
- **`validate`** - Runs both TypeScript and ESLint checks
- **`build:check`** - Full validation + build (use before major pushes)

---

## 🔧 Git Hooks Setup (Recommended)

### Option 1: Husky (Automated)

**Install:**
```bash
npm install --save-dev husky lint-staged
npx husky init
```

**Create `.husky/pre-push`:**
```bash
#!/bin/sh
echo "🔍 Running TypeScript check..."
npm run type-check || exit 1

echo "✅ TypeScript check passed!"
echo "🔍 Running linter..."
npm run lint || exit 1

echo "✅ All checks passed! Pushing to GitHub..."
```

**Make it executable (Mac/Linux):**
```bash
chmod +x .husky/pre-push
```

### Option 2: Manual Check (Simpler)

Just remember to run before each push:
```bash
npm run type-check && git push origin main
```

---

## 🧪 Testing Setup (Optional but Recommended)

### Install Jest & Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest @testing-library/user-event
```

### Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

### Example Component Test:

**`src/components/ui/__tests__/Button.test.tsx`:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('only accepts valid variants', () => {
    // This would be caught at compile time
    // @ts-expect-error - testing invalid variant
    const { container } = render(<Button variant="invalid">Test</Button>);
  });
});
```

### Example API Route Test:

**`src/app/api/products/__tests__/route.test.ts`:**
```typescript
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/db/mongodb');
jest.mock('@/lib/models/Product');

describe('Products API', () => {
  it('returns products on GET request', async () => {
    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('products');
  });
});
```

---

## 🚀 GitHub Actions CI/CD (Automated Testing)

### Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality-check:
    name: Code Quality & Build Check
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v3
      
      - name: 📦 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 📥 Install dependencies
        run: npm ci
      
      - name: 🔍 TypeScript check
        run: npm run type-check
      
      - name: 🔍 ESLint check
        run: npm run lint
      
      - name: 🏗️ Build check
        run: npm run build
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          # Add other required env vars
      
      - name: ✅ All checks passed
        run: echo "🎉 Ready to deploy!"

  # Optional: Run tests if you have them
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: quality-check
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

**Benefits:**
- ✅ Runs on every push automatically
- ✅ Shows red ❌ or green ✅ on GitHub
- ✅ Prevents merging broken code
- ✅ Free for public repos

---

## 📝 Prompts for AI Assistance

### When Starting a New Feature:

```
I'm building [feature name] for a Next.js 14 app with TypeScript, MongoDB, and Tailwind.

Requirements:
- Use TypeScript with strict type checking
- Follow Next.js App Router conventions
- Ensure all component props are properly typed
- Use existing UI components from src/components/ui
- Test with: npm run type-check before completing

Please implement [specific feature details]
```

### When Fixing Bugs:

```
I'm getting this error in my Next.js app: [paste error]

Context:
- File: [file path]
- What I'm trying to do: [description]

Please:
1. Identify the root cause
2. Fix ALL similar issues in the codebase (not just this one)
3. Verify with TypeScript check
4. Provide the fix
```

### Before Deployment:

```
I'm about to deploy to Vercel. Please:
1. Run a full TypeScript check across the entire codebase
2. Identify ALL type errors (not just the first one)
3. Fix all errors in a single batch
4. Verify the build will succeed
5. Then commit and push

Be thorough - I want to avoid multiple deploy failures.
```

### For Code Review:

```
Please review this code for:
1. TypeScript errors or any usage
2. Missing null checks
3. Incorrect component prop types
4. Potential runtime errors
5. Missing error handling

File: [path]
[paste code]
```

---

## ⚡ Quick Commands Reference

### Daily Workflow:

```bash
# Start development
npm run dev

# Before committing
npm run type-check          # Fast check (10-30 sec)

# Before major push
npm run validate            # TypeScript + Lint

# Full verification
npm run build:check         # Everything + Build
```

### Troubleshooting:

```bash
# Find all TypeScript errors at once
npx tsc --noEmit

# Find specific error patterns
npx tsc --noEmit 2>&1 | grep "error TS"

# Check specific file
npx tsc --noEmit src/path/to/file.tsx

# Clear Next.js cache if build is stuck
rm -rf .next
npm run build
```

---

## 🎨 Common TypeScript Patterns to Avoid

### ❌ DON'T:

```typescript
// Using 'any' everywhere
const data: any = await fetch('/api/products');

// Missing null checks
const name = user.profile.name; // user or profile might be null

// Invalid enum values
<Button variant="default" /> // If "default" isn't in the type

// Incorrect spread types
const obj = { ...prev[key] }; // Key might not be an object
```

### ✅ DO:

```typescript
// Proper typing
interface ProductResponse {
  success: boolean;
  products: Product[];
}
const data: ProductResponse = await res.json();

// Null checks
const name = user?.profile?.name || 'Guest';

// Use correct types
<Button variant="primary" /> // From defined union type

// Type guards for spreads
const parentValue = prev[key];
const obj = {
  ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {})
};
```

---

## 🔍 Vercel-Specific Considerations

### Environment Variables:

**Always set in Vercel Dashboard, not in code:**
- Database URLs
- API keys
- Authentication secrets
- Third-party service keys

### Build Configuration:

**Add to `vercel.json` (if needed):**
```json
{
  "buildCommand": "npm run build:check",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### Static Generation Issues:

If pages fail during static generation:
1. Add `export const dynamic = 'force-dynamic'` to layout or page
2. Or disable `generateStaticParams` for dynamic routes
3. Or add proper `revalidate` options

---

## 📊 Error Prevention Checklist

Before pushing to GitHub:

- [ ] Run `npm run type-check` - **NO errors**
- [ ] Run `npm run lint` - **NO warnings**
- [ ] Test critical features locally
- [ ] Check console for runtime errors
- [ ] Verify environment variables are documented
- [ ] Update `.env.example` if new vars added

---

## 🎯 Time-Saving Tips

### 1. **Use TypeScript Strictly from Day 1**
- Enables auto-completion
- Catches errors as you type
- Reduces debugging time by 70%

### 2. **Create Reusable Type Definitions**
```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Usage
const response: ApiResponse<Product[]> = await res.json();
```

### 3. **Use Zod for Runtime Validation**
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  category: z.string(),
});

// Auto-generate TypeScript type
type Product = z.infer<typeof ProductSchema>;
```

### 4. **Leverage VS Code QuickFix**
- Press `Ctrl+.` on errors for auto-fixes
- Import missing types automatically
- Fix simple errors in seconds

---

## 📚 Recommended Reading

1. **TypeScript Best Practices**: https://typescript-eslint.io/rules/
2. **Next.js TypeScript Guide**: https://nextjs.org/docs/app/building-your-application/configuring/typescript
3. **Testing Next.js Apps**: https://nextjs.org/docs/app/building-your-application/testing

---

## 🚨 Emergency Fix Workflow

If Vercel build fails:

### Step 1: Reproduce Locally
```bash
npm run build
```

### Step 2: Find ALL Errors
```bash
npx tsc --noEmit 2>&1 | grep "error TS"
```

### Step 3: Fix All in Batch
- Don't fix one error at a time
- Find the pattern
- Fix all similar errors together

### Step 4: Verify
```bash
npx tsc --noEmit  # Should show "0 errors"
```

### Step 5: Push
```bash
git add .
git commit -m "fix: resolve all TypeScript errors"
git push origin main
```

---

## 💬 AI Assistant Prompts for Next Project

### Starting a New Feature:

```
I'm building a [feature name] for a Next.js 14 TypeScript app.

Tech Stack:
- Next.js 14 (App Router)
- TypeScript (strict mode)
- MongoDB + Mongoose
- Tailwind CSS
- NextAuth.js

Requirements:
1. All code must be fully typed (no 'any' unless absolutely necessary)
2. Include proper error handling
3. Add loading states
4. Follow existing component patterns in src/components/ui
5. Run 'npm run type-check' to verify before completion
6. Ensure Vercel build compatibility (no localhost fetches in generateStaticParams)

Feature Details:
[Describe your feature]

Please implement this with production-ready code.
```

### Fixing Build Errors:

```
My Vercel build is failing. I need you to:

1. Run 'npx tsc --noEmit' locally to find ALL TypeScript errors
2. Show me all errors found (don't fix yet)
3. Fix ALL errors in one batch (not one-by-one)
4. Verify with 'npx tsc --noEmit' that errors are gone
5. Then commit and push

Build error log:
[paste Vercel error]

Let's fix everything at once to avoid multiple failed deployments.
```

### Code Review Before Push:

```
Before I push to production, please review this code:

File: [path]

Review for:
1. TypeScript errors (any usage, missing types, null safety)
2. Component prop type correctness
3. API response type handling
4. Error boundaries
5. Missing null/undefined checks
6. Potential runtime errors

[paste code or file path]

Be strict - I prefer to fix issues now rather than in production.
```

### Debugging Production Issues:

```
I'm seeing this error in production: [error]

Environment: Vercel production
Page: [URL]
User Action: [what they did]

Please:
1. Identify the root cause
2. Check if it's environment-related (missing env vars)
3. Provide a fix that works in production
4. Suggest how to prevent similar issues

Do not suggest solutions that only work in development.
```

---

## 🎨 Component Development Pattern

### Template for New Components:

```typescript
'use client'; // Only if using hooks

import { ComponentType } from 'react';
import { cn } from '@/lib/utils';

// 1. Define Props Interface
interface MyComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onAction?: () => void;
  className?: string;
}

// 2. Component with Proper Types
export function MyComponent({
  title,
  description,
  variant = 'default',
  size = 'md',
  onAction,
  className,
}: MyComponentProps) {
  // 3. Type-safe state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 4. Type-safe handlers
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onAction?.();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('base-styles', className)}>
      {/* Component JSX */}
    </div>
  );
}
```

---

## 🗂️ File Organization Best Practices

### Folder Structure:

```
src/
├── app/                    # Next.js pages (App Router)
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, etc.)
│   ├── common/            # Shared components (Spinner, Modal, etc.)
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── constants.ts       # App-wide constants
│   ├── validation.ts      # Zod schemas
│   └── models/            # Mongoose models
├── types/
│   └── index.ts           # Shared TypeScript types
└── hooks/                 # Custom React hooks
```

### Naming Conventions:

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Types**: PascalCase with 'I' prefix for interfaces (`IProduct`)
- **Hooks**: camelCase with 'use' prefix (`useProducts.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_UPLOAD_SIZE`)

---

## 🔒 Type Safety Rules

### 1. **Never Use `any` Without Comment**

```typescript
// ❌ Bad
const data: any = response.json();

// ✅ Good
interface ApiResponse {
  success: boolean;
  data: Product[];
}
const data: ApiResponse = await response.json();

// ⚠️ Acceptable (with comment)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicData: any = JSON.parse(userInput); // User input is truly dynamic
```

### 2. **Always Define API Response Types**

```typescript
// src/types/api.ts
export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
}

// Usage
const response = await fetch('/api/products');
const data: ProductsResponse = await response.json();
```

### 3. **Use Discriminated Unions for States**

```typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error'; error: string };

const [state, setState] = useState<LoadingState>({ status: 'idle' });

// TypeScript knows what properties are available
if (state.status === 'success') {
  console.log(state.data); // ✅ TypeScript knows 'data' exists
}
```

---

## 🎯 Common Pitfalls & Solutions

### Issue: "Property does not exist on type"

**Cause**: Accessing properties that don't exist in the type definition

**Solution:**
```typescript
// ❌ Bad
const name = user.profile.name;

// ✅ Good - Optional chaining
const name = user?.profile?.name || 'Guest';

// ✅ Good - Type guard
if (user && user.profile && user.profile.name) {
  const name = user.profile.name;
}
```

### Issue: "Type is not assignable"

**Cause**: Trying to assign incompatible types

**Solution:**
```typescript
// ❌ Bad
const variants = { active: 'default', inactive: 'outline' };
<Button variant={variants[status]} /> // 'default' not in Button's variant type

// ✅ Good - Use correct types
const variants: Record<string, 'primary' | 'secondary' | 'outline'> = {
  active: 'primary',
  inactive: 'outline',
};
<Button variant={variants[status] || 'primary'} />
```

### Issue: "Object is possibly null/undefined"

**Cause**: Not checking for null/undefined before accessing

**Solution:**
```typescript
// ❌ Bad
const firstProduct = products[0];
return firstProduct.title;

// ✅ Good
const firstProduct = products[0];
if (!firstProduct) return null;
return firstProduct.title;

// ✅ Good - One-liner
return products[0]?.title || 'No title';
```

### Issue: Mongoose Document Type Conflicts

**Cause**: Mixing Document types with plain objects

**Solution:**
```typescript
// ❌ Bad
let settings = await Settings.findOne().lean();
settings = await Settings.create(defaults); // Type mismatch

// ✅ Good
let settings = await Settings.findOne().lean();
if (!settings) {
  const created = await Settings.create(defaults);
  settings = created.toObject();
}
```

---

## 📈 Performance Optimization

### 1. **Use Dynamic Imports for Heavy Components**

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <FancySpinner />,
  ssr: false,
});
```

### 2. **Optimize Images**

```typescript
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Product"
  width={500}
  height={500}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority // For above-fold images
/>
```

### 3. **Use React.memo for Expensive Components**

```typescript
export const ProductCard = React.memo(function ProductCard({ product }: Props) {
  // Component code
});
```

---

## 🛡️ Security Best Practices

### 1. **Never Expose Secrets in Code**

```typescript
// ❌ Bad
const apiKey = 'sk_live_abc123';

// ✅ Good
const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) throw new Error('STRIPE_SECRET_KEY not configured');
```

### 2. **Validate All User Input**

```typescript
import { z } from 'zod';

const userInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// Validate before using
const validated = userInputSchema.parse(formData);
```

### 3. **Sanitize Database Queries**

```typescript
// ❌ Bad - SQL Injection risk
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Good - Parameterized (Mongoose handles this)
const user = await User.findOne({ email: email.toLowerCase() });
```

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All ESLint warnings fixed (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables documented in `.env.example`
- [ ] All environment variables added to Vercel
- [ ] Database connection string updated for production
- [ ] API keys are for production (not test/dev)
- [ ] CORS settings configured correctly
- [ ] Rate limiting enabled on API routes
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (GA, FB Pixel)
- [ ] SEO metadata added to all pages
- [ ] Social media sharing tested
- [ ] Mobile responsiveness verified
- [ ] Dark mode tested (if applicable)
- [ ] 404 and error pages working

---

## 🎓 Learning Resources

### TypeScript:
- Official Docs: https://www.typescriptlang.org/docs/
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/

### Next.js:
- App Router Docs: https://nextjs.org/docs/app
- TypeScript Guide: https://nextjs.org/docs/app/building-your-application/configuring/typescript

### Testing:
- Jest Docs: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/

---

## 💡 Pro Tips

1. **Use the TypeScript Playground**: https://www.typescriptlang.org/play
   - Test complex types before implementing

2. **Enable VS Code Type Hints**:
   - Hover over variables to see inferred types
   - Use `Ctrl+Space` for autocomplete

3. **Use Type Assertions Sparingly**:
   - `as any` should be a last resort
   - Document why it's needed

4. **Create Helper Functions for Common Patterns**:
   ```typescript
   // src/lib/typeGuards.ts
   export function isProductImage(img: unknown): img is ProductImage {
     return typeof img === 'object' && img !== null && 'url' in img;
   }
   ```

5. **Use ESLint Auto-Fix**:
   ```bash
   npx eslint --fix src/
   ```

---

## 📞 Support & Resources

### When Stuck:

1. **Check TypeScript Error Message Carefully** - Often tells you exactly what's wrong
2. **Search Error on Google** - Include "Next.js" or "TypeScript" in search
3. **Check GitHub Issues** - Next.js, TypeScript, or package-specific repos
4. **Ask AI with Context** - Provide full error, file path, and what you're trying to do

### Useful Commands:

```bash
# Find where a type is defined
npx tsc --noEmit --listFiles | grep ProductImage

# Check TypeScript version
npx tsc --version

# Update TypeScript
npm install --save-dev typescript@latest

# Clean everything and reinstall
rm -rf node_modules .next
npm install
```

---

## ✅ Summary - Quick Workflow

**Daily Development:**
```bash
1. npm run dev              # Start development
2. Make changes             # Code your feature
3. npm run type-check       # Verify TypeScript (30 sec)
4. git add . && git commit  # Commit if passing
5. git push origin main     # Deploy to Vercel
```

**Before Major Release:**
```bash
1. npm run validate         # TypeScript + Lint
2. npm run build            # Full build test
3. npm test                 # Run tests (if setup)
4. git push origin main     # Deploy
```

**Emergency Fix:**
```bash
1. npx tsc --noEmit         # Find ALL errors
2. Fix all errors together  # Batch fixes
3. npx tsc --noEmit         # Verify 0 errors
4. git add . && git commit && git push
```

---

## 🎉 Success Metrics

Following these practices will:
- ✅ Reduce deployment failures by 90%
- ✅ Save 3-5 minutes per deployment
- ✅ Catch errors before they reach production
- ✅ Improve code quality and maintainability
- ✅ Speed up development with better tooling

---

**Remember: 30 seconds of local validation saves 5+ minutes of Vercel build time!**

---

*Last Updated: October 2025*
*For: SherGill Official Jewelry Store & Future Projects*

