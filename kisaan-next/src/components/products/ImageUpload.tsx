"use client";
import { useState, useRef } from "react";
import { s3Uploader } from "@/lib/s3-upload";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

type UploadMethod = 'file' | 'url';

export default function ImageUpload({
  images = [],
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    const newImages: string[] = [];

    for (let i = 0; i < files.length && (images.length + newImages.length) < maxImages; i++) {
      const file = files[i];
      const progressKey = `${file.name}-${Date.now()}`;

      try {
        // Set initial progress
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

        // Upload to S3
        const result = await s3Uploader.upload(file);

        if (result.success && result.url) {
          newImages.push(result.url);
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
        } else {
          alert(`Failed to upload ${file.name}: ${result.error}`);
        }
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        alert(`Failed to upload ${file.name}`);
      } finally {
        // Remove progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[progressKey];
            return updated;
          });
        }, 1000);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlAdd = () => {
    setUrlError("");

    if (!urlInput.trim()) {
      setUrlError("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(urlInput.trim());
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
    } catch {
      setUrlError("Please enter a valid URL");
      return;
    }

    // Check if already exists
    if (images.includes(urlInput.trim())) {
      setUrlError("This image URL is already added");
      return;
    }

    if (images.length >= maxImages) {
      setUrlError(`Maximum ${maxImages} images allowed`);
      return;
    }

    onImagesChange([...images, urlInput.trim()]);
    setUrlInput("");
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // If it's an S3 image, attempt to delete it
    if (imageUrl.includes('amazonaws.com')) {
      try {
        await s3Uploader.deleteImage(imageUrl);
      } catch (error) {
        console.warn('Failed to delete image from S3:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const progressEntries = Object.entries(uploadProgress);
  const hasUploadsInProgress = progressEntries.length > 0;

  return (
    <div className="space-y-4">
      {/* Method Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Upload Method:</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setUploadMethod('file')}
            className={`px-3 py-2 text-sm rounded-md border ${
              uploadMethod === 'file'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={disabled}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('url')}
            className={`px-3 py-2 text-sm rounded-md border ${
              uploadMethod === 'url'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={disabled}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Image URL
          </button>
        </div>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              disabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled}
            />

            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                </svg>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                {' '}or drag and drop
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP up to 5MB ({maxImages - images.length} remaining)
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {hasUploadsInProgress && (
            <div className="space-y-2">
              {progressEntries.map(([key, progress]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading {key.split('-')[0]}...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* URL Upload */}
      {uploadMethod === 'url' && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`flex-1 input ${urlError ? 'border-red-300' : ''}`}
              disabled={disabled || images.length >= maxImages}
            />
            <button
              type="button"
              onClick={handleUrlAdd}
              disabled={disabled || images.length >= maxImages || !urlInput.trim()}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          {urlError && (
            <p className="text-sm text-red-600">{urlError}</p>
          )}
        </div>
      )}

      {/* Current Images */}
      {images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Images ({images.length}/{maxImages})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png'; // Add a placeholder image
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  disabled={disabled}
                >
                  ×
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}