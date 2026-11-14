import { Router, Request, Response } from 'express';
import { getWebText, validateUrl } from '../../getWebText';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const url = typeof req.query.url === 'string' ? req.query.url : undefined;
    if (!url) {
      res.status(400).json({ message: 'url is missing' });
      return;
    }

    // Validate URL safety before fetching it
    const validation = await validateUrl(url);
    if (!validation.valid) {
      res.status(403).json({ message: validation.message || 'Access denied' });
      return;
    }

    const text = await getWebText(url);
    res.status(200).json({ text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
