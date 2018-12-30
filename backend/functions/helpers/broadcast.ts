import websocketsClient from "../websocketsClient";
import { getAllConnections } from "./dynamodb";

export default async (msg: any, ws: websocketsClient) => {
  const { Items } = await getAllConnections();

  return Items.map(connection => ws.send(msg, connection.connectionId));
};
