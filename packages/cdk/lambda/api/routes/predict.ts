import { Router, Request, Response } from 'express';
import { PredictRequest, PredictTitleRequest } from 'generative-ai-use-cases';
import { predict } from '../../predict';
import { predictTitle } from '../../predictTitle';

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const input: PredictRequest = req.body;
    res.status(200).json(await predict(input));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/title', async (req: Request, res: Response) => {
  try {
    const input: PredictTitleRequest = req.body;
    const title = await predictTitle(input);
    res.status(200).type('json').send(title);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
