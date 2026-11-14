import { Request, Response } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetFileDownloadSignedUrlRequest } from 'generative-ai-use-cases';
import { initKnowledgeBaseS3Client } from './utils/bedrockClient';

const MODEL_REGION = process.env.MODEL_REGION as string;

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.query as unknown as GetFileDownloadSignedUrlRequest;

    // We pass `s3Type` parameter since Knowledge Base may need to reference S3 in a different account
    // default and agentcore currently reside in same account and region is specifed in request
    const client =
      input.s3Type === 'knowledgeBase'
        ? await initKnowledgeBaseS3Client({
            region: input.region ?? MODEL_REGION,
          })
        : new S3Client({ region: input.region });
    const command = new GetObjectCommand({
      Bucket: input.bucketName,
      Key: input.filePrefix,
      ResponseContentType: input.contentType,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

    res.status(200).type('json').send(signedUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
