/**
 * Image utility functions to handle both string URLs and image objects
 */

export type ImageType =
  | string
  | { url: string; publicId?: string; alt?: string };

// Placeholder image (elegant jewelry placeholder)
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80";

/**
 * Get the URL from an image (handles both string and object formats)
 */
export function getImageUrl(image: ImageType | undefined): string {
  if (!image) {
    return PLACEHOLDER_IMAGE;
  }

  if (typeof image === "string") {
    return image || PLACEHOLDER_IMAGE;
  }

  return image.url || PLACEHOLDER_IMAGE;
}

/**
 * Get the first image URL from an array of images
 */
export function getFirstImageUrl(images: ImageType[] | undefined): string {
  if (!images || images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }

  return getImageUrl(images[0]);
}

/**
 * Get all image URLs from an array of images
 */
export function getAllImageUrls(images: ImageType[] | undefined): string[] {
  if (!images || images.length === 0) {
    return [PLACEHOLDER_IMAGE];
  }

  return images.map((img) => getImageUrl(img));
}
