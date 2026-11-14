import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { createChat } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const chat = await createChat(userId);

    res.status(200).json({
      chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
