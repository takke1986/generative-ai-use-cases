import { Request, Response } from 'express';
import { findUserIdAndChatId, findChatById, listMessages } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const shareId = req.params.shareId;
    const result = await findUserIdAndChatId(shareId);

    if (result === null) {
      res.status(404).send();
      return;
    }

    const userId = result.userId;
    const chatId = result.chatId;

    const chat = await findChatById(
      // SAML authentication includes # in userId
      // Example: user#EntraID_hogehoge.com#EXT#@hogehoge.onmicrosoft.com
      userId.split('#').slice(1).join('#'),
      chatId.split('#')[1]
    );
    const messages = await listMessages(chatId.split('#')[1]);

    res.status(200).json({
      chat,
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
