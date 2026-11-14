import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { UpdateSystemContextTitleRequest } from 'generative-ai-use-cases';
import { updateSystemContextTitle } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const systemContextId = req.params.systemContextId;
    const input: UpdateSystemContextTitleRequest = req.body;
    const systemContext = await updateSystemContextTitle(
      userId,
      systemContextId,
      input.title
    );

    res.status(200).json({ systemContext });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
