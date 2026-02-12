import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			'/auth': 'http://localhost:5000',
			'/companies': 'http://localhost:5000',
			'/stats': 'http://localhost:5000',
			'/users': 'http://localhost:5000',
			'/experiences': 'http://localhost:5000',
			'/token-check': 'http://localhost:5000'
		}
	},
	build: {
		outDir: 'build'
	}
});
