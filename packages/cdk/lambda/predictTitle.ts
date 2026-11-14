import {
  PredictTitleRequest,
  UnrecordedMessage,
} from 'generative-ai-use-cases';
import { setChatTitle } from './repository';
import api from './utils/api';
import { defaultModel } from './utils/models';

// Generates a title for the chat with the default model, saves it, and
// returns it.
export const predictTitle = async (
  input: PredictTitleRequest
): Promise<string> => {
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

  return title;
};
