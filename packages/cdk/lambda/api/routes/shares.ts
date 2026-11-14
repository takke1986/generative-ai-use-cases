import { Router } from 'express';
import { handler as findShareIdHandler } from '../../findShareId';
import { handler as createShareIdHandler } from '../../createShareId';
import { handler as getSharedChatHandler } from '../../getSharedChat';
import { handler as deleteShareIdHandler } from '../../deleteShareId';

export const router = Router();

router.get('/chat/:chatId', findShareIdHandler);
router.post('/chat/:chatId', createShareIdHandler);
router.get('/share/:shareId', getSharedChatHandler);
router.delete('/share/:shareId', deleteShareIdHandler);
