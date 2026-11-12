// En desarrollo Vite hace proxy de /api hacia Express (ver vite.config.js).
// En producción puedes definir VITE_API_URL (por ejemplo, https://api.tudominio.com/api).
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('no se pudo conectar con el servidor');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `error ${response.status}`);
  }

  return data;
}

export function fetchProducts() {
  return request('/products');
}

export function sendMessage(payload) {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
