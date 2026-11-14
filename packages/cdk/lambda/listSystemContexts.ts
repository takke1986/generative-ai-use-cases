import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { listSystemContexts } from './repository';
import { SystemContext } from 'generative-ai-use-cases';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const systemContextItems: SystemContext[] =
      await listSystemContexts(userId);

    res.status(200).json(systemContextItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
