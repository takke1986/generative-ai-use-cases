import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { deleteChat, deleteShareId, findShareId } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const chatId = req.params.chatId;
    await deleteChat(userId, chatId);

    const shareId = await findShareId(userId, chatId);

    if (shareId) {
      await deleteShareId(shareId.shareId.split('#')[1]);
    }

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
