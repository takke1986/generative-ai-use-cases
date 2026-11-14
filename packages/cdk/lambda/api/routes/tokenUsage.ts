import { Router, Request, Response } from 'express';
import { aggregateTokenUsage } from '../../repository';
import { getUserId } from '../user';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Getting token usage statistics', { query: req.query });

    const userId = getUserId(req);
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };
    if (!startDate || !endDate) {
      res.status(400).json({
        message: 'startDate and endDate parameters are required',
      });
      return;
    }

    // Get aggregated data for the specified period
    const stats = await aggregateTokenUsage(startDate, endDate, [userId]);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting token usage statistics:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
