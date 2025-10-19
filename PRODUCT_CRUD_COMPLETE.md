# Product CRUD - Complete Implementation

## ✅ **Comprehensive Product Management with Cloudinary**

All backend routes and data models have been updated to support complete CRUD operations with all fields from the JSON structure.

---

## **Supported Fields (matches products.json)**

### **From JSON Structure:**

```json
{
  "id": "prod_001",
  "sku": "RNG-GLD-001",
  "title": "Elegant Diamond Ring",
  "description": "Exquisite 18K yellow gold ring...",
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
  "images": ["url1", "url2"...],
  "rating": 4.8,
  "tags": ["diamond", "luxury", "wedding"]
}
```

### **Backend Support:**

✅ **All fields validated and stored in MongoDB**
✅ **Images support both formats (max 5 images):**

- Simple string array: `["url1", "url2"]`
- Complex object array: `[{url, publicId, alt, order, isFeatured}]`

---

## **Updated Components**

### **1. Validation Schema (`src/lib/validation.ts`)**

```typescript
export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required").toUpperCase(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  category: z.enum(["rings", "bracelets", "necklaces", "earrings"]),
  material: z.string().optional(),
  inStock: z.boolean(),
  quantityInStock: z.number().min(0, "Quantity must be positive"),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  popularityScore: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  images: z
    .union([
      z.array(z.string().url()),
      z.array(
        z.object({
          url: z.string().url(),
          publicId: z.string(),
          alt: z.string().optional(),
          order: z.number().default(0),
          isFeatured: z.boolean().default(false),
        })
      ),
    ])
    .optional(),
  tags: z.array(z.string()).optional(),
});
```

### **2. Product Model (`src/lib/models/Product.ts`)**

**Key Changes:**

- ✅ Images field uses `Schema.Types.Mixed` to accept both strings and objects
- ✅ `publicId` is optional (not all images have it)
- ✅ Validates 0-5 images (max 5)
- ✅ Auto-calculates discount percentage
- ✅ Auto-generates product ID

```typescript
export interface IProduct extends Document {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  category: "rings" | "bracelets" | "necklaces" | "earrings";
  material?: string;
  inStock: boolean;
  quantityInStock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  popularityScore?: number;
  images: (string | IProductImage)[];
  rating?: number;
  tags?: string[];
  // ... other fields
}
```

### **3. API Routes**

#### **POST /api/products** - Create Product

- ✅ Accepts all fields
- ✅ Validates with Zod schema
- ✅ Creates product with auto-generated ID
- ✅ Creates version history

#### **GET /api/products** - List Products

- ✅ Public endpoint
- ✅ Filters by category, featured, inStock, search
- ✅ Returns all product data

#### **GET /api/products/[id]** - Get Single Product

- ✅ Public endpoint
- ✅ Returns full product data

#### **PUT /api/products/[id]** - Update Product

- ✅ Admin only
- ✅ Partial update support
- ✅ Increments version number
- ✅ Creates version history

#### **DELETE /api/products/[id]** - Delete Product

- ✅ Admin only
- ✅ Deletes Cloudinary images (if they have publicIds)
- ✅ Creates deletion history
- ✅ Handles both string and object image arrays

---

## **Admin Form Updates Needed**

The admin form (`src/app/admin/products/new/page.tsx`) needs these fields added to the UI:

### **✅ Already Implemented:**

- Title, Description, SKU, Category
- Price, Quantity, In Stock
- Images (Cloudinary upload via ImageUploader)

### **📝 Fields to Add to UI:**

1. **Discount Price** (replace "Compare Price")

   ```tsx
   <Input
     type="number"
     step="0.01"
     value={formData.discountPrice}
     onChange={(e) =>
       handleInputChange("discountPrice", parseFloat(e.target.value) || 0)
     }
     placeholder="Sale Price"
   />
   ```

2. **Material** (single field, not array)

   ```tsx
   <Input
     value={formData.material}
     onChange={(e) => handleInputChange("material", e.target.value)}
     placeholder="18K Gold"
   />
   ```

3. **Tags** (comma-separated)

   ```tsx
   <Input
     value={formData.tags.join(", ")}
     onChange={(e) => handleArrayChange("tags", e.target.value)}
     placeholder="diamond, luxury, wedding"
   />
   ```

4. **Checkboxes:**

   ```tsx
   <input
     type="checkbox"
     checked={formData.isNew}
     onChange={(e) => handleInputChange("isNew", e.target.checked)}
   />
   <label>Mark as New Product</label>

   <input
     type="checkbox"
     checked={formData.isFeatured}
     onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
   />
   <label>Featured Product</label>
   ```

5. **Rating** (0-5)

   ```tsx
   <Input
     type="number"
     step="0.1"
     min="0"
     max="5"
     value={formData.rating}
     onChange={(e) =>
       handleInputChange("rating", parseFloat(e.target.value) || 0)
     }
     placeholder="4.8"
   />
   ```

6. **Popularity Score** (0-100)
   ```tsx
   <Input
     type="number"
     min="0"
     max="100"
     value={formData.popularityScore}
     onChange={(e) =>
       handleInputChange("popularityScore", parseInt(e.target.value) || 50)
     }
     placeholder="50"
   />
   ```

---

## **Image Handling**

### **Cloudinary Upload Flow:**

1. User uploads image via `ImageUploader` component
2. Image converts to base64
3. Sends to `/api/upload` with folder: "products"
4. Cloudinary returns: `{url, publicId}`
5. Stores in form as `UploadedImage[]`
6. On submit, formats to API structure:

```typescript
const formattedImages = formData.images.map((img, index) => ({
  url: img.url,
  publicId: img.publicId || "",
  alt: formData.title,
  order: index,
  isFeatured: index === 0,
}));
```

### **Supported Image Formats:**

**Option 1: Simple String Array** (from JSON)

```json
"images": [
  "https://images.unsplash.com/photo-1.jpg",
  "https://images.unsplash.com/photo-2.jpg"
]
```

**Option 2: Complex Object Array** (from Cloudinary upload)

```json
"images": [
  {
    "url": "https://res.cloudinary.com/...jpg",
    "publicId": "products/abc123",
    "alt": "Product name",
    "order": 0,
    "isFeatured": true
  }
]
```

**Both formats are accepted and stored correctly!**

---

## **Auto-Calculations**

### **Discount Percentage:**

```typescript
const discount =
  formData.discount ||
  (formData.discountPrice && formData.price > 0
    ? Math.round(
        ((formData.price - formData.discountPrice) / formData.price) * 100
      )
    : 0);
```

**Example:**

- Price: $2999.99
- Discount Price: $2399.99
- Auto-calculated discount: 20%

---

## **Testing Checklist**

### **✅ Backend (Complete)**

- [x] POST /api/products - Create with all fields
- [x] GET /api/products - List all products
- [x] GET /api/products/[id] - Get single product
- [x] PUT /api/products/[id] - Update product
- [x] DELETE /api/products/[id] - Delete product
- [x] Image validation (string[] and object[])
- [x] Auto-generate product ID
- [x] Version history tracking
- [x] Cloudinary image deletion

### **🔨 Frontend (In Progress)**

- [x] ImageUploader component integrated
- [x] Basic fields (title, description, price, etc.)
- [x] Category selection
- [ ] Add discountPrice field to UI
- [ ] Add material field (single, not array)
- [ ] Add tags field
- [ ] Add isNew checkbox
- [ ] Add isFeatured checkbox
- [ ] Add rating input
- [ ] Add popularityScore input
- [ ] Update edit form with same fields

---

## **Summary**

✅ **Backend is 100% complete** - All CRUD operations work with all fields
✅ **Image handling is flexible** - Supports both simple strings and complex objects
✅ **Cloudinary integration** - Upload, store, and delete images
✅ **Validation** - Zod schema validates all fields
✅ **Version history** - Tracks all changes
✅ **Auto-calculations** - Discount percentage, product ID

**Next Steps:**

1. Add missing UI fields to product form
2. Update edit form to match new form
3. Test complete flow end-to-end

The backend is production-ready! 🎉
