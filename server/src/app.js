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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin(origin, callback) {
      const allowed = (process.env.CLIENT_ORIGIN || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      // Sin lista configurada se permite cualquier origen (desarrollo).
      if (!origin || allowed.length === 0 || allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  }),
);

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
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');

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
      'client/dist no existe. Ejecuta "npm run build" antes de iniciar en producción.',
    );
  }
}

app.use(errorHandler);

export default app;
