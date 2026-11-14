import { Router, Request, Response } from 'express';
import {
  GetFileDownloadSignedUrlRequest,
  GetFileUploadSignedUrlRequest,
} from 'generative-ai-use-cases';
import { getFileUploadSignedUrl } from '../../getFileUploadSignedUrl';
import { getFileDownloadSignedUrl } from '../../getFileDownloadSignedUrl';
import { deleteFile } from '../../deleteFile';

export const router = Router();

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

router.get('/url', async (req: Request, res: Response) => {
  try {
    const input = req.query as unknown as GetFileDownloadSignedUrlRequest;
    const signedUrl = await getFileDownloadSignedUrl(input);
    res.status(200).type('json').send(signedUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:fileName', async (req: Request, res: Response) => {
  try {
    await deleteFile(req.params.fileName);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
