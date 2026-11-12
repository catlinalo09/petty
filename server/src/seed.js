import './config/env.js';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';

// Catálogo inicial basado en el sitio original de Petty.
const products = [
  {
    name: 'Proteína saludable',
    description: 'Snack horneado con proteína natural, ideal como premio diario.',
    price: 20000,
    oldPrice: 25000,
    image: '/images/menu.1.jpg',
    category: 'menu',
    rating: 4.5,
  },
  {
    name: 'Proteína saludable',
    description: 'Porción individual con ingredientes naturales y sin conservantes.',
    price: 20000,
    oldPrice: 25000,
    image: '/images/menu.2.jpg',
    category: 'menu',
    rating: 4.5,
  },
  {
    name: 'Bowl de proteína',
    description: 'Bowl completo y balanceado para consentir a tu mascota.',
    price: 20000,
    oldPrice: 25000,
    image: '/images/menu.3.jpg',
    category: 'menu',
    rating: 5,
  },
  {
    name: 'Bowl de proteína',
    description: 'Mezcla nutritiva con textura suave, apta para todos los tamaños.',
    price: 20000,
    oldPrice: 25000,
    image: '/images/menu.4.jpg',
    category: 'menu',
    rating: 4.5,
  },
  {
    name: 'Bowl de proteína',
    description: 'Receta artesanal rica en fibra y proteína de alta calidad.',
    price: 20000,
    oldPrice: 25000,
    image: '/images/menu.5.jpg',
    category: 'menu',
    rating: 4.5,
  },
  {
    name: 'Bowl de proteína',
    description: 'Preparación fresca con vitaminas para el cuidado de tu peludo.',
    price: 20000,
    oldPrice: 25000,
    image: '/images/menu.6.jpg',
    category: 'menu',
    rating: 5,
  },
  {
    name: 'Mini croquetas artesanales',
    description: 'Croquetas horneadas con ingredientes hipoalergénicos.',
    price: 10000,
    oldPrice: 20000,
    image: '/images/producto.1.jpg',
    category: 'producto',
    rating: 4.5,
    featured: true,
  },
  {
    name: 'Deliciosos cupcakes',
    description: 'Cupcakes para mascotas con cobertura natural y sin azúcar añadida.',
    price: 10000,
    oldPrice: 20000,
    image: '/images/producto.2.jpg',
    category: 'producto',
    rating: 4.5,
    featured: true,
  },
  {
    name: 'Mini gelatinas',
    description: 'Gelatinas suaves elaboradas con frutas aptas para perros y gatos.',
    price: 10000,
    oldPrice: 20000,
    image: '/images/producto.3.jpg',
    category: 'producto',
    rating: 4.5,
    featured: true,
  },
  {
    name: 'Mini helados deliciosos',
    description: 'Helados refrescantes para mascotas, perfectos para días calurosos.',
    price: 10000,
    oldPrice: 20000,
    image: '/images/producto.4.jpg',
    category: 'producto',
    rating: 4.5,
    featured: true,
  },
];

async function seed() {
  await connectDB();

  const operations = products.map((product) => ({
    updateOne: {
      // La imagen identifica de forma única cada producto del catálogo inicial,
      // porque hay nombres repetidos (varios "Bowl de proteína").
      filter: { image: product.image },
      update: { $set: product },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations);

  console.log(
    `Seed completado: ${result.upsertedCount} nuevos, ${result.modifiedCount} actualizados, ${result.matchedCount} encontrados.`,
  );

  await mongoose.disconnect();
  console.log('Conexión cerrada.');
}

seed().catch(async (error) => {
  console.error('Error en el seed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
