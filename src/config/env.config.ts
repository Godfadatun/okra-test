import * as env from 'env-var';
import { config } from 'dotenv';

config();

export const MONGO_URL = env.get('MONGO_URL').asString();
export const MONGO_USERNAME = env.get('MONGO_USERNAME').asString();
export const MONGO_PASSWORD = env.get('MONGO_PASSWORD').asString();
export const MONGO_HOST = env.get('MONGO_HOST').asString();
export const JWT_SECRET = env.get('JWT_SECRET').asString();
export const OKRA_URL = env.get('OKRA_URL').asString();
export const ENVIRONMENT = env.get('ENVIRONMENT').asString();
