import mongoose from 'mongoose';

/**
 * Conecta Mongoose usando MONGODB_URI.
 * bufferCommands = false hace que las consultas fallen rápido (503)
 * en lugar de quedarse esperando cuando MongoDB no está disponible.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Falta MONGODB_URI en server/.env');
  }

  mongoose.set('bufferCommands', false);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB conectado: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}
