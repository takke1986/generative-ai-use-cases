import { Router } from 'express';
import { handler as createSystemContextHandler } from '../../createSystemContext';
import { handler as listSystemContextsHandler } from '../../listSystemContexts';
import { handler as deleteSystemContextHandler } from '../../deleteSystemContext';
import { handler as updateSystemContextTitleHandler } from '../../updateSystemContextTitle';

export const router = Router();

router.post('/', createSystemContextHandler);
router.get('/', listSystemContextsHandler);
router.delete('/:systemContextId', deleteSystemContextHandler);
router.put('/:systemContextId/title', updateSystemContextTitleHandler);
