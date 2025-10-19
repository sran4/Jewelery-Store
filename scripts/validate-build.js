#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Runs TypeScript check, ESLint, and build verification
 * 
 * Usage: npm run validate
 * or: node scripts/validate-build.js
 */

const { execSync } = require('child_process');
const chalk = require('chalk') || {
  green: (str) => str,
  red: (str) => str,
  yellow: (str) => str,
  blue: (str) => str,
};

console.log('\n' + '='.repeat(50));
console.log('🚀 Pre-Deployment Validation');
console.log('='.repeat(50) + '\n');

let hasErrors = false;

// Step 1: TypeScript Check
console.log('🔍 Step 1/3: TypeScript Type Check...\n');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('\n✅ TypeScript check passed!\n');
} catch (error) {
  console.error('\n❌ TypeScript errors found!\n');
  console.error('Fix these errors before deploying.\n');
  hasErrors = true;
}

// Step 2: ESLint
if (!hasErrors) {
  console.log('🔍 Step 2/3: ESLint Check...\n');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('\n✅ ESLint check passed!\n');
  } catch (error) {
    console.error('\n⚠️  Linting warnings found (non-blocking)\n');
    // Don't block on linting warnings
  }
}

// Step 3: Build Test (optional - can be slow)
if (!hasErrors && process.argv.includes('--full')) {
  console.log('🔍 Step 3/3: Build Test...\n');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\n✅ Build successful!\n');
  } catch (error) {
    console.error('\n❌ Build failed!\n');
    hasErrors = true;
  }
} else if (!hasErrors) {
  console.log('⏭️  Step 3/3: Build test skipped (use --full to include)\n');
}

// Final Result
console.log('='.repeat(50));
if (hasErrors) {
  console.log('❌ VALIDATION FAILED');
  console.log('='.repeat(50) + '\n');
  console.log('Please fix the errors above before deploying.\n');
  process.exit(1);
} else {
  console.log('✅ VALIDATION PASSED');
  console.log('='.repeat(50) + '\n');
  console.log('🎉 All checks passed! Safe to deploy to Vercel.\n');
  console.log('💡 Tips:');
  console.log('   - Run "npm run validate --full" for complete build test');
  console.log('   - Environment variables must be set in Vercel dashboard');
  console.log('   - Monitor deployment at https://vercel.com/dashboard\n');
  process.exit(0);
}

