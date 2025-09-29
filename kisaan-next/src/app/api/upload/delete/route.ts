import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

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
      return NextResponse.json(
        { error: 'S3 bucket not configured' },
        { status: 500 }
      );
    }

    // Extract key from URL
    // URL format: https://bucket-name.s3.region.amazonaws.com/products/uuid.ext
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    if (!key) {
      return NextResponse.json(
        { error: 'Invalid image URL' },
        { status: 400 }
      );
    }

    // Delete object from S3
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }).promise();

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}