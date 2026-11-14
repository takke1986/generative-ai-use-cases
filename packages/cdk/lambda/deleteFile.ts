import { Request, Response } from 'express';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DeleteFileRequest } from 'generative-ai-use-cases';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.params as DeleteFileRequest;

    const client = new S3Client({});
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: input.fileName,
    });

    await client.send(command);

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
