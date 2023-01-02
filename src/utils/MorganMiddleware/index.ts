import chalk from 'chalk';
import { Request, Response } from 'express';
import morgan from 'morgan';

export const morganMiddleware = morgan(function (tokens, req: Request, res: Response) {
  return [
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex('#ffb142').bold(statusColour(req, res)),
    chalk.hex('#A020F0').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#f78fb3').bold('@ ' + tokens.date(req, res)),
    '\n',
  ].join(' ');
});

const statusColour = (req: Request, res: Response) => {
  const status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent) ? res.statusCode : undefined;
  const color =
    status >= 500
      ? 31 // red
      : status >= 400
        ? 33 // yellow
        : status >= 300
          ? 36 // cyan
          : status >= 200
            ? 32 // green
            : 0; // no color
  return '\x1b[' + color + 'm' + status + '\x1b[0m';
};
