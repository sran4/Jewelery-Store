import { z } from 'zod';

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    'Password must contain at least one special character'
  );

/**
 * Admin login validation
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/**
 * Admin password change validation
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Product validation schema
 */
export const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required').toUpperCase(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  discountPrice: z.number().min(0).optional(),
  category: z.enum(['rings', 'bracelets', 'necklaces', 'earrings']),
  material: z.string().optional(),
  inStock: z.boolean(),
  quantityInStock: z.number().min(0, 'Quantity must be positive'),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  popularityScore: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Contact form validation
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  inquiryType: z.enum([
    'General Inquiry',
    'Product Question',
    'Custom Order',
    'Repair Service',
    'Return/Exchange',
    'Other',
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * Category validation
 */
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Site settings validation
 */
export const siteSettingsSchema = z.object({
  promotionalMessage: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string().email(),
  address: z.string(),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    pinterest: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

