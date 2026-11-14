import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { createShareId, findChatById } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const chatId = req.params.chatId;

    // Authorization check: Verify if the specified chat belongs to the user
    const chat = await findChatById(userId, chatId);
    if (chat === null) {
      res.status(403).json({
        message: 'You do not have permission to share this chat.',
      });
      return;
    }

    const result = await createShareId(userId, chatId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
