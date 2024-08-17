import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config();
}

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = Number(process.env.DB_PORT) ?? 3306;
export const DB_USERNAME = process.env.DB_USERNAME ?? 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
export const DB_DATABASE = process.env.DB_DATABASE ?? 'AllCrawler';

export const PORT = process.env.PORT ?? 3000;

export const MQTT_URL = process.env.MQTT_URL;
