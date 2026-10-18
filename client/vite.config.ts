import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	build: { outDir: 'build' },
	// No dev proxy: axiosInstance calls VITE_API_BASE_URL (default http://localhost:5000)
	// directly, and proxying /stats or /companies hijacked those client routes on refresh.
	server: { port: 3000 }
});
