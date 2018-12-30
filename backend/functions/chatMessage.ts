import { Handler } from "aws-lambda";
import webSocketsClient from "./websocketsClient";
import { success } from "./helpers/response";
import broadcast from "./helpers/broadcast";
import { WebsocketAPIGatewayEvent } from "./types";
import { putMessage } from "./helpers/dynamodb";

export const index: Handler = async (
  event: WebsocketAPIGatewayEvent,
  _,
  callback
) => {
  const ws = new webSocketsClient(event.requestContext);
  await broadcast(event.body, ws);
  await putMessage(event.body);

  return callback(null, success);
};
