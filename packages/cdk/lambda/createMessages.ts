import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { CreateMessagesRequest, ExtraData } from 'generative-ai-use-cases';
import {
  batchCreateMessages,
  findChatById,
  setChatUpdatedDate,
} from './repository';

const FILE_UPLOAD_BUCKET_NAME = process.env.BUCKET_NAME!;

const FILTER_OPERATORS = new Set([
  'equals',
  'notEquals',
  'greaterThan',
  'greaterThanOrEquals',
  'lessThan',
  'lessThanOrEquals',
  'in',
  'notIn',
  'startsWith',
  'listContains',
  'stringContains',
]);

const LOGICAL_FILTER_OPERATORS = new Set(['andAll', 'orAll']);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isScalarFilterValue = (value: unknown): boolean => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
};

const isFilterValue = (value: unknown): boolean => {
  if (isScalarFilterValue(value)) {
    return true;
  }

  return (
    Array.isArray(value) && value.length > 0 && value.every(isScalarFilterValue)
  );
};

const isFilterAttribute = (value: unknown): boolean => {
  return (
    isRecord(value) &&
    typeof value.key === 'string' &&
    value.key.length > 0 &&
    isFilterValue(value.value)
  );
};

const isRetrievalFilter = (value: unknown, depth = 0): boolean => {
  if (!isRecord(value) || depth > 5) return false;

  const entries = Object.entries(value);
  if (entries.length !== 1) return false;

  const [operator, filterValue] = entries[0];
  if (FILTER_OPERATORS.has(operator)) {
    return isFilterAttribute(filterValue);
  }

  if (LOGICAL_FILTER_OPERATORS.has(operator)) {
    return (
      Array.isArray(filterValue) &&
      filterValue.length > 0 &&
      filterValue.every((nestedFilter) =>
        isRetrievalFilter(nestedFilter, depth + 1)
      )
    );
  }

  return false;
};

const isValidFilterExtraData = (extra: ExtraData): boolean => {
  if (
    extra.type !== 'json' ||
    extra.name !== 'filter' ||
    extra.source.type !== 'json' ||
    extra.source.mediaType !== 'application/json'
  ) {
    return false;
  }

  try {
    return isRetrievalFilter(JSON.parse(extra.source.data));
  } catch {
    return false;
  }
};

const isValidExtraData = (extra: ExtraData, bucketName: string): boolean => {
  if (extra.source.type === 'json') {
    return isValidFilterExtraData(extra);
  }

  if (extra.source.type !== 's3') {
    return false;
  }

  return extra.source.data.startsWith(
    `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`
  );
};

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: CreateMessagesRequest = req.body;
    const userId: string = getUserId(req);
    const chatId = req.params.chatId;

    // Authorization check: Verify if the specified chat belongs to the user
    const chat = await findChatById(userId, chatId);
    if (chat === null) {
      res.status(403).json({
        message: 'You do not have permission to post messages in the chat.',
      });
      return;
    }

    if (input.messages) {
      for (const message of input.messages) {
        if (message.extraData && message.extraData.length > 0) {
          for (const extra of message.extraData) {
            if (!isValidExtraData(extra, FILE_UPLOAD_BUCKET_NAME)) {
              res.status(400).json({
                message: 'Invalid extraData',
              });
              return;
            }
          }
        }
      }
    }

    const messages = await batchCreateMessages(input.messages, userId, chatId);

    // The messages are already saved, so a failure here must not fail the
    // request; the chat just keeps its previous position in the history.
    try {
      await setChatUpdatedDate(chat.id, chat.createdDate);
    } catch (error) {
      console.log('Failed to update updatedDate', error);
    }

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
