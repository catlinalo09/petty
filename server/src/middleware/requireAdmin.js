/**
 * Protege los endpoints de administración con la cabecera x-admin-token.
 * Si ADMIN_TOKEN está vacío, no se exige token (útil solo en desarrollo).
 */
export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return next();
  }

  if (req.get('x-admin-token') !== expected) {
    return res.status(401).json({ message: 'No autorizado: falta o no coincide x-admin-token' });
  }

  return next();
}
