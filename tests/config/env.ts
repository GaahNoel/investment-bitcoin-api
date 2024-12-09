import { vi } from 'vitest'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
})

vi.stubEnv('JWT_SECRET', 'secret123')
vi.stubEnv('SEND_GRID_API_TOKEN', 'any-token')
vi.stubEnv('SEND_GRID_SENDER', 'any-sender')
