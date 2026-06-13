import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./tests/setup.ts'],
		testTimeout: 30000,
		hookTimeout: 120000,
		// Run test files sequentially in one fork so concurrent MongoMemoryReplSet
		// binary downloads don't race on the shared mongodb-binaries lockfile in CI.
		// Vitest 4 removed poolOptions; fileParallelism: false is the replacement.
		pool: 'forks',
		fileParallelism: false
	}
});
