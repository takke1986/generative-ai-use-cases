import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { findChatById } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const chatId = req.params.chatId;
    const chat = await findChatById(userId, chatId);

    res.status(200).json({
      chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
