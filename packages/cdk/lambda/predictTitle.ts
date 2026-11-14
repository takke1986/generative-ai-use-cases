import { Request, Response } from 'express';
import {
  PredictTitleRequest,
  UnrecordedMessage,
} from 'generative-ai-use-cases';
import { setChatTitle } from './repository';
import api from './utils/api';
import { defaultModel } from './utils/models';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      throw new Error('Request body is missing');
    }

    const input = req.body as PredictTitleRequest;

    console.log(
      'predictTitle request:',
      JSON.stringify({
        hasPrompt: !!input.prompt,
        chatId: input.chat?.chatId,
        chatPK: input.chat?.id,
        createdDate: input.chat?.createdDate,
        usecase: input.chat?.usecase,
        id: input.id,
      })
    );

    // Validation
    if (
      !input.prompt ||
      !input.chat?.id ||
      !input.chat?.createdDate ||
      !input.id
    ) {
      throw new Error('Invalid request format');
    }

    // Use the lightweight default model for title generation
    const model = defaultModel;

    // Add a question for title setting
    const messages: UnrecordedMessage[] = [
      {
        role: 'user',
        content: input.prompt,
      },
    ];

    // When adding a new model, the default Claude prompter is used, so the output may be enclosed in <output></output>
    // Some reasoning models (e.g. Opus 4.5) may also output <thinking>...</thinking> before the actual title.
    // Extract specifically from <output> tags if present, otherwise strip all XML tags.
    const rawTitle =
      (await api['bedrock'].invoke?.(model, messages, input.id)) ?? '';
    const outputMatch = rawTitle.match(/<output>([\s\S]*?)<\/output>/);
    const title = outputMatch
      ? outputMatch[1].trim()
      : rawTitle.replace(/<([^>]+)>[\s\S]*?<\/\1>/g, '').trim();

    await setChatTitle(
      input.chat.id,
      input.chat.createdDate,
      title,
      input.chat.usecase
    );

    res.status(200).type('json').send(title);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
