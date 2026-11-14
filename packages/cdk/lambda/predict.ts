import { PredictRequest } from 'generative-ai-use-cases';
import api from './utils/api';
import { defaultModel } from './utils/models';

// Runs the model on the messages and returns its whole answer.
export const predict = async (input: PredictRequest) => {
  const model = input.model || defaultModel;
  return api[model.type].invoke?.(model, input.messages, input.id);
};
