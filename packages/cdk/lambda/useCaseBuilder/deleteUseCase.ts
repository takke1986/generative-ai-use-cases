import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { deleteUseCase } from './useCaseBuilderRepository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const useCaseId = req.params.useCaseId;

    await deleteUseCase(userId, useCaseId);

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
