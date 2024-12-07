import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse({
  SERVER_PORT: process.env.SERVER_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
})
