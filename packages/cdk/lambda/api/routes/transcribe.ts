import { Router, Request, Response } from 'express';
import {
  GetFileUploadSignedUrlRequest,
  StartTranscriptionRequest,
} from 'generative-ai-use-cases';
import { startTranscription } from '../../startTranscription';
import { getTranscription } from '../../getTranscription';
import { getFileUploadSignedUrl } from '../../getFileUploadSignedUrl';
import { getClaims } from '../user';

export const router = Router();

router.post('/start', async (req: Request, res: Response) => {
  try {
    const input: StartTranscriptionRequest = req.body;
    const jobName = await startTranscription(getClaims(req).sub, input);
    res.status(200).json({ jobName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/url', async (req: Request, res: Response) => {
  try {
    const { filename }: GetFileUploadSignedUrlRequest = req.body;
    const signedUrl = await getFileUploadSignedUrl(filename);
    res.status(200).type('json').send(signedUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/result/:jobName', async (req: Request, res: Response) => {
  try {
    const transcription = await getTranscription(
      getClaims(req).sub,
      req.params.jobName
    );
    // The job was started by another user
    if (transcription === null) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    res.status(200).json(transcription);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
