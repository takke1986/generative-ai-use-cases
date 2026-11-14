import { Router } from 'express';
import { handler as createChatHandler } from '../../createChat';
import { handler as listChatsHandler } from '../../listChats';
import { handler as findChatByIdHandler } from '../../findChatById';
import { handler as deleteChatHandler } from '../../deleteChat';
import { handler as updateTitleHandler } from '../../updateTitle';
import { handler as listMessagesHandler } from '../../listMessages';
import { handler as createMessagesHandler } from '../../createMessages';
import { handler as updateFeedbackHandler } from '../../updateFeedback';

export const router = Router();

router.post('/', createChatHandler);
router.get('/', listChatsHandler);
router.get('/:chatId', findChatByIdHandler);
router.delete('/:chatId', deleteChatHandler);
router.put('/:chatId/title', updateTitleHandler);
router.get('/:chatId/messages', listMessagesHandler);
router.post('/:chatId/messages', createMessagesHandler);
router.post('/:chatId/feedbacks', updateFeedbackHandler);
