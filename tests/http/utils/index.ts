import request, { HttpVerb } from 'sync-request';

export function http(method: HttpVerb, route: string, token?: string, payload?: object) {
  let qs; let json = {};
  if (payload) ['GET', 'DELETE'].includes(method.toUpperCase()) ? qs = payload : json = payload;
  return request(method, `http://${process.env.HOST}:${process.env.PORT}` + route, { qs, json, headers: { token: token } });
}
