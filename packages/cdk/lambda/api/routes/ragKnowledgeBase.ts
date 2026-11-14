import { Router } from 'express';
import { handler as retrieveKnowledgeBaseHandler } from '../../retrieveKnowledgeBase';

export const router = Router();

router.post('/retrieve', retrieveKnowledgeBaseHandler);
