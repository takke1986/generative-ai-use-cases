import { Router } from 'express';
import { handler as getWebTextHandler } from '../../getWebText';

export const router = Router();

router.get('/', getWebTextHandler);
