import { Request, Response } from 'express';
import { deleteShareId } from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const shareId = req.params.shareId;

    await deleteShareId(shareId);

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
