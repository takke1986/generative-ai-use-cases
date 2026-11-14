import { Router, Request, Response } from 'express';
import {
  SystemContext,
  UpdateSystemContextTitleRequest,
} from 'generative-ai-use-cases';
import {
  createSystemContext,
  deleteSystemContext,
  listSystemContexts,
  updateSystemContextTitle,
} from '../../repository';
import { getUserId } from '../user';

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const input: SystemContext = req.body;
    const messages = await createSystemContext(
      getUserId(req),
      input.systemContextTitle,
      input.systemContext
    );
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const systemContexts = await listSystemContexts(getUserId(req));
    res.status(200).json(systemContexts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:systemContextId', async (req: Request, res: Response) => {
  try {
    await deleteSystemContext(getUserId(req), req.params.systemContextId);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:systemContextId/title', async (req: Request, res: Response) => {
  try {
    const input: UpdateSystemContextTitleRequest = req.body;
    const systemContext = await updateSystemContextTitle(
      getUserId(req),
      req.params.systemContextId,
      input.title
    );
    res.status(200).json({ systemContext });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
