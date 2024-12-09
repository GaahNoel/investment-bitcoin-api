import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  RABBITMQ_URL: z.string().default('amqp://localhost:5672'),
  SEND_GRID_API_TOKEN: z.string(),
  SEND_GRID_SENDER: z.string(),
  BITCOIN_API_URL: z.string(),
  ENV: z.string(),
  CACHE_HOST: z.string(),
  CACHE_USERNAME: z.string(),
  CACHE_PASSWORD: z.string(),
  CACHE_PORT: z.coerce.number().default(6379),
})

export const env = envSchema.parse({
  SERVER_PORT: process.env.SERVER_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  SEND_GRID_API_TOKEN: process.env.SEND_GRID_API_TOKEN,
  SEND_GRID_SENDER: process.env.SEND_GRID_SENDER,
  BITCOIN_API_URL: process.env.BITCOIN_API_URL,
  ENV: process.env.NODE_ENV,
  CACHE_HOST: process.env.CACHE_HOST,
  CACHE_USERNAME: process.env.CACHE_USERNAME,
  CACHE_PASSWORD: process.env.CACHE_PASSWORD,
  CACHE_PORT: process.env.CACHE_PORT,
})
