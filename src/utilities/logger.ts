import {
  Logger, createLogger, transports, format,
} from 'winston';
import path from 'path';
import loggerOptions from '../config/logger';

const ENV = process.env.NODE_ENV || 'development';

const logger: Logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({
      stack: true,
    }),
    format.splat(),
    format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
  ),
  transports: [
    new transports.Console(loggerOptions.console),
    new transports.File({
      filename: path.join(__dirname, `../../logs/${ ENV }.log`),
      ...loggerOptions.file,
    }),
    new transports.File({
      level: 'error',
      filename: path.join(__dirname, `../../logs/${ ENV }-error.log`),
      ...loggerOptions.file,
    }),
  ],
});

if (ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
