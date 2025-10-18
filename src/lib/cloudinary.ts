import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(
  file: string, // base64 or file path
  folder: string = 'jewelry-store/products'
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: string[],
  folder: string = 'jewelry-store/products'
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error: any) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
}

/**
 * Delete multiple images
 */
export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
  const deletePromises = publicIds.map((id) => deleteFromCloudinary(id));
  await Promise.all(deletePromises);
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 400): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: size, height: size, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });
}

/**
 * Generate optimized URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    transformation: [
      width && height ? { width, height, crop: 'fill' } : { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:best' },
      { fetch_format: 'auto' },
    ],
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit',
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP formats are allowed',
    };
  }

  return { valid: true };
}

/**
 * Convert File to Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export default cloudinary;

