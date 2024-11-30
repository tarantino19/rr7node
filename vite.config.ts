import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
	build: {
		// Server-side and client-side builds separation
		rollupOptions: isSsrBuild
			? {
					input: './server/app.ts',
			  }
			: undefined,
	},
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer], // Add Tailwind and autoprefixer
		},
	},
	plugins: [
		reactRouter({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
			},
		}),
		tsconfigPaths(),
	],
	clearScreen: false, // Helps debug errors during development
	server: {
		strictPort: true, // Use the same port for HMR
		watch: {
			usePolling: true, // Fixes issues with file changes not being detected
		},
	},
}));
