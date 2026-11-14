import { Router, Request, Response } from 'express';
import { UpdateMeetingMinutesCustomPromptRequest } from 'generative-ai-use-cases';
import {
  listMeetingMinutesCustomPrompts,
  createMeetingMinutesCustomPrompt,
  updateMeetingMinutesCustomPrompt,
  deleteMeetingMinutesCustomPrompt,
} from '../../meetingMinutes/repository';
import { getUserId } from '../user';

export const router = Router();

router.get('/custom-prompts', async (req: Request, res: Response) => {
  try {
    const prompts = await listMeetingMinutesCustomPrompts(getUserId(req));
    res.status(200).json(prompts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/custom-prompts', async (req: Request, res: Response) => {
  try {
    const input: UpdateMeetingMinutesCustomPromptRequest = req.body;
    const prompt = await createMeetingMinutesCustomPrompt(
      getUserId(req),
      input.meetingMinutesCustomPromptTitle,
      input.meetingMinutesCustomPromptBody
    );
    res.status(200).json({ meetingMinutesCustomPrompt: prompt });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/custom-prompts/:id', async (req: Request, res: Response) => {
  try {
    const input: UpdateMeetingMinutesCustomPromptRequest = req.body;
    const prompt = await updateMeetingMinutesCustomPrompt(
      getUserId(req),
      req.params.id,
      input.meetingMinutesCustomPromptTitle,
      input.meetingMinutesCustomPromptBody
    );
    res.status(200).json({ meetingMinutesCustomPrompt: prompt });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/custom-prompts/:id', async (req: Request, res: Response) => {
  try {
    await deleteMeetingMinutesCustomPrompt(getUserId(req), req.params.id);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
