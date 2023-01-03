import strip from 'strip-color';
import winston from 'winston';
import 'winston-daily-rotate-file';
import { format } from 'date-fns';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

const timezone = () => {
  return format(new Date(), 'dd-MM-yyyy HH:mm:ss O');
};

winston.addColors(colors);

const winstonFileFormat = winston.format.combine(winston.format.printf((info) => `${timezone()} ${info.level}: ${strip(info.message)}`));

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf((info) => `${timezone()} ${info.level}: ${info.message}`)
    ),
  }),
  new winston.transports.DailyRotateFile({
    frequency: '1d',
    filename: 'logs/error.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: 7,
    level: 'error',
    format: winstonFileFormat,
  }),
  new winston.transports.DailyRotateFile({
    frequency: '1d',
    filename: 'logs/all.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: 7,
    format: winstonFileFormat,
  }),
];

const Logger = winston.createLogger({
  level: 'debug',
  levels,
  transports,
});

export default Logger;
