import { LambdaClient } from '@aws-sdk/client-lambda';
import { router } from '../../lambda/api/routes/speechToSpeech';
import { callRoute } from './api/callRoute';

jest.mock('@aws-sdk/client-lambda', () => {
  const actual = jest.requireActual('@aws-sdk/client-lambda');
  return { ...actual, LambdaClient: jest.fn() };
});
const send = jest.fn();
(LambdaClient as unknown as jest.Mock).mockImplementation(() => ({ send }));

// Sends POST /speech-to-speech with the body
const request = (body: object) => callRoute(router, 'POST', '/', { body });

const model = { type: 'bedrock', modelId: 'amazon.nova-2-sonic-v1:0' };

// The payload the task Lambda was invoked with
const invokedPayload = () =>
  JSON.parse(Buffer.from(send.mock.calls[0][0].input.Payload).toString());

describe('startSpeechToSpeechSession', () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({});
  });

  it('passes a voice of the model to the task', async () => {
    const res = await request({ channel: 'ch', model, voiceId: 'matthew' });
    expect(res.statusCode).toBe(200);
    expect(invokedPayload()).toEqual({
      channelId: 'ch',
      model,
      voiceId: 'matthew',
    });
  });

  it('accepts a request without a voice', async () => {
    const res = await request({ channel: 'ch', model });
    expect(res.statusCode).toBe(200);
    expect(invokedPayload().voiceId).toBeUndefined();
  });

  it.each([
    ['an unknown voice', 'not-a-voice'],
    // greta is a Nova Sonic v1 voice, not a Nova 2 Sonic one
    ['a voice of another model', 'greta'],
  ])('rejects %s without starting the task', async (_, voiceId) => {
    const res = await request({ channel: 'ch', model, voiceId });
    expect(res.statusCode).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
});
