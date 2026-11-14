import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetFileUploadSignedUrlRequest } from 'generative-ai-use-cases';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: GetFileUploadSignedUrlRequest = req.body;
    const filename = input.filename;
    const uuid = uuidv4();

    const client = new S3Client({});
    // The upload destination is XXXXX/image.png format. The file can be downloaded with the correct file name when downloaded.
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${uuid}/${filename}`,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    res.status(200).type('json').send(signedUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
