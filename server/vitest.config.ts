import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/data-source.ts',
        'src/migrations/**',
        'src/**/*.spec.ts',
        'src/types/**',
        'src/entities/**',
        'src/repositorises/**',
      ],
      // ДОБАВЛЯЕМ ПОРОГИ:
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
