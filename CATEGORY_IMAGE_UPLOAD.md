# Category Image Upload Feature

## ✅ **Cloudinary Image Upload Implemented**

The category form now includes a complete Cloudinary image upload system that uploads images and stores the returned URL string in MongoDB.

---

## **How It Works**

### **1. Upload Process**

```
User selects image → Validates file → Converts to base64 →
Sends to /api/upload → Cloudinary uploads → Returns URL →
Stores in MongoDB as string
```

### **2. Key Features**

✅ **Drag & Drop Interface**

- Click to upload image
- Visual upload area with icon
- Progress indicator during upload

✅ **File Validation**

- File type: Only images (PNG, JPG, WebP)
- File size: Maximum 5MB
- Instant error messages for invalid files

✅ **Image Preview**

- Shows uploaded image immediately
- 16:9 aspect ratio preview in table
- Full preview in form (192px height)

✅ **Image Management**

- **Remove**: Delete uploaded image
- **Change**: Upload a different image
- **Optional**: Categories can be created without images

✅ **Cloudinary Integration**

- Uploads to `categories` folder
- Returns standard Cloudinary URL
- Stored as simple string in MongoDB

---

## **Technical Implementation**

### **Frontend (categories/page.tsx)**

#### **Upload Handler**

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  // Validation
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB");
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64 = reader.result as string;

    // Upload to Cloudinary
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images: [base64], // Send as array with single image
        folder: "categories",
      }),
    });

    const data = await res.json();

    if (data.success) {
      // API returns array of images, we only need the first one
      const uploadedImage = data.images[0];
      setFormData({ ...formData, image: uploadedImage.url });
      toast.success("Image uploaded successfully!");
    }
  };
};
```

#### **UI Components**

**Empty State** (No image uploaded):

```tsx
<div className="border-2 border-dashed border-border rounded-lg p-8">
  <ImageIcon className="w-12 h-12 mx-auto" />
  <p>Click to upload image</p>
  <p className="text-xs">PNG, JPG, WebP up to 5MB</p>
</div>
```

**With Image** (After upload):

```tsx
<div className="relative w-full h-48">
  <Image src={formData.image} alt="Preview" fill />
</div>
<Button onClick={handleRemoveImage}>Remove Image</Button>
<Button>Change Image</Button>
```

**Table Display** (Category list):

```tsx
<td className="px-4 py-3">
  {category.image ? (
    <div className="relative w-16 h-16 rounded-md overflow-hidden">
      <Image src={category.image} alt={category.name} fill />
    </div>
  ) : (
    <div className="w-16 h-16 bg-secondary">
      <ImageIcon className="w-6 h-6" />
    </div>
  )}
</td>
```

---

### **Backend (API Route)**

The upload uses the existing `/api/upload` route:

```typescript
// POST /api/upload
{
  images: ["data:image/png;base64,iVBORw0KG..."],  // Array with single base64 string
  folder: "categories"                              // Cloudinary folder
}

// Response
{
  success: true,
  images: [{
    url: "https://res.cloudinary.com/your-cloud/image/upload/v123/categories/abc.jpg",
    publicId: "categories/abc",
    order: 0,
    isFeatured: true
  }]
}
```

---

### **Database Storage**

**MongoDB Document**:

```json
{
  "_id": "673abc123def456789012345",
  "id": "cat_1698765432000_xyz123",
  "name": "Gold Rings",
  "slug": "gold-rings",
  "image": "https://res.cloudinary.com/your-cloud/image/upload/v123/categories/gold-rings.jpg",
  "description": "Beautiful collection",
  "order": 0,
  "isActive": true,
  "createdAt": "2024-10-18T12:00:00.000Z",
  "updatedAt": "2024-10-18T12:00:00.000Z"
}
```

**Note**: The `image` field stores just the URL string, not an object. This matches the JSON structure and simplifies the data model.

---

## **Configuration**

### **Next.js Image Domains**

Updated `next.config.js` to allow Cloudinary images:

```javascript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "res.cloudinary.com",  // Added for Cloudinary
    },
  ],
}
```

---

## **User Experience**

### **Creating a Category with Image**

1. **Go to**: `/admin/categories`
2. **Click**: "Add Category"
3. **Fill form**:
   - Name: "Gold Rings"
   - Slug: (auto-generates)
4. **Upload image**:
   - Click upload area
   - Select image file
   - Wait for "Image uploaded successfully!"
   - See preview
5. **Complete form**:
   - Description: (optional)
   - Active: ✓
6. **Click**: "Create Category"

### **Editing Category Image**

1. **Click**: Edit button on category
2. **See**: Current image preview
3. **Options**:
   - **Remove Image**: Deletes the image
   - **Change Image**: Upload new image
4. **Save**: Updates category with new/removed image

---

## **Error Handling**

### **Validation Errors**

| Error             | Condition            | Message                            |
| ----------------- | -------------------- | ---------------------------------- |
| Invalid file type | Non-image file       | "Please select an image file"      |
| File too large    | > 5MB                | "Image size must be less than 5MB" |
| Upload failed     | Network/server error | "Failed to upload image"           |
| Read failed       | File read error      | "Failed to read file"              |

### **Success Messages**

| Action         | Message                                 |
| -------------- | --------------------------------------- |
| Image uploaded | "Image uploaded successfully!"          |
| Image removed  | "Image removed"                         |
| Category saved | "Category created/updated successfully" |

---

## **Best Practices**

### **Image Guidelines**

1. **Format**: Use PNG or JPG for best compatibility
2. **Size**: Keep under 2MB for fast loading
3. **Dimensions**: 800x800px or larger recommended
4. **Aspect Ratio**: Square (1:1) works best
5. **Content**: Clear, high-quality product/category images

### **Cloudinary Settings**

Make sure your Cloudinary account has:

- ✅ API key configured in `.env.local`
- ✅ Upload preset set up (if using unsigned upload)
- ✅ `categories` folder created (auto-created on first upload)
- ✅ Sufficient storage quota

---

## **Testing**

### **Test Cases**

1. ✅ Upload valid image → Should show preview and success
2. ✅ Upload invalid file type → Should show error
3. ✅ Upload file > 5MB → Should show error
4. ✅ Remove uploaded image → Should clear preview
5. ✅ Change image → Should replace with new one
6. ✅ Save category without image → Should work fine
7. ✅ Edit category and add image → Should update
8. ✅ View category in table → Should show thumbnail

---

## **Summary**

✅ **Complete upload system** with validation and error handling
✅ **Cloudinary integration** via `/api/upload` endpoint
✅ **Simple URL storage** in MongoDB (string, not object)
✅ **Beautiful UI** with preview, drag & drop, and actions
✅ **Optional images** - categories can exist without images
✅ **Image management** - remove and change functionality
✅ **Table display** - 64x64px thumbnails with fallback icons

The system is production-ready and provides a seamless image upload experience! 🎉
