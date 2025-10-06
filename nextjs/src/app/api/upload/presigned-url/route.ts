import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

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
    forcePathStyle: true, // Required for MinIO
  }),
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.NEXT_PUBLIC_S3_BUCKET || '';
const UPLOAD_EXPIRY_SECONDS = 300; // 5 minutes
const CDN_DOMAIN = process.env.CDN_DOMAIN || ''; // Optional: CloudFront domain

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { fileName, fileType, folder = 'products' } = body;

    // Validation
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    if (!BUCKET_NAME) {
      console.error('S3_BUCKET_NAME environment variable is not set');
      return NextResponse.json(
        { error: 'S3 bucket not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(fileType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique key with proper organization
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const key = `${folder}/${timestamp}-${uniqueId}.${fileExtension}`;

    // Create put object command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      // For public buckets:
      // ACL: 'public-read',
      // Or use bucket policies for public access
    });

    // Generate presigned URL using AWS SDK v3
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: UPLOAD_EXPIRY_SECONDS,
    });

    // Generate the public URL that will be available after upload
    let publicUrl: string;

    if (CDN_DOMAIN) {
      // Use CDN domain if configured
      publicUrl = `https://${CDN_DOMAIN}/${key}`;
    } else if (process.env.S3_ENDPOINT) {
      // MinIO or custom S3 endpoint
      const endpoint = process.env.S3_ENDPOINT.replace(/^https?:\/\//, '');
      publicUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
    } else {
      // Standard AWS S3
      const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
      publicUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
    }

    console.log('✅ Presigned URL generated successfully:', {
      key,
      bucket: BUCKET_NAME,
      expiresIn: UPLOAD_EXPIRY_SECONDS,
    });

    return NextResponse.json({
      success: true,
      uploadUrl: presignedUrl,
      publicUrl: publicUrl,
      key: key,
      expiresIn: UPLOAD_EXPIRY_SECONDS,
    });

  } catch (error) {
    console.error('❌ Presigned URL generation error:', error);

    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to generate presigned URL. Please try again.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
