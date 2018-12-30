import { Handler } from 'aws-lambda';
import { WebsocketAPIGatewayEvent } from './types';
import { success } from './helpers/response';
import { rename } from './helpers/dynamodb';

export const index: Handler = async (
  event: WebsocketAPIGatewayEvent,
  _,
  cb,
) => {
  const { connectionId, connectedAt } = event.requestContext;
  const body = JSON.parse(event.body);

  await rename(connectionId, connectedAt, body.nickname);
  return cb(null, success);
};
