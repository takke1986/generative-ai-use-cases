import { Request, Response } from 'express';
import { getUserId } from './api/user';
import { deleteVideoJob } from './repositoryVideoJob';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const createdDate: string = req.params.createdDate;

    await deleteVideoJob(userId, createdDate);

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
