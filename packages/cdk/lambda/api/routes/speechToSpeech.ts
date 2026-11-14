import { Router, Request, Response } from 'express';
import { SpeechToSpeechSessionRequest } from 'generative-ai-use-cases';
import {
  isValidVoice,
  startSpeechToSpeechSession,
} from '../../startSpeechToSpeechSession';

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const input: SpeechToSpeechSessionRequest = req.body;
    if (!isValidVoice(input)) {
      res.status(400).json({ message: 'Invalid voiceId' });
      return;
    }
    await startSpeechToSpeechSession(input);
    res.status(200).json({ channel: input.channel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
