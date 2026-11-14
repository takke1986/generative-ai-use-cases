import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetFileDownloadSignedUrlRequest } from 'generative-ai-use-cases';
import { initKnowledgeBaseS3Client } from './utils/bedrockClient';

const MODEL_REGION = process.env.MODEL_REGION as string;

// Returns a URL that downloads the file for 60 seconds.
export const getFileDownloadSignedUrl = async (
  input: GetFileDownloadSignedUrlRequest
): Promise<string> => {
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

  return getSignedUrl(client, command, { expiresIn: 60 });
};
