import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import productsRouter from './routes/products.routes.js';
import messagesRouter from './routes/messages.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  cors({
    origin(origin, callback) {
      // Peticiones sin cabecera Origin (curl, Postman, same-origin simple).
      if (!origin) return callback(null, true);

      const allowed = (process.env.CLIENT_ORIGIN || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      // Sin lista configurada se permite cualquier origen (desarrollo).
      if (allowed.length === 0 || allowed.includes(origin)) {
        return callback(null, true);
      }

      // Mismo origen: en producción este servidor entrega el build de React,
      // así que el navegador usa el mismo host que la API. Esto permite túneles
      // (Cloudflare, localtunnel, etc.) cuyo dominio cambia en cada ejecución.
      try {
        if (new URL(origin).host === req.headers.host) {
          return callback(null, true);
        }
      } catch {
        // Origen mal formado: se rechaza abajo.
      }

      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  })(req, res, next);
});

// En Netlify (serverless-http) el cuerpo llega como Buffer y la petición se
// marca como "ya completada", así que express.json() no lo procesa.
// Aquí lo convertimos a objeto para que las rutas funcionen igual que en local.
app.use((req, _res, next) => {
  if (Buffer.isBuffer(req.body)) {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      const raw = req.body.toString('utf8');
      try {
        req.body = raw ? JSON.parse(raw) : {};
      } catch {
        req.body = {};
      }
    }
  }
  next();
});

app.use(express.json({ limit: '100kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

app.use('/api/products', productsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api', notFound);

// En producción el mismo servidor entrega el build de React.
// En Netlify (función serverless) los archivos estáticos los sirve Netlify,
// así que este bloque se omite.
const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);

if (process.env.NODE_ENV === 'production' && !isServerless) {
  // import.meta no existe cuando Netlify empaqueta a CommonJS, por eso se
  // calcula aquí dentro: en serverless esta rama nunca se ejecuta.
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.resolve(__dirname, '../../frontend/dist');

  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));

    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) {
        return next();
      }
      return res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    console.warn(
      'frontend/dist no existe. Ejecuta "npm run build" antes de iniciar en producción.',
    );
  }
}

app.use(errorHandler);

export default app;
