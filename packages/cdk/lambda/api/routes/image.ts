import { Router } from 'express';
import { handler as generateImageHandler } from '../../generateImage';

export const router = Router();

router.post('/generate', generateImageHandler);
