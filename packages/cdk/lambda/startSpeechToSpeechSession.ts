import { Request, Response } from 'express';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { SpeechToSpeechSessionRequest } from 'generative-ai-use-cases';
import { isSpeechToSpeechVoice } from '@generative-ai-use-cases/common';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channel, model, voiceId }: SpeechToSpeechSessionRequest = req.body;

    // The voiceId is passed to Bedrock as is, so accept only the voices of the model
    if (
      voiceId !== undefined &&
      !isSpeechToSpeechVoice(model?.modelId ?? '', voiceId)
    ) {
      res.status(400).json({ message: 'Invalid voiceId' });
      return;
    }

    const lambda = new LambdaClient({});

    await lambda.send(
      new InvokeCommand({
        FunctionName: process.env.SPEECH_TO_SPEECH_TASK_FUNCTION_ARN,
        InvocationType: InvocationType.Event,
        Payload: JSON.stringify({ channelId: channel, model, voiceId }),
      })
    );

    res.status(200).json({ channel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
