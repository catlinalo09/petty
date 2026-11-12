import mongoose from 'mongoose';

/**
 * Conecta Mongoose usando MONGODB_URI.
 * bufferCommands = false hace que las consultas fallen rápido (503)
 * en lugar de quedarse esperando cuando MongoDB no está disponible.
 *
 * La promesa se guarda para reutilizar la conexión: en Netlify Functions
 * el proceso se reutiliza entre peticiones y no conviene abrir una conexión nueva cada vez.
 */
let connectionPromise = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Falta MONGODB_URI en backend/.env');
  }

  mongoose.set('bufferCommands', false);

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then((conn) => {
      console.log(`MongoDB conectado: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}
