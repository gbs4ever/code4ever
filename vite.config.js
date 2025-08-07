import { defineConfig } from 'vite';

export default defineConfig({
    // Root directory
    root: '.',

    // Public directory for static assets
    publicDir: 'public',

    // Build configuration
    build: {
        // Output directory
        outDir: 'dist',

        // Assets directory within dist
        assetsDir: 'assets',

        // Clean output directory before build
        emptyOutDir: true,

        // Generate source maps for production
        sourcemap: false,

        // Rollup options
        rollupOptions: {
            input: {
                main: './index.html',
            },
        },
    },

    // Server configuration for development
    server: {
        port: 3000,
        host: true,
        open: true,
    },

    // Preview server configuration
    preview: {
        port: 4173,
        host: true,
    },
});
