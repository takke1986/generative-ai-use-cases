import { findUserIdAndChatId, findChatById, listMessages } from './repository';

// Returns the shared chat and its messages, or null when the share ID does
// not exist.
export const getSharedChat = async (shareId: string) => {
  const ids = await findUserIdAndChatId(shareId);
  if (ids === null) {
    return null;
  }

  const chat = await findChatById(
    // SAML authentication includes # in userId
    // Example: user#EntraID_hogehoge.com#EXT#@hogehoge.onmicrosoft.com
    ids.userId.split('#').slice(1).join('#'),
    ids.chatId.split('#')[1]
  );
  const messages = await listMessages(ids.chatId.split('#')[1]);

  return { chat, messages };
};
