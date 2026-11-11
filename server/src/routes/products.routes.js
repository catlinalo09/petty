import { Router } from 'express';
import { requireDB } from '../middleware/requireDB.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';

const router = Router();

router.use(requireDB);

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
