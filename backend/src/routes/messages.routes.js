import { Router } from 'express';
import { requireDB } from '../middleware/requireDB.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  createMessage,
  listMessages,
  markMessageAsRead,
} from '../controllers/messages.controller.js';

const router = Router();

router.use(requireDB);

// Público: formulario de contacto
router.post('/', createMessage);

// Administración
router.get('/', requireAdmin, listMessages);
router.patch('/:id/leido', requireAdmin, markMessageAsRead);

export default router;
