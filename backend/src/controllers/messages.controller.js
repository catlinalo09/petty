import Message from '../models/Message.js';

const FIELDS = ['name', 'email', 'phone', 'message'];

const pick = (body, fields) =>
  Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

export async function createMessage(req, res) {
  const payload = pick(req.body ?? {}, FIELDS);

  if (!payload.name || !payload.email) {
    return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
  }

  const message = await Message.create(payload);

  return res.status(201).json({
    message: 'Mensaje recibido. ¡Gracias por escribirnos!',
    data: message,
  });
}

export async function listMessages(req, res) {
  const { status, limit } = req.query;
  const filter = {};

  if (status && ['nuevo', 'leido'].includes(status)) {
    filter.status = status;
  }

  const max = Math.min(Number(limit) || 50, 200);
  const messages = await Message.find(filter).sort({ createdAt: -1 }).limit(max);

  return res.json(messages);
}

export async function markMessageAsRead(req, res) {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { status: 'leido' },
    { new: true, runValidators: true },
  );

  if (!message) {
    return res.status(404).json({ message: 'Mensaje no encontrado' });
  }

  return res.json(message);
}
