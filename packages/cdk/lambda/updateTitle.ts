import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { UpdateTitleRequest } from 'generative-ai-use-cases';
import { findChatById, setChatTitle } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const chatId = req.params.chatId;
    const input: UpdateTitleRequest = req.body;

    const chatItem = await findChatById(userId, chatId);

    if (!chatItem) {
      res.status(404).send();
      return;
    }

    const updatedChat = await setChatTitle(
      chatItem?.id,
      chatItem?.createdDate,
      input.title,
      input.usecase
    );

    res.status(200).json({ chat: updatedChat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
