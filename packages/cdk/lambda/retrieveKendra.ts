import { Request, Response } from 'express';
import {
  AttributeFilter,
  KendraClient,
  RetrieveCommand,
} from '@aws-sdk/client-kendra';
import { RetrieveKendraRequest } from 'generative-ai-use-cases';

const INDEX_ID = process.env.INDEX_ID;
const LANGUAGE = process.env.LANGUAGE;

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.body as RetrieveKendraRequest;
    const query = input.query;

    if (!query) {
      res.status(400).json({ error: 'query is not specified' });
      return;
    }

    // The default language is English, so language settings must be done.
    const attributeFilter: AttributeFilter = {
      AndAllFilters: [
        {
          EqualsTo: {
            Key: '_language_code',
            Value: {
              StringValue: LANGUAGE,
            },
          },
        },
      ],
    };

    const kendra = new KendraClient({});
    const retrieveCommand = new RetrieveCommand({
      IndexId: INDEX_ID,
      QueryText: query,
      AttributeFilter: attributeFilter,
    });

    const retrieveRes = await kendra.send(retrieveCommand);

    res.status(200).json(retrieveRes);
  } catch (error) {
    // The same response the API's error fallback sent before
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
