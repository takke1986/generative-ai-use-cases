import express, { Router } from 'express';
import http from 'http';
import { AddressInfo } from 'net';

export type RouteRequest = {
  body?: unknown;
  // The signed-in user, as the middleware in lambda/api/index.ts sets it
  userId?: string;
};

export type RouteResponse = { statusCode: number; body: string };

// Serves the router on a free port, sends one request to it over HTTP, and
// returns what it sent back. Uses http rather than fetch, because some tests
// mock fetch.
export const callRoute = async (
  router: Router,
  method: string,
  path: string,
  { body, userId }: RouteRequest = {}
): Promise<RouteResponse> => {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    if (userId) {
      (req as express.Request & { apiGateway?: unknown }).apiGateway = {
        event: {
          requestContext: {
            authorizer: { claims: { 'cognito:username': userId } },
          },
        },
      };
    }
    next();
  });
  app.use(router);

  const server = await new Promise<http.Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  try {
    const { port } = server.address() as AddressInfo;
    const payload = body === undefined ? undefined : JSON.stringify(body);
    return await new Promise<RouteResponse>((resolve, reject) => {
      const request = http.request(
        {
          host: '127.0.0.1',
          port,
          method,
          path,
          headers: payload ? { 'Content-Type': 'application/json' } : {},
        },
        (res) => {
          let text = '';
          res.on('data', (chunk) => (text += chunk));
          res.on('end', () =>
            resolve({ statusCode: res.statusCode ?? 0, body: text })
          );
        }
      );
      request.on('error', reject);
      request.end(payload);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};
