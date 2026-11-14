import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { findChatById, listMessages } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const chatId = req.params.chatId;
    const chat = await findChatById(userId, chatId);

    if (chat === null) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const messages = await listMessages(chatId);

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
