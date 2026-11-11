export function notFound(_req, res) {
  res.status(404).json({ message: 'Recurso no encontrado' });
}

// Express 5 reenvía automáticamente los errores de handlers async.
export function errorHandler(err, _req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'El registro ya existe' });
  }

  console.error(err);

  return res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
}
