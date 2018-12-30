import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();

export const saveConnection = (connectionId: string, connectedAt: number) =>
  dynamo
    .put({
      TableName: process.env.CONNECTIONS_TABLE,
      Item: {
        connectionId,
        joinedAt: connectedAt,
        terminateAt: (
          connectedAt / 1000 +
          parseInt(process.env.SESSION_TTL)
        ).toFixed(0)
      }
    })
    .promise();

export const deleteConnection = (connectionId: string, connectedAt: number) =>
  dynamo
    .delete({
      TableName: process.env.CONNECTIONS_TABLE,
      Key: {
        connectionId,
        joinedAt: connectedAt
      }
    })
    .promise();

export const getAllConnections = () =>
  dynamo.scan({ TableName: process.env.CONNECTIONS_TABLE }).promise();

export const rename = (
  connectionId: string,
  connectedAt: number,
  name: string
) =>
  dynamo
    .update({
      TableName: process.env.CONNECTIONS_TABLE,
      Key: {
        connectionId,
        joinedAt: connectedAt
      },
      ExpressionAttributeNames: { "#name": "name" },
      UpdateExpression: "set #name = :name",
      ExpressionAttributeValues: {
        ":name": name
      }
    })
    .promise();

export const putMessage = (body: string) =>
  dynamo
    .put({
      TableName: process.env.MESSAGES_TABLE,
      Item: {
        body,
        roomKey: "PARTITION_0",
        createdAt: +new Date()
      }
    })
    .promise();

export const getLastNMessagesByTime = (from: number, count: number) =>
  dynamo
    .query({
      TableName: process.env.MESSAGES_TABLE,
      KeyConditionExpression: "roomKey = :hkey and createdAt < :rkey",
      ExpressionAttributeValues: {
        ":hkey": "PARTITION_0",
        ":rkey": from
      },
      Limit: count
    })
    .promise();
