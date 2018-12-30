import { Handler } from 'aws-lambda';
import { WebsocketAPIGatewayEvent } from './types';
import {
  saveConnection,
  deleteConnection,
  getAllConnections,
  getLastNMessagesByTime,
} from './helpers/dynamodb';
import { success } from './helpers/response';
import broadcast from './helpers/broadcast';
import websocketsClient from './websocketsClient';

const updateConnectionsStatus = async (event, ws) => {
  const connections = await getAllConnections();
  await broadcast(connections.Items.map(c => c.connectionId), connections, ws);
};

export const onConnect: Handler = async (event: WebsocketAPIGatewayEvent) => {
  const { connectionId, connectedAt } = event.requestContext;
  const ws = new websocketsClient(event.requestContext);

  await saveConnection(connectionId, connectedAt);
  // await updateConnectionsStatus(event, ws);

  const messages = await getLastNMessagesByTime(connectedAt, 20);
  console.log(messages);

  await ws.send(messages);

  return success;
};

export const onDisconnect: Handler = async (
  event: WebsocketAPIGatewayEvent,
) => {
  const { connectionId, connectedAt } = event.requestContext;
  const ws = new websocketsClient(event.requestContext);

  await deleteConnection(connectionId, connectedAt);
  await updateConnectionsStatus(event, ws);

  return success;
};
