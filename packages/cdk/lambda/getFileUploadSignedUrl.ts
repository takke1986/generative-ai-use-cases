import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Returns a URL that uploads a file with this name for an hour.
export const getFileUploadSignedUrl = async (
  filename: string | undefined
): Promise<string> => {
  const client = new S3Client({});
  // The upload destination is XXXXX/image.png format. The file can be downloaded with the correct file name when downloaded.
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuidv4()}/${filename}`,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};
