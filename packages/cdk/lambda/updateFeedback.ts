import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { UpdateFeedbackRequest } from 'generative-ai-use-cases';
import { listMessages, updateFeedback } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const chatId = req.params.chatId;
    const input: UpdateFeedbackRequest = req.body;
    const userId: string = getUserId(req);

    // Authorization check: verify that this message belongs to the user's chat
    const messages = await listMessages(chatId);

    // Find a message that matches the createdDate (message ID) in the request
    const targetMessage = messages.find(
      (m) => m.createdDate === input.createdDate
    );

    // Return 403 if the message doesn't exist or doesn't belong to the user
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
};
