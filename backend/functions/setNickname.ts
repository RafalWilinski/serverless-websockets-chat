import { Handler } from "aws-lambda";
import { WebsocketAPIGatewayEvent } from "./types";
import { success } from "./helpers/response";
import { rename, getLastNMessagesByTime } from "./helpers/dynamodb";
import websocketsClient from "./websocketsClient";

export const index: Handler = async (
  event: WebsocketAPIGatewayEvent,
  _,
  cb
) => {
  const { connectionId, connectedAt } = event.requestContext;
  const body = JSON.parse(event.body);

  await rename(connectionId, connectedAt, body.nickname);
  await new websocketsClient(event.requestContext).send({
    action: "messages",
    messages: (await getLastNMessagesByTime(connectedAt, 20)).Items
  });

  return cb(null, success);
};
