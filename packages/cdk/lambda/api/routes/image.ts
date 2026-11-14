import { Router, Request, Response } from 'express';
import { GenerateImageRequest } from 'generative-ai-use-cases';
import { generateImage } from '../../generateImage';

export const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const input: GenerateImageRequest = req.body;
    const image = await generateImage(input);
    res.status(200).type('json').send(image);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
});
