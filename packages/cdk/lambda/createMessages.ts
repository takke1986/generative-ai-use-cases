import { Chat, ExtraData, ToBeRecordedMessage } from 'generative-ai-use-cases';
import { batchCreateMessages, setChatUpdatedDate } from './repository';

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

// Whether every attachment of the messages is one this app accepts
export const hasValidExtraData = (messages: ToBeRecordedMessage[]): boolean =>
  messages.every((message) =>
    (message.extraData ?? []).every((extra) =>
      isValidExtraData(extra, FILE_UPLOAD_BUCKET_NAME)
    )
  );

// Saves the messages to the user's chat and moves the chat to the top of the
// history. Returns the saved messages.
export const createMessages = async (
  userId: string,
  chat: Chat,
  chatId: string,
  messages: ToBeRecordedMessage[]
) => {
  const saved = await batchCreateMessages(messages, userId, chatId);

  // The messages are already saved, so a failure here must not fail the
  // request; the chat just keeps its previous position in the history.
  try {
    await setChatUpdatedDate(chat.id, chat.createdDate);
  } catch (error) {
    console.log('Failed to update updatedDate', error);
  }

  return saved;
};
