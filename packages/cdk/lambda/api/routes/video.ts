import { Router } from 'express';
import { handler as generateVideoHandler } from '../../generateVideo';
import { handler as listVideoJobsHandler } from '../../listVideoJobs';
import { handler as deleteVideoJobHandler } from '../../deleteVideoJob';

export const router = Router();

router.post('/generate', generateVideoHandler);
router.get('/generate', listVideoJobsHandler);
router.delete('/generate/:createdDate', deleteVideoJobHandler);
