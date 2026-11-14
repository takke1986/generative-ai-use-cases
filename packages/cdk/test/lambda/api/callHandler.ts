import { Request, Response } from 'express';

export type HandlerRequest = {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, string>;
  // The signed-in user, as the middleware in lambda/api/index.ts sets it
  userId?: string;
};

export type HandlerResponse = { statusCode: number; body: string };

// Calls an Express route handler with a minimal request and records what it
// sends back. The body is already parsed, as express.json() leaves it.
export const callHandler = async (
  handler: (req: Request, res: Response) => Promise<void>,
  { body, params = {}, query = {}, userId }: HandlerRequest = {}
): Promise<HandlerResponse> => {
  const req = {
    body: body ?? {},
    params,
    query,
    apiGateway: userId
      ? {
          event: {
            requestContext: {
              authorizer: { claims: { 'cognito:username': userId } },
            },
          },
        }
      : undefined,
  } as unknown as Request;

  const sent: HandlerResponse = { statusCode: 200, body: '' };
  const res = {
    status(code: number) {
      sent.statusCode = code;
      return res;
    },
    type() {
      return res;
    },
    json(value: unknown) {
      sent.body = JSON.stringify(value);
      return res;
    },
    send(value?: unknown) {
      sent.body = value === undefined ? '' : String(value);
      return res;
    },
  } as unknown as Response;

  await handler(req, res);
  return sent;
};
