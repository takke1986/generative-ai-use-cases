import { RetrieveCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { initBedrockAgentRuntimeClient } from './utils/bedrockClient';

const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID;
const MODEL_REGION = process.env.MODEL_REGION as string;

// Retrieves passages from the Knowledge Base for the query.
export const retrieveKnowledgeBase = async (query: string) => {
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

  return retrieveRes;
};
