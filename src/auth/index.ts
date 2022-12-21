import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { createHash } from 'crypto';

/**
 * Given an API key, determine if the client has access
 * @param apiKey the API key to use with the API
 * @throws {createErrors<401>} if the API key is invalid
 */
export async function validateSession(apiKey: string) {
  if (apiKey === undefined || (await DB.field('SELECT Token FROM APIKeys WHERE Token = ?', [createHash('sha256').update(apiKey).digest('hex')])) === null) {
    throw createErrors(401, 'Unauthorized');
  }
}
