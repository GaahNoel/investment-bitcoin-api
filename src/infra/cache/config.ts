import Redis from 'ioredis'

export const cacheClient = new Redis({
  port: 6379,
  host: 'localhost',
  username: 'default',
  password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
})
