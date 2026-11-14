import { Router } from 'express';
import { handler as queryKendraHandler } from '../../queryKendra';
import { handler as retrieveKendraHandler } from '../../retrieveKendra';

export const router = Router();

router.post('/query', queryKendraHandler);
router.post('/retrieve', retrieveKendraHandler);
