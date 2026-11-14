import { Router } from 'express';
import { handler as startTranscriptionHandler } from '../../startTranscription';
import { handler as getTranscriptionHandler } from '../../getTranscription';
import { handler as getSignedUrlHandler } from '../../getFileUploadSignedUrl';

export const router = Router();

router.post('/start', startTranscriptionHandler);
router.post('/url', getSignedUrlHandler);
router.get('/result/:jobName', getTranscriptionHandler);
