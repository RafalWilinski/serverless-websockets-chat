import { Handler } from "aws-lambda";
import { WebsocketAPIGatewayEvent } from "./types";
import {
  saveConnection,
  deleteConnection,
  getAllConnections
} from "./helpers/dynamodb";
import { success } from "./helpers/response";
import broadcast from "./helpers/broadcast";
import websocketsClient from "./websocketsClient";

const updateConnectionsStatus = async (ws: websocketsClient) => {
  const connections = await getAllConnections();
  await broadcast(connections, ws);
};

export const onConnect: Handler = async (event: WebsocketAPIGatewayEvent) => {
  const { connectionId, connectedAt } = event.requestContext;

  await saveConnection(connectionId, connectedAt);

  return success;
};

export const onDisconnect: Handler = async (
  event: WebsocketAPIGatewayEvent
) => {
  const { connectionId, connectedAt } = event.requestContext;
  const ws = new websocketsClient(event.requestContext);

  await deleteConnection(connectionId, connectedAt);
  await updateConnectionsStatus(ws);

  return success;
};
