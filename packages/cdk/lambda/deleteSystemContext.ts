import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { deleteSystemContext } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const systemContextId = req.params.systemContextId;
    await deleteSystemContext(userId, systemContextId);

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
