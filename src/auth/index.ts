import DB from '@utils/DBHandler';
import createErrors from 'http-errors';
import { createHash } from 'crypto';

export async function validateSession(apiKey) {
  if (apiKey === undefined || await DB.field('SELECT Token FROM APIKeys WHERE Token = ?', [createHash('sha256').update(apiKey).digest('hex')]) === null) {
    throw createErrors(401, 'Unauthorized');
  }
}
