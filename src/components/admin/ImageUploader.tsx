'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { validateImageFile, fileToBase64 } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

export interface UploadedImage {
  url: string;
  publicId: string;
  order: number;
  isFeatured: boolean;
  file?: File;
  preview?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  onUpload?: (files: File[]) => Promise<UploadedImage[]>;
}

export function ImageUploader({ 
  images, 
  onChange, 
  maxImages = 5,
  onUpload 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check total count
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const file of acceptedFiles) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(`${file.name}: ${validation.error}`);
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);

      try {
        if (onUpload) {
          // Custom upload handler
          const uploadedImages = await onUpload(validFiles);
          onChange([...images, ...uploadedImages]);
          toast.success(`${validFiles.length} image(s) uploaded successfully!`);
        } else {
          // Local preview (for form, actual upload happens on save)
          const newImages: UploadedImage[] = await Promise.all(
            validFiles.map(async (file, index) => {
              const preview = await fileToBase64(file);
              return {
                url: preview,
                publicId: '',
                order: images.length + index,
                isFeatured: images.length === 0 && index === 0,
                file,
                preview,
              };
            })
          );
          onChange([...images, ...newImages]);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to process images');
      } finally {
        setIsUploading(false);
      }
    },
    [images, maxImages, onChange, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: maxImages - images.length,
    disabled: isUploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Re-index and ensure first image is featured if needed
    const reindexed = newImages.map((img, i) => ({
      ...img,
      order: i,
      isFeatured: i === 0 || img.isFeatured,
    }));
    onChange(reindexed);
  };

  const setFeaturedImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isFeatured: i === index,
    }));
    onChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    
    // Re-index
    const reindexed = newImages.map((img, i) => ({
      ...img,
      order: i,
    }));
    
    onChange(reindexed);
  };

  return (
    <div className="space-y-4">
      {/* Upload Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image Upload Guidelines:
        </p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• <strong>Format:</strong> JPEG, PNG, or WebP</li>
          <li>• <strong>Maximum Size:</strong> 5MB per image</li>
          <li>• <strong>Recommended Dimensions:</strong> 2000×2000 pixels (min 1200×1200)</li>
          <li>• <strong>Aspect Ratio:</strong> 1:1 (Square)</li>
          <li>• <strong>Quantity:</strong> 1-5 images per product</li>
          <li>• <strong>Note:</strong> First image will be the featured/main image</li>
        </ul>
      </div>

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all"
            >
              <Image
                src={image.preview || image.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Featured Badge */}
              {image.isFeatured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Main
                </div>
              )}

              {/* Order Badge */}
              <div className="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>

              {/* Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isFeatured && (
                  <button
                    onClick={() => setFeaturedImage(index)}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
                    title="Set as main image"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary hover:bg-secondary/50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          
          {isUploading ? (
            <div>
              <p className="text-lg font-medium mb-2">Uploading...</p>
              <div className="w-32 h-2 bg-secondary rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-primary animate-pulse" />
              </div>
            </div>
          ) : isDragActive ? (
            <p className="text-lg font-medium">Drop images here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                {images.length === 0
                  ? `Upload 1-${maxImages} images`
                  : `Upload ${maxImages - images.length} more image(s)`}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                JPEG, PNG, WebP • Max 5MB each
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {images.length} of {maxImages} images uploaded
        </span>
        {images.length >= 1 && (
          <span className="text-green-600 font-medium">
            ✓ Minimum requirement met
          </span>
        )}
      </div>
    </div>
  );
}

