import mongoose from 'mongoose';

/**
 * Devuelve 503 con un mensaje claro cuando la base de datos no está conectada.
 */
export function requireDB(_req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message:
      'La base de datos no está disponible. Verifica MONGODB_URI en server/.env y que MongoDB esté en ejecución.',
  });
}
