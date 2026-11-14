import { Request } from 'express';
import { APIGatewayProxyEvent } from 'aws-lambda';

// The middleware in index.ts puts API Gateway's request context on the
// request. These read the signed-in user from it.
type RequestWithApiGateway = Request & {
  apiGateway?: {
    event?: { requestContext?: APIGatewayProxyEvent['requestContext'] };
  };
};

export const getClaims = (req: Request): Record<string, string> => {
  const claims = (req as RequestWithApiGateway).apiGateway?.event
    ?.requestContext?.authorizer?.claims;
  if (!claims) {
    throw new Error('No signed-in user on the request');
  }
  return claims;
};

export const getUserId = (req: Request): string => {
  const userId = getClaims(req)['cognito:username'];
  if (typeof userId !== 'string' || userId === '') {
    throw new Error('No signed-in user on the request');
  }
  return userId;
};
