import { Router } from 'express';
import { handler as getTokenUsageHandler } from '../../getTokenUsage';

export const router = Router();

router.get('/', getTokenUsageHandler);
