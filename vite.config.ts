import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const target = env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

    return {
        server: {
            port: 3000,
            proxy: {
                '/api': {
                    target: target,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                },
                '/login': {
                    target: target,
                    changeOrigin: true
                },
                '/logout': {
                    target: target,
                    changeOrigin: true
                },
                '/auth/callback': {
                    target: target,
                    changeOrigin: true
                }
            }
        }
    }
})
