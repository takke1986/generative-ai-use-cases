import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { createSystemContext } from './repository';
import { SystemContext } from 'generative-ai-use-cases';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: SystemContext = req.body;
    const userId: string = getUserId(req);
    const messages = await createSystemContext(
      userId,
      input.systemContextTitle,
      input.systemContext
    );

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
