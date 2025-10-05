import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client with AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
  // For MinIO or S3-compatible storage
  ...(process.env.S3_ENDPOINT && {
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  }),
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.NEXT_PUBLIC_S3_BUCKET || '';

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      );
    }

    if (!BUCKET_NAME) {
      console.error('S3_BUCKET_NAME environment variable is not set');
      return NextResponse.json(
        { error: 'S3 bucket not configured' },
        { status: 500 }
      );
    }

    // Extract key from URL
    let key: string;

    try {
      const url = new URL(imageUrl);

      // Handle different URL formats
      if (process.env.S3_ENDPOINT && imageUrl.includes(process.env.S3_ENDPOINT)) {
        // MinIO format: http://localhost:9000/bucket-name/products/file.jpg
        const pathParts = url.pathname.split('/').filter(Boolean);
        // Remove bucket name from path
        key = pathParts.slice(1).join('/');
      } else {
        // AWS S3 format: https://bucket.s3.region.amazonaws.com/products/file.jpg
        key = url.pathname.substring(1); // Remove leading slash
      }

      if (!key) {
        throw new Error('Could not extract key from URL');
      }
    } catch (error) {
      console.error('Failed to parse image URL:', error);
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }

    // Delete object from S3
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    console.log('✅ Image deleted successfully:', key);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      key: key,
    });

  } catch (error) {
    console.error('❌ Image deletion error:', error);

    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to delete image',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
