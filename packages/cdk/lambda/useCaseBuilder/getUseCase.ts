import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { getUseCase } from './useCaseBuilderRepository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const useCaseId = req.params.useCaseId;

    const useCase = await getUseCase(userId, useCaseId);

    if (!useCase) {
      res.status(404).json({ message: 'Use case not found' });
      return;
    }

    res.status(200).json(useCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
