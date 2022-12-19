import request, { HttpVerb } from 'sync-request';

/**
 *
 * @param method The HTTP method to use
 * @param route The relative route to use
 * @param token The token to use for authentication. DEPRECATED?
 * @param payload The body/query strings depending on the method
 * @returns {Response}
 */
export function http(method: HttpVerb, route: string, token?: string, payload?: object) {
  let qs; let json = {};
  if (payload) ['GET', 'DELETE'].includes(method.toUpperCase()) ? qs = payload : json = payload;
  return request(method, `http://${process.env.HOST}:${process.env.PORT}` + route, { qs, json, headers: { token: token } });
}
