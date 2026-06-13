import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./tests/setup.ts'],
		testTimeout: 30000,
		hookTimeout: 120000,
		// Run test files in one fork so concurrent MongoMemoryReplSet binary
		// downloads don't race on the shared mongodb-binaries lockfile in CI.
		pool: 'forks',
		poolOptions: { forks: { singleFork: true } }
	}
});
