import mongoose from 'mongoose';
import Product from '../models/Product.js';

const CATEGORIES = ['menu', 'producto'];
const EDITABLE_FIELDS = [
  'name',
  'description',
  'price',
  'oldPrice',
  'image',
  'category',
  'rating',
  'featured',
  'active',
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pick = (body, fields) =>
  Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

export async function listProducts(req, res) {
  const { category, q, limit } = req.query;
  const filter = { active: true };

  if (category) {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Categoría inválida. Usa "menu" o "producto".' });
    }
    filter.category = category;
  }

  if (q) {
    filter.name = new RegExp(escapeRegex(String(q).trim()), 'i');
  }

  const max = Math.min(Number(limit) || 100, 100);
  const products = await Product.find(filter).sort({ createdAt: 1 }).limit(max);

  return res.json(products);
}

export async function getProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  const product = await Product.findOne({ _id: req.params.id, active: true });

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json(product);
}

export async function createProduct(req, res) {
  const payload = pick(req.body ?? {}, EDITABLE_FIELDS);
  const product = await Product.create(payload);
  return res.status(201).json(product);
}

export async function updateProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  const payload = pick(req.body ?? {}, EDITABLE_FIELDS);
  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json(product);
}

export async function deleteProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.status(204).send();
}
