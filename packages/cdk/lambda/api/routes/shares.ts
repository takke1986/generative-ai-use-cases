import { Router, Request, Response } from 'express';
import {
  createShareId,
  deleteShareId,
  findChatById,
  findShareId,
} from '../../repository';
import { getSharedChat } from '../../getSharedChat';
import { getUserId } from '../user';

export const router = Router();

router.get('/chat/:chatId', async (req: Request, res: Response) => {
  try {
    const shareId = await findShareId(getUserId(req), req.params.chatId);
    if (shareId === null) {
      res.status(204).send();
      return;
    }
    res.status(200).json(shareId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/chat/:chatId', async (req: Request, res: Response) => {
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

    const shared = await createShareId(userId, chatId);
    res.status(200).json(shared);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/share/:shareId', async (req: Request, res: Response) => {
  try {
    const sharedChat = await getSharedChat(req.params.shareId);
    if (sharedChat === null) {
      res.status(404).send();
      return;
    }
    res.status(200).json(sharedChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/share/:shareId', async (req: Request, res: Response) => {
  try {
    await deleteShareId(req.params.shareId);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
