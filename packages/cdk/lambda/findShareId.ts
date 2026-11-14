import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { findShareId } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const chatId = req.params.chatId;
    const result = await findShareId(userId, chatId);

    if (result === null) {
      res.status(204).send();
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
