import { Request, Response } from 'express';
import { RetrieveCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { RetrieveKnowledgeBaseRequest } from 'generative-ai-use-cases';
import { initBedrockAgentRuntimeClient } from './utils/bedrockClient';

const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID;
const MODEL_REGION = process.env.MODEL_REGION as string;

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.body as RetrieveKnowledgeBaseRequest;
    const query = input.query;

    if (!query) {
      res.status(400).json({ error: 'query is not specified' });
      return;
    }

    const client = await initBedrockAgentRuntimeClient({
      region: MODEL_REGION,
    });
    const retrieveCommand = new RetrieveCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      retrievalQuery: { text: query },
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: 10,
          overrideSearchType: 'HYBRID',
        },
      },
    });
    const retrieveRes = await client.send(retrieveCommand);

    res.status(200).json(retrieveRes);
  } catch (error) {
    // The same response the API's error fallback sent before
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
