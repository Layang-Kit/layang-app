import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Create S3 client for Cloudflare R2
function createR2Client(): S3Client | null {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.warn('R2 credentials not configured');
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

// Generate presigned URL for direct upload
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300 // 5 minutes
): Promise<{ url: string; publicUrl: string } | null> {
  const client = createR2Client();
  if (!client || !R2_BUCKET_NAME) return null;

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(client, command, { expiresIn });
    
    const publicUrl = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${key}`
      : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

    return { url: presignedUrl, publicUrl };
  } catch (err) {
    console.error('Failed to generate presigned URL:', err);
    return null;
  }
}

// Upload file directly via server
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType: string
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  const client = createR2Client();
  if (!client || !R2_BUCKET_NAME) {
    return { success: false, error: 'R2 not configured' };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await client.send(command);

    const publicUrl = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${key}`
      : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

    return { success: true, publicUrl };
  } catch (err: any) {
    console.error('Failed to upload file:', err);
    return { success: false, error: err.message };
  }
}

// Delete file from R2
export async function deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
  const client = createR2Client();
  if (!client || !R2_BUCKET_NAME) {
    return { success: false, error: 'R2 not configured' };
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete file:', err);
    return { success: false, error: err.message };
  }
}

// Check if R2 is configured
export function isR2Configured(): boolean {
  return !!(
    R2_ACCOUNT_ID &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_BUCKET_NAME
  );
}

// Generate unique file key
export function generateFileKey(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '-');
  return `${prefix}/${timestamp}-${random}-${sanitizedFilename}`;
}
