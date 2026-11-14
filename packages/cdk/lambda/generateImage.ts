import { Request, Response } from 'express';
import { GenerateImageRequest } from 'generative-ai-use-cases';
import api from './utils/api';
import { defaultImageGenerationModel } from './utils/models';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: GenerateImageRequest = req.body;
    const model = input.model || defaultImageGenerationModel;
    const result = await api[model.type].generateImage(model, input.params);

    res.status(200).type('json').send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
