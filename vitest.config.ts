import path from 'path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  envDir: './',
  test: {
    fileParallelism: false,
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        ...configDefaults.exclude,
        'prisma/**',
        'src/**/contracts',
        'src/main/server.ts',
        'src/main/config',
        'src/main/factories',
        'src/application/middlewares/base.middleware.ts',
        'src/fakes',
      ],
      provider: 'v8',
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    setupFiles: ['dotenv/config', path.resolve(__dirname, 'tests', 'config', 'env')],
    // silent: true,
  },
  resolve: {
    alias: {
      '@/tests': path.resolve(__dirname, './tests'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
