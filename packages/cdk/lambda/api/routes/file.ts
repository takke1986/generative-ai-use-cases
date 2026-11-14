import { Router } from 'express';
import { handler as getSignedUrlHandler } from '../../getFileUploadSignedUrl';
import { handler as getFileDownloadSignedUrlHandler } from '../../getFileDownloadSignedUrl';
import { handler as deleteFileHandler } from '../../deleteFile';

export const router = Router();

router.post('/url', getSignedUrlHandler);
router.get('/url', getFileDownloadSignedUrlHandler);
router.delete('/:fileName', deleteFileHandler);
