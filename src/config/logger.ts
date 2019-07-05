import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

const loggerOptions = {
  file: {
    handleExceptions: true,
    json: true,
    colorize: false,
  },
  console: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    silent: process.env.NODE_ENV === 'test'
  },
};

export default loggerOptions;
