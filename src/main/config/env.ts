import { z } from 'zod'

const envSchema = z.object({
  SERVER_PORT: z.coerce.number(),
})

export const env = envSchema.parse({
  SERVER_PORT: process.env.SERVER_PORT,
})
