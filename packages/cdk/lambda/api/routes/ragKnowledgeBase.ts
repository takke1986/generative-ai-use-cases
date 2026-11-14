import { Router, Request, Response } from 'express';
import { RetrieveKnowledgeBaseRequest } from 'generative-ai-use-cases';
import { retrieveKnowledgeBase } from '../../retrieveKnowledgeBase';

export const router = Router();

router.post('/retrieve', async (req: Request, res: Response) => {
  try {
    const { query }: RetrieveKnowledgeBaseRequest = req.body;
    if (!query) {
      res.status(400).json({ error: 'query is not specified' });
      return;
    }
    res.status(200).json(await retrieveKnowledgeBase(query));
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
