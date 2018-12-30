import { APIGatewayEvent, Handler } from 'aws-lambda';
import webSocketsClient from './websocketsClient';
import { success } from './helpers/response';
import { getAllConnections } from './helpers/dynamodb';
import broadcast from './helpers/broadcast';

export const index: Handler = async (event: APIGatewayEvent, _, callback) => {
  const ws = new webSocketsClient(event.requestContext);
  console.log(event);
  const connections = await getAllConnections();

  await broadcast(connections.Items.map(c => c.connectionId), event.body, ws);

  return callback(null, success);
};
