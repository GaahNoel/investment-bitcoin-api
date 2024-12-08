import { vi } from 'vitest'

vi.stubEnv('JWT_SECRET', 'secret123')
vi.stubEnv('SEND_GRID_API_TOKEN', 'any-token')
vi.stubEnv('SEND_GRID_SENDER', 'any-sender')
