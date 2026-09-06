import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    plugins: [viteSingleFile()],

    // Build configuration
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },

    // Server configuration for development
    server: {
        port: 3000,
        host: true,
    },
});
