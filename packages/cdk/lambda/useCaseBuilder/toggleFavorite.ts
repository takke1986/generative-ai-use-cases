import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { IsFavorite } from 'generative-ai-use-cases';
import { toggleFavorite } from './useCaseBuilderRepository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const useCaseId = req.params.useCaseId;

    const isFavorite: IsFavorite = await toggleFavorite(userId, useCaseId);

    res.status(200).json(isFavorite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
