import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { toggleShared } from './useCaseBuilderRepository';
import { IsShared } from 'generative-ai-use-cases';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const useCaseId = req.params.useCaseId;

    const isShared: IsShared = await toggleShared(userId, useCaseId);

    res.status(200).json(isShared);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
