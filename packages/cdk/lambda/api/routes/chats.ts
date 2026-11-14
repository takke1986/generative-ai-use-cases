import { Router, Request, Response } from 'express';
import {
  CreateMessagesRequest,
  UpdateFeedbackRequest,
  UpdateTitleRequest,
} from 'generative-ai-use-cases';
import {
  createChat,
  deleteChat,
  deleteShareId,
  findChatById,
  findShareId,
  listChats,
  listMessages,
  setChatTitle,
  updateFeedback,
} from '../../repository';
import { createMessages, hasValidExtraData } from '../../createMessages';
import { getUserId } from '../user';

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const chat = await createChat(getUserId(req));
    res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const exclusiveStartKey = req.query.exclusiveStartKey as string | undefined;
    const chats = await listChats(getUserId(req), exclusiveStartKey);
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:chatId', async (req: Request, res: Response) => {
  try {
    const chat = await findChatById(getUserId(req), req.params.chatId);
    res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:chatId', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const chatId = req.params.chatId;
    await deleteChat(userId, chatId);

    // Stop sharing the chat as well
    const shareId = await findShareId(userId, chatId);
    if (shareId) {
      await deleteShareId(shareId.shareId.split('#')[1]);
    }

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:chatId/title', async (req: Request, res: Response) => {
  try {
    const input: UpdateTitleRequest = req.body;
    const chat = await findChatById(getUserId(req), req.params.chatId);
    if (!chat) {
      res.status(404).send();
      return;
    }

    const updatedChat = await setChatTitle(
      chat.id,
      chat.createdDate,
      input.title,
      input.usecase
    );
    res.status(200).json({ chat: updatedChat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:chatId/messages', async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    // Authorization check: Verify if the specified chat belongs to the user
    const chat = await findChatById(getUserId(req), chatId);
    if (chat === null) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const messages = await listMessages(chatId);
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/:chatId/messages', async (req: Request, res: Response) => {
  try {
    const input: CreateMessagesRequest = req.body;
    const userId = getUserId(req);
    const chatId = req.params.chatId;

    // Authorization check: Verify if the specified chat belongs to the user
    const chat = await findChatById(userId, chatId);
    if (chat === null) {
      res.status(403).json({
        message: 'You do not have permission to post messages in the chat.',
      });
      return;
    }

    if (input.messages && !hasValidExtraData(input.messages)) {
      res.status(400).json({ message: 'Invalid extraData' });
      return;
    }

    const messages = await createMessages(userId, chat, chatId, input.messages);
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/:chatId/feedbacks', async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const input: UpdateFeedbackRequest = req.body;
    const userId = getUserId(req);

    // Authorization check: verify that this message belongs to the user's chat
    const messages = await listMessages(chatId);
    const targetMessage = messages.find(
      (m) => m.createdDate === input.createdDate
    );
    if (!targetMessage || targetMessage.userId !== `user#${userId}`) {
      console.warn(
        `Authorization error: User ${userId} attempted to provide feedback on message ${input.createdDate} in chat ${chatId} belonging to another user`
      );
      res.status(403).json({
        message:
          'You do not have permission to provide feedback on this message.',
      });
      return;
    }

    const message = await updateFeedback(chatId, input);
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
