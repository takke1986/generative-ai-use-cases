import { GenerateImageRequest } from 'generative-ai-use-cases';
import api from './utils/api';
import { defaultImageGenerationModel } from './utils/models';

// Generates an image and returns it as base64.
export const generateImage = async (
  input: GenerateImageRequest
): Promise<string> => {
  const model = input.model || defaultImageGenerationModel;
  return api[model.type].generateImage(model, input.params);
};
