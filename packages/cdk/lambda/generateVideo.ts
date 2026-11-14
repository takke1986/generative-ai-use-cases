import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { GenerateVideoRequest } from 'generative-ai-use-cases';
import api from './utils/api';
import { defaultVideoGenerationModel } from './utils/models';
import { createJob } from './repositoryVideoJob';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const input: GenerateVideoRequest = req.body;
    const model = input.model || defaultVideoGenerationModel;
    const invocationArn = await api[model.type].generateVideo(
      model,
      input.params
    );

    const result = await createJob(userId, invocationArn, input);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
