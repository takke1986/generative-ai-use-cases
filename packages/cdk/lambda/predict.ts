import { Request, Response } from 'express';
import { PredictRequest } from 'generative-ai-use-cases';
import api from './utils/api';
import { defaultModel } from './utils/models';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: PredictRequest = req.body;
    const model = input.model || defaultModel;
    const response = await api[model.type].invoke?.(
      model,
      input.messages,
      input.id
    );

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
