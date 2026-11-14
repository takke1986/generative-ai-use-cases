import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { SpeechToSpeechSessionRequest } from 'generative-ai-use-cases';
import { isSpeechToSpeechVoice } from '@generative-ai-use-cases/common';

// The voiceId is passed to Bedrock as is, so accept only the voices of the model
export const isValidVoice = ({
  model,
  voiceId,
}: SpeechToSpeechSessionRequest): boolean =>
  voiceId === undefined || isSpeechToSpeechVoice(model?.modelId ?? '', voiceId);

// Starts the task that runs the speech-to-speech session on the channel.
export const startSpeechToSpeechSession = async ({
  channel,
  model,
  voiceId,
}: SpeechToSpeechSessionRequest): Promise<void> => {
  const lambda = new LambdaClient({});
  await lambda.send(
    new InvokeCommand({
      FunctionName: process.env.SPEECH_TO_SPEECH_TASK_FUNCTION_ARN,
      InvocationType: InvocationType.Event,
      Payload: JSON.stringify({ channelId: channel, model, voiceId }),
    })
  );
};
