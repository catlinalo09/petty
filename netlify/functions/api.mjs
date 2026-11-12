import serverless from 'serverless-http';
import app from '../../backend/src/app.js';
import { connectDB } from '../../backend/src/config/db.js';

const expressHandler = serverless(app);

const FUNCTION_PREFIX = '/.netlify/functions/api';

export async function handler(event, context) {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
  } catch (error) {
    
    console.error(`MongoDB no disponible: ${error.message}`);
  }

  
  let path = event.path || '/';

  if (path.startsWith(FUNCTION_PREFIX)) {
    path = path.slice(FUNCTION_PREFIX.length) || '/';
  }

  if (!path.startsWith('/api')) {
    path = `/api${path.startsWith('/') ? path : `/${path}`}`;
  }

  event.path = path;

  return expressHandler(event, context);
}
