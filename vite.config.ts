import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    // Default to port 8080 to match the local Flask dev server in `app.py`
    const target = env.VITE_BACKEND_URL || 'https://g5kwm3csp1.execute-api.eu-north-1.amazonaws.com'

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
