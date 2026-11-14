import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { CreateUseCaseRequest } from 'generative-ai-use-cases';
import { createUseCase } from './useCaseBuilderRepository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: CreateUseCaseRequest = req.body;
    const userId: string = getUserId(req);
    const useCase = await createUseCase(userId, input);

    res.status(200).json(useCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
