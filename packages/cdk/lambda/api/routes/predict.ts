import { Router } from 'express';
import { handler as predictHandler } from '../../predict';
import { handler as predictTitleHandler } from '../../predictTitle';

export const router = Router();

router.post('/', predictHandler);
router.post('/title', predictTitleHandler);
