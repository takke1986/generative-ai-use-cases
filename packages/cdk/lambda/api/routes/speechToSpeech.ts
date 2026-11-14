import { Router } from 'express';
import { handler as startSpeechToSpeechSessionHandler } from '../../startSpeechToSpeechSession';

export const router = Router();

router.post('/', startSpeechToSpeechSessionHandler);
