import { env } from '@/main/config/env'
import Redis from 'ioredis'

export const cacheClient = new Redis({
  port: env.CACHE_PORT,
  host: env.CACHE_HOST,
  username: env.CACHE_USERNAME,
  password: env.CACHE_PASSWORD,
})
