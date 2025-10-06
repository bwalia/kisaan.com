// Professional S3 Image Upload Utility
import { v4 as uuidv4 } from 'uuid';

interface S3UploadConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class S3ImageUploader {
  private config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    this.config = config;
  }

  /**
   * Generate presigned URL for direct upload
   */
  async getPresignedUrl(fileName: string, fileType: string): Promise<UploadResult> {
    try {
      const response = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          fileType,
          folder: 'products', // Organize images in folders
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const data = await response.json();
      return {
        success: true,
        url: data.uploadUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload file directly to S3 using presigned URL
   */
  async uploadFile(file: File, presignedUrl: string): Promise<UploadResult> {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error('Upload to S3 failed');
      }

      // Extract the public URL (remove query parameters)
      const publicUrl = presignedUrl.split('?')[0];

      return {
        success: true,
        url: publicUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Complete upload process: get presigned URL and upload file
   */
  async upload(file: File): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Get presigned URL
    const presignedResult = await this.getPresignedUrl(uniqueFileName, file.type);
    if (!presignedResult.success || !presignedResult.url) {
      return presignedResult;
    }

    // Upload file
    return await this.uploadFile(file, presignedResult.url);
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB',
      };
    }

    return { valid: true };
  }

  /**
   * Delete image from S3
   */
  async deleteImage(imageUrl: string): Promise<UploadResult> {
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }
}

// Default S3 configuration
const defaultConfig: S3UploadConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  bucket: process.env.NEXT_PUBLIC_S3_BUCKET || '',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
};

// Export singleton instance
export const s3Uploader = new S3ImageUploader(defaultConfig);
export default S3ImageUploader;