import './config/env.js';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 4000;

async function tryConnect() {
  try {
    await connectDB();
    return true;
  } catch (error) {
    console.error(`MongoDB no disponible: ${error.message}`);
    return false;
  }
}

async function main() {
  if (!(await tryConnect())) {
    console.error('');
    console.error('La API arrancará sin base de datos: /api/products y /api/messages responderán 503.');
    console.error('Opciones:');
    console.error('  1) Instala y arranca MongoDB local en mongodb://127.0.0.1:27017/petty');
    console.error('  2) Usa MongoDB Atlas y pega tu cadena en server/.env (MONGODB_URI)');
    console.error('Se reintentará la conexión cada 15 segundos...');
    console.error('');

    const retry = setInterval(async () => {
      if (await tryConnect()) {
        clearInterval(retry);
        console.log('Conexión a MongoDB restablecida. La API ya puede operar.');
      }
    }, 15_000);

    retry.unref();
  }

  const server = app.listen(PORT, () => {
    console.log(`API Petty escuchando en http://localhost:${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
