import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Deletes an uploaded file from the upload bucket.
export const deleteFile = async (fileName: string): Promise<void> => {
  const client = new S3Client({});
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  });

  await client.send(command);
};
