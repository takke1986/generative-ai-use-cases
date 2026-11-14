import { Router, Request, Response } from 'express';
import {
  QueryKendraRequest,
  RetrieveKendraRequest,
} from 'generative-ai-use-cases';
import { queryKendra } from '../../queryKendra';
import { retrieveKendra } from '../../retrieveKendra';

export const router = Router();

router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query }: QueryKendraRequest = req.body;
    if (!query) {
      res.status(400).json({ error: 'query is not specified' });
      return;
    }
    res.status(200).json(await queryKendra(query));
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/retrieve', async (req: Request, res: Response) => {
  try {
    const { query }: RetrieveKendraRequest = req.body;
    if (!query) {
      res.status(400).json({ error: 'query is not specified' });
      return;
    }
    res.status(200).json(await retrieveKendra(query));
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
