import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        server: {
            warmup: {
                clientFiles: ['./src/components/*.vue', './src/layout/*.vue'],
                ssrFiles: ['./src/service/*.js', './src/service/**/*.js']
            },
            host: true,
            port: 5173,
            proxy: {
                '/api': {
                    target: 'https://workplan-web.test', // Laravel backend URL
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
