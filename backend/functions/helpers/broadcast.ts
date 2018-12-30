import websocketsClient from '../websocketsClient';

export default (ids: any[], msg: any, ws: websocketsClient) =>
  ids.map(async id => ws.send(msg, id));
