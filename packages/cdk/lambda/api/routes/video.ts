import { Router, Request, Response } from 'express';
import { GenerateVideoRequest } from 'generative-ai-use-cases';
import { deleteVideoJob, listVideoJobs } from '../../repositoryVideoJob';
import { generateVideo } from '../../generateVideo';
import { getUserId } from '../user';

export const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const input: GenerateVideoRequest = req.body;
    const job = await generateVideo(getUserId(req), input);
    res.status(200).json(job);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/generate', async (req: Request, res: Response) => {
  try {
    const exclusiveStartKey = req.query.exclusiveStartKey as string | undefined;
    const jobs = await listVideoJobs(getUserId(req), exclusiveStartKey);
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/generate/:createdDate', async (req: Request, res: Response) => {
  try {
    await deleteVideoJob(getUserId(req), req.params.createdDate);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
