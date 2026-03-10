import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/subscribe' && req.method === 'POST') {
            try {
              // @ts-ignore
              const { default: handler } = await import('./api/subscribe.js');
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                // @ts-ignore
                req.body = body ? JSON.parse(body) : {};

                // Add Vercel-like helper methods
                // @ts-ignore
                res.status = function (code) {
                  this.statusCode = code;
                  return this;
                };
                // @ts-ignore
                res.json = function (data) {
                  this.setHeader('Content-Type', 'application/json');
                  this.end(JSON.stringify(data));
                };

                await handler(req, res);
              });
              return;
            } catch (e) {
              console.error('Error handling API route:', e);
              res.statusCode = 500;
              res.end('Internal Server Error');
              return;
            }
          }
          next();
        });
      }
    }
  ],
})
