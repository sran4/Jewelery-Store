# 📋 Backend Integration - Complete Task List

## 🎯 PHASE 1: Setup & Configuration (Week 1, Days 1-2)

### Task 1.1: Environment Setup
- [ ] Create `.env.example` with all required variables
- [ ] Create MongoDB Atlas account setup guide
- [ ] Create Cloudinary account setup guide
- [ ] Create SendGrid account setup guide
- [ ] Create Google OAuth credentials guide
- [ ] Create Facebook Pixel setup guide
- [ ] Create Google Analytics setup guide
- [ ] Document all API key locations and setup steps

### Task 1.2: Install Dependencies
- [ ] Install Mongoose for MongoDB
- [ ] Install NextAuth.js for authentication
- [ ] Install bcryptjs for password hashing
- [ ] Install jsonwebtoken for JWT
- [ ] Install Cloudinary SDK
- [ ] Install @sendgrid/mail
- [ ] Install Zod for validation
- [ ] Install React Hook Form
- [ ] Install react-dropzone for file upload
- [ ] Install react-image-crop for image cropping
- [ ] Install papaparse for CSV handling
- [ ] Install express-rate-limit or similar

---

## 🗄️ PHASE 2: Database & Models (Week 1, Days 3-4)

### Task 2.1: MongoDB Connection
- [ ] Create database connection utility (`lib/db/mongodb.ts`)
- [ ] Add connection pooling
- [ ] Add error handling
- [ ] Test connection in development
- [ ] Add connection status indicator in admin panel

### Task 2.2: Create Mongoose Models
- [ ] Admin model with password hashing
- [ ] Product model with image array (flexible 1-5)
- [ ] Category model
- [ ] SiteSettings model
- [ ] ProductHistory model (version control)
- [ ] ContactSubmission model
- [ ] Add indexes for performance
- [ ] Add validation schemas

### Task 2.3: Data Migration
- [ ] Create seed script to migrate JSON to MongoDB
- [ ] Keep JSON file as fallback/backup
- [ ] Test data integrity after migration
- [ ] Create backup/restore utilities

---

## 🔐 PHASE 3: Authentication System (Week 1, Days 5-7)

### Task 3.1: NextAuth.js Setup
- [ ] Configure NextAuth with credentials provider
- [ ] Add Google OAuth provider (backup login)
- [ ] Create custom JWT strategy
- [ ] Add session handling (30-day remember me)
- [ ] Create middleware for protected routes

### Task 3.2: Admin Login Page
- [ ] Design modern login UI with glassmorphism
- [ ] Add email/password form
- [ ] Add "Remember me for 30 days" checkbox
- [ ] Add Google OAuth button (backup)
- [ ] Add loading states
- [ ] Add error messages
- [ ] Add rate limiting display
- [ ] Add security badges (HTTPS, encryption)

### Task 3.3: Password System
- [ ] Create password validation utility
- [ ] Build PasswordStrength component
  - [ ] Real-time validation (8+ chars, uppercase, lowercase, number, special)
  - [ ] Visual strength meter (Weak/Medium/Strong)
  - [ ] Live checkmarks for each requirement
  - [ ] Color-coded feedback
- [ ] Implement bcrypt hashing
- [ ] Add case-insensitive username handling
- [ ] Add rate limiting (5 attempts/hour)
- [ ] Add account lockout after failed attempts

### Task 3.4: Session Management
- [ ] JWT token generation
- [ ] Token refresh mechanism
- [ ] Logout functionality
- [ ] Session expiry handling
- [ ] "Remember me" token extension

---

## 🖼️ PHASE 4: Cloudinary Integration (Week 2, Days 1-2)

### Task 4.1: Cloudinary Setup
- [ ] Configure Cloudinary client
- [ ] Create upload utility functions
- [ ] Add image transformation presets
- [ ] Create thumbnail generation pipeline
- [ ] Add error handling for uploads

### Task 4.2: Image Upload Component
- [ ] Create ImageUploader component
  - [ ] Drag & drop zone (up to 5 images)
  - [ ] File type validation (JPEG, PNG, WebP)
  - [ ] File size validation (max 5MB)
  - [ ] Image preview before upload
  - [ ] Dimension validation (min 1200x1200)
  - [ ] Progress bars for each upload
- [ ] Create ImageCropper component
  - [ ] 1:1 aspect ratio enforcement
  - [ ] Zoom in/out
  - [ ] Rotate functionality
  - [ ] Preview final crop
- [ ] Create ImageManager component
  - [ ] Display uploaded images
  - [ ] Drag & drop to reorder
  - [ ] Set featured image
  - [ ] Delete individual images
  - [ ] Show image details (size, dimensions)

### Task 4.3: Upload API
- [ ] Create `/api/upload` endpoint
- [ ] Handle single image upload
- [ ] Handle bulk upload (up to 5)
- [ ] Return Cloudinary URLs and public IDs
- [ ] Add error handling
- [ ] Add file validation
- [ ] Add rate limiting

### Task 4.4: Image Display Updates
- [ ] Update ImageGallery to handle 1-5 images
- [ ] Update ProductCard to handle missing images
- [ ] Add fallback images
- [ ] Test with 1, 2, 3, 4, 5 image scenarios

---

## 🛠️ PHASE 5: API Routes (Week 2, Days 3-4)

### Task 5.1: Product APIs
- [ ] `GET /api/products` - Fetch all products
  - [ ] Add pagination
  - [ ] Add filtering
  - [ ] Add sorting
  - [ ] Add search
- [ ] `POST /api/products` - Create new product
  - [ ] Validate input
  - [ ] Save to database
  - [ ] Create version history
  - [ ] Return created product
- [ ] `GET /api/products/[id]` - Fetch single product
- [ ] `PUT /api/products/[id]` - Update product
  - [ ] Validate input
  - [ ] Update database
  - [ ] Create version history entry
  - [ ] Handle image updates
- [ ] `DELETE /api/products/[id]` - Delete product
  - [ ] Soft delete with version history
  - [ ] Delete Cloudinary images
- [ ] `POST /api/products/bulk` - Bulk operations
  - [ ] Bulk delete
  - [ ] Bulk discount
  - [ ] Bulk category change
- [ ] `POST /api/products/import` - CSV import
- [ ] `GET /api/products/export` - CSV export

### Task 5.2: Category APIs
- [ ] CRUD operations for categories
- [ ] Category image upload
- [ ] Reorder categories

### Task 5.3: Settings APIs
- [ ] GET site settings
- [ ] UPDATE site settings
- [ ] Version tracking for settings changes

### Task 5.4: Contact APIs
- [ ] POST contact form submission
- [ ] GET all submissions (admin)
- [ ] Mark as read
- [ ] Add admin notes

### Task 5.5: Security
- [ ] Add rate limiting to all API routes
- [ ] Add CORS configuration
- [ ] Add request validation with Zod
- [ ] Add authentication middleware
- [ ] Add HTTPS enforcement
- [ ] Add input sanitization

---

## 🎨 PHASE 6: Admin Panel UI (Week 2, Days 5-7)

### Task 6.1: Admin Layout
- [ ] Create AdminLayout with sidebar
- [ ] Add admin navigation
- [ ] Add logout button
- [ ] Add user info display
- [ ] Make responsive for mobile

### Task 6.2: Dashboard Page
- [ ] Show statistics cards
  - [ ] Total products
  - [ ] In stock / Out of stock
  - [ ] New contact submissions
  - [ ] Recent updates
- [ ] Show recent products
- [ ] Show recent contact submissions
- [ ] Add quick actions

### Task 6.3: Product Management
- [ ] **Product List Page**
  - [ ] Data table with search
  - [ ] Filter by category, stock status
  - [ ] Sort by various fields
  - [ ] Bulk select checkboxes
  - [ ] Quick actions (edit, delete, duplicate)
  - [ ] Pagination
  
- [ ] **Add New Product Form**
  - [ ] All product fields
  - [ ] Image uploader (1-5 images)
  - [ ] Image cropper integration
  - [ ] Real-time validation
  - [ ] Save as draft button (optional)
  - [ ] Publish button
  - [ ] Form field notes (image specs, etc.)
  
- [ ] **Edit Product Form**
  - [ ] Load existing data
  - [ ] Update all fields
  - [ ] Manage existing images
  - [ ] Add new images
  - [ ] Version history viewer
  - [ ] Save changes button
  
- [ ] **Bulk Actions Panel**
  - [ ] Select multiple products
  - [ ] Bulk delete with confirmation
  - [ ] Bulk discount application
  - [ ] Bulk category change
  - [ ] Bulk stock status update

### Task 6.4: Category Management
- [ ] List all categories
- [ ] Add new category
- [ ] Edit category
- [ ] Delete category (with warning if products exist)
- [ ] Upload category image
- [ ] Reorder categories

### Task 6.5: Site Settings
- [ ] Edit promotional message
- [ ] Update contact information
- [ ] Update social media links
- [ ] Update SEO settings
- [ ] Save changes with version history

### Task 6.6: Contact Submissions
- [ ] List all submissions
- [ ] Mark as read/unread
- [ ] Add admin notes
- [ ] Filter by status, date
- [ ] Delete submissions

### Task 6.7: CSV Import/Export
- [ ] CSV upload component
- [ ] Parse and validate CSV
- [ ] Preview import data
- [ ] Confirm and import
- [ ] Export products to CSV
- [ ] CSV template download

---

## 🔌 PHASE 7: Frontend Updates (Week 3, Days 1-2)

### Task 7.1: API Integration
- [ ] Update homepage to fetch from database
- [ ] Update products page to fetch from API
- [ ] Update product detail to fetch from API
- [ ] Add loading skeletons
- [ ] Add error states
- [ ] Add retry logic

### Task 7.2: Image Handling
- [ ] Update ImageGallery for flexible images (1-5)
- [ ] Add fallback images
- [ ] Handle missing images gracefully
- [ ] Test with various image counts

### Task 7.3: Contact Form
- [ ] Update to save to database
- [ ] Send email notification to admin
- [ ] Add success confirmation
- [ ] Add rate limiting

---

## 📧 PHASE 8: Email Integration (Week 3, Day 3)

### Task 8.1: SendGrid Setup
- [ ] Configure SendGrid client
- [ ] Create email templates
  - [ ] Contact form notification
  - [ ] Admin welcome email
- [ ] Test email delivery
- [ ] Add error handling

### Task 8.2: Email Notifications
- [ ] Send email on new contact submission
- [ ] Include submission details
- [ ] Add reply-to header
- [ ] Test spam folder handling

---

## 📊 PHASE 9: Analytics Integration (Week 3, Day 4)

### Task 9.1: Facebook Pixel
- [ ] Add Facebook Pixel script
- [ ] Track page views
- [ ] Track product views
- [ ] Track contact form submissions
- [ ] Test in Facebook Events Manager

### Task 9.2: Google Analytics
- [ ] Add GA4 script
- [ ] Configure data streams
- [ ] Track page views
- [ ] Track events (product views, contact)
- [ ] Test in GA4 console

---

## 🔒 PHASE 10: Security & Testing (Week 3, Days 5-6)

### Task 10.1: Security Implementation
- [ ] HTTPS enforcement in production
- [ ] CORS configuration
- [ ] Rate limiting on all endpoints
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens

### Task 10.2: Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test image upload (1-5 images)
- [ ] Test bulk operations
- [ ] Test CSV import/export
- [ ] Test rate limiting
- [ ] Test error scenarios
- [ ] Test on mobile devices

---

## 📚 PHASE 11: Documentation (Week 3, Day 7)

### Task 11.1: Setup Guides
- [ ] MongoDB Atlas setup guide
- [ ] Cloudinary setup guide
- [ ] SendGrid setup guide
- [ ] Google OAuth setup guide
- [ ] Facebook Pixel setup guide
- [ ] Google Analytics setup guide
- [ ] Environment variables guide

### Task 11.2: Admin Guides
- [ ] How to login
- [ ] How to add products
- [ ] How to upload images (with specs)
- [ ] How to use bulk actions
- [ ] How to import CSV
- [ ] How to manage settings
- [ ] Troubleshooting guide

---

## 📊 Subtask Breakdown by Priority

### **CRITICAL (Must Complete First)**
1. MongoDB connection and models
2. Admin authentication (login/logout)
3. Product CRUD APIs
4. Cloudinary image upload
5. Admin product management UI

### **HIGH PRIORITY**
6. Image cropping/resizing
7. Flexible image handling (1-5)
8. Contact form database integration
9. SendGrid email notifications
10. Rate limiting

### **MEDIUM PRIORITY**
11. Bulk operations
12. CSV import/export
13. Version history
14. Settings management
15. Category management

### **LOW PRIORITY (Enhancement)**
16. Google OAuth backup
17. Facebook Pixel
18. Google Analytics
19. Advanced dashboard stats

---

## 🔧 Technical Decisions Made

### **Admin Credential Recovery:**
**Solution**: Google OAuth as backup login method
- Admin can login with username/password (primary)
- OR login with Google account (backup)
- Only whitelisted Google email allowed
- No password reset needed - just use Google OAuth

**Why This Works:**
- ✅ No email recovery system needed
- ✅ No security questions
- ✅ Google handles 2FA if enabled
- ✅ Simple and secure
- ✅ Admin always has access

### **Image Quality (5MB Consideration):**
For **crisp, high-quality** images at 5MB:
- **Recommended**: 2000×2000px at 72 DPI
- **Format**: JPEG at 90% quality OR WebP
- **Cloudinary** will auto-optimize:
  - Creates multiple sizes
  - Converts to WebP automatically
  - Delivers via CDN
  - Responsive images
  
**Result**: Professional quality while staying under 5MB!

### **Email Service:**
**SendGrid** (Better free tier than EmailJS)
- Free: 100 emails/day
- Better deliverability
- Professional templates
- Analytics included
- Easy integration

---

## 📝 Next Steps

**Ready to start implementation?**

I'll begin with:
1. ✅ Create all setup guides
2. ✅ Update package.json with dependencies
3. ✅ Create `.env.example` file
4. ✅ Build database connection
5. ✅ Create Mongoose models
6. ✅ Build authentication system
7. ✅ Create admin login page
8. ✅ Build image upload system
9. ✅ Create admin panel
10. ✅ Integrate everything

**Estimated Time**: 15-20 hours of development work spread over 2-3 weeks

**Want me to start coding?** 🚀

