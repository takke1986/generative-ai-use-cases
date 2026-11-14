import { Router } from 'express';
import { handler as minutesCustomPromptHandler } from '../../meetingMinutes/minutesCustomPrompt';

export const router = Router();

router.get('/custom-prompts', minutesCustomPromptHandler);
router.post('/custom-prompts', minutesCustomPromptHandler);
router.put('/custom-prompts/:id', minutesCustomPromptHandler);
router.delete('/custom-prompts/:id', minutesCustomPromptHandler);
