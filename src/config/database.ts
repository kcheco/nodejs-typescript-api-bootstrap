import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env')});

export interface IDatabaseConfiguration {
  default?: object,
  development?: object,
  production?: object,
  staging?: object,
  test?: object
};

const dbConfig: IDatabaseConfiguration = {
  default: {
    poolSize: '5',
    useNewUrlParser: true,
    retryWrites: true,
  },
  development: {
    // host: 'localhost',
    // port: '27107',
    dbName: 'todo_api_development',
    user: process.env.DEV_MONGODB_USER,
    pass: process.env.DEV_MONGODB_PASS,
  },
  production: {
    dbName: 'todo_api_production',
    user: process.env.PROD_MONGODB_USER,
    pass: process.env.PROD_MONGODB_PASS,
  },
  test: {
    dbName: 'todo_api_testing'
  }
};

export default dbConfig;
