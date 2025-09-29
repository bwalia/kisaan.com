import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
const UPLOAD_EXPIRY_SECONDS = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, folder = 'products' } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    if (!BUCKET_NAME) {
      return NextResponse.json(
        { error: 'S3 bucket not configured' },
        { status: 500 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Generate unique key
    const fileExtension = fileName.split('.').pop() || '';
    const key = `${folder}/${uuidv4()}.${fileExtension}`;

    // Generate presigned URL
    const presignedUrl = s3.getSignedUrl('putObject', {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: UPLOAD_EXPIRY_SECONDS,
      ACL: 'public-read', // Make uploaded images publicly accessible
    });

    // Generate the public URL that will be available after upload
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    return NextResponse.json({
      uploadUrl: presignedUrl,
      publicUrl: publicUrl,
      key: key,
    });

  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}