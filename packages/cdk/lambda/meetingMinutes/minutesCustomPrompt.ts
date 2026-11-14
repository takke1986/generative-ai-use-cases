import { Request, Response } from 'express';
import { getUserId } from '../api/user';
import { UpdateMeetingMinutesCustomPromptRequest } from 'generative-ai-use-cases';
import {
  listMeetingMinutesCustomPrompts,
  createMeetingMinutesCustomPrompt,
  updateMeetingMinutesCustomPrompt,
  deleteMeetingMinutesCustomPrompt,
} from './repository';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = getUserId(req);
    const method = req.method;

    if (method === 'GET') {
      const items = await listMeetingMinutesCustomPrompts(userId);
      res.status(200).json(items);
      return;
    }

    if (method === 'POST') {
      const input = req.body;
      const prompt = await createMeetingMinutesCustomPrompt(
        userId,
        input.meetingMinutesCustomPromptTitle,
        input.meetingMinutesCustomPromptBody
      );
      res.status(200).json({ meetingMinutesCustomPrompt: prompt });
      return;
    }

    if (method === 'PUT') {
      const id = req.params.id;
      const input: UpdateMeetingMinutesCustomPromptRequest = req.body;
      const prompt = await updateMeetingMinutesCustomPrompt(
        userId,
        id,
        input.meetingMinutesCustomPromptTitle,
        input.meetingMinutesCustomPromptBody
      );
      res.status(200).json({ meetingMinutesCustomPrompt: prompt });
      return;
    }

    if (method === 'DELETE') {
      const id = req.params.id;
      await deleteMeetingMinutesCustomPrompt(userId, id);
      res.status(204).send();
      return;
    }

    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
