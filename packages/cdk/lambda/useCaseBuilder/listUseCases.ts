import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { listUseCases } from './useCaseBuilderRepository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const exclusiveStartKey = req.query.exclusiveStartKey as string | undefined;
    const result = await listUseCases(userId, exclusiveStartKey);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
