import { GenerateVideoRequest } from 'generative-ai-use-cases';
import api from './utils/api';
import { defaultVideoGenerationModel } from './utils/models';
import { createJob } from './repositoryVideoJob';

// Starts generating a video and records the job for the user.
export const generateVideo = async (
  userId: string,
  input: GenerateVideoRequest
) => {
  const model = input.model || defaultVideoGenerationModel;
  const invocationArn = await api[model.type].generateVideo(
    model,
    input.params
  );
  return createJob(userId, invocationArn, input);
};
