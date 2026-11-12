# Petty · Full Stack (React + Express + MongoDB)

Sitio de Petty (delicias artesanales para mascotas) migrado de HTML/CSS/JS estático a una
aplicación full stack:

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express 5
- **Base de datos:** MongoDB + Mongoose
- **Carrito** con `localStorage`, búsqueda de productos y formulario de contacto conectado a la API.

---

## Estructura del proyecto

```
proyectofinal/
├── client/                    # Frontend React (Vite)
│   ├── public/images/         # Imágenes (copia de /images)
│   ├── src/
│   │   ├── components/        # Header, Home, About, Menu, Products, Contact, Footer
│   │   ├── context/           # Carrito (React Context + localStorage)
│   │   ├── data/              # Catálogo de respaldo si la API no responde
│   │   ├── utils/             # Formato de precios COP
│   │   ├── api.js             # Cliente HTTP (fetch)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css         # Estilos originales + ajustes
│   ├── index.html
│   └── vite.config.js         # Proxy /api -> http://localhost:4000
├── server/                    # Backend Express
│   ├── src/
│   │   ├── config/            # Carga de .env y conexión a MongoDB
│   │   ├── controllers/       # Lógica de productos y mensajes
│   │   ├── middleware/        # Errores, requireDB, requireAdmin
│   │   ├── models/            # Esquemas Mongoose (Product, Message)
│   │   ├── routes/            # Rutas /api/products y /api/messages
│   │   ├── app.js             # Configuración de Express
│   │   ├── index.js           # Arranque + reintento de conexión
│   │   └── seed.js            # Datos iniciales
│   └── .env                   # Variables locales (no se sube a git)
├── images/                    # Imágenes originales (se conservan)
├── index.html / styles.css / script.js   # Versión estática anterior (referencia)
└── package.json               # Workspaces + scripts raíz
```

> Los archivos estáticos de la raíz (`index.html`, `styles.css`, `script.js`) se dejaron intactos
> como referencia. Cuando confirmes que la versión React funciona, puedes eliminarlos.

---

## 1. Requisitos

- **Node.js 20 o superior** (probado con Node 26).
- **MongoDB**, una de estas dos opciones:
  - **Local:** MongoDB Community en `mongodb://127.0.0.1:27017`.
  - **Atlas (nube):** una cadena `mongodb+srv://...` gratuita desde [MongoDB Atlas](https://www.mongodb.com/atlas).

Verifica Node:

```bash
node --version
```

> En Windows, si PowerShell bloquea `npm.ps1`, usa `npm.cmd` (por ejemplo `npm.cmd install`)
> o ejecuta una vez: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

---

## 2. Instalar dependencias

Desde la raíz del proyecto (instala frontend y backend a la vez gracias a los workspaces):

```bash
npm install
```

---

## 3. Configurar MongoDB

Edita **`server/.env`**:

### Opción A · MongoDB local

```env
MONGODB_URI=mongodb://127.0.0.1:27017/petty
```

Asegúrate de que el servicio de MongoDB esté iniciado. En Windows suele ser:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

Si no lo tienes instalado, descárgalo desde
<https://www.mongodb.com/try/download/community>.

### Opción B · MongoDB Atlas

1. Entra a <https://www.mongodb.com/atlas> y crea una cuenta (puedes usar Google).
2. Clic en **Create** → elige el plan **M0 Free** → proveedor y región más cercanos
   (por ejemplo AWS `us-east-1` o `sa-east-1`) → **Create Deployment**.
3. En **Database Access** → **Add New Database User**:
   - Método: **Password**.
   - Usuario y contraseña (guárdalos, los necesitarás en la URI).
   - Rol: **Read and write to any database**.
4. En **Network Access** → **Add IP Address**:
   - **Add Current IP Address** para tu equipo, o
   - `0.0.0.0/0` para permitir cualquier IP (solo para pruebas/demos).
5. En el cluster, clic en **Connect** → **Drivers** → **Node.js**.
   Copia la cadena, que se ve así:

   ```
   mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. Pega la cadena en `server/.env`, reemplazando usuario y contraseña, y agrega el
   nombre de la base de datos (`petty`) antes del `?`:

   ```env
   MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/petty?retryWrites=true&w=majority
   ```

7. Reinicia la API (`npm run dev`) y carga los datos:

   ```bash
   npm run seed
   ```

8. Verifica la conexión:

   ```bash
   Invoke-RestMethod http://localhost:4000/api/health
   # debe devolver "db": "connected"
   ```

> Si la contraseña tiene caracteres especiales (`@`, `#`, `/`, `:`, `?`, etc.) deben ir
> codificados en la URL (por ejemplo `@` → `%40`, `#` → `%23`).
>
> Atlas empieza con la base de datos vacía: por eso hay que ejecutar `npm run seed`.
> Si más adelante despliegas el backend (Render/Railway), agrega esa misma
> `MONGODB_URI` como variable de entorno del servicio.

### Variables disponibles

| Variable        | Descripción                                              | Valor por defecto                      |
| --------------- | -------------------------------------------------------- | -------------------------------------- |
| `PORT`          | Puerto de la API                                         | `4000`                                 |
| `MONGODB_URI`   | Cadena de conexión de MongoDB                            | `mongodb://127.0.0.1:27017/petty`      |
| `CLIENT_ORIGIN` | Orígenes extra permitidos por CORS (separados por coma)  | `http://localhost:5173`                |
| `ADMIN_TOKEN`   | Token para POST/PUT/DELETE. Vacío = endpoints abiertos   | vacío                                  |

---

## 4. Cargar datos iniciales (seed)

Con MongoDB disponible:

```bash
npm run seed
```

Inserta/actualiza los 10 productos del catálogo original (6 servicios + 4 productos).
Puedes ejecutarlo varias veces: no duplica registros (hace *upsert* por imagen).

---

## 5. Ejecutar en desarrollo

```bash
npm run dev
```

Esto levanta ambos procesos:

| Servicio | URL                     |
| -------- | ----------------------- |
| React    | http://localhost:5173   |
| API      | http://localhost:4000   |

El frontend llama a `/api/...` y Vite lo redirige a Express (sin problemas de CORS).

> Si MongoDB no está disponible, la API **igual arranca** y reintenta la conexión cada 15 s.
> Mientras tanto responde `503` y el frontend muestra el catálogo local con un aviso.

---

## 6. Endpoints de la API

### Productos

| Método   | Ruta                 | Descripción                                  |
| -------- | -------------------- | -------------------------------------------- |
| `GET`    | `/api/products`      | Lista productos activos                      |
| `GET`    | `/api/products/:id`  | Obtiene un producto                          |
| `POST`   | `/api/products`      | Crea un producto (requiere `x-admin-token` si está configurado) |
| `PUT`    | `/api/products/:id`  | Actualiza un producto                        |
| `DELETE` | `/api/products/:id`  | Elimina un producto                          |

Filtros opcionales: `?category=menu`, `?category=producto`, `?q=galleta`, `?limit=10`.

### Mensajes de contacto

| Método  | Ruta                         | Descripción                              |
| ------- | ---------------------------- | ---------------------------------------- |
| `POST`  | `/api/messages`              | Guarda un mensaje del formulario (público) |
| `GET`   | `/api/messages`              | Lista mensajes (requiere admin)          |
| `PATCH` | `/api/messages/:id/leido`    | Marca como leído (requiere admin)        |

### Salud

`GET /api/health` → `{ "ok": true, "db": "connected" | "disconnected" }`

### Ejemplos con PowerShell

```powershell
# Listar productos
Invoke-RestMethod http://localhost:4000/api/products

# Crear un producto (si ADMIN_TOKEN está vacío no hace falta cabecera)
$body = @{
  name        = "Galletas de avena"
  description = "Galletas crujientes para perros"
  price       = 12000
  oldPrice    = 15000
  image       = "/images/galletas.jpg"
  category    = "producto"
  rating      = 4.5
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/products `
  -ContentType "application/json" -Body $body `
  -Headers @{ "x-admin-token" = "TU_TOKEN" }

# Enviar mensaje de contacto
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/messages `
  -ContentType "application/json" `
  -Body (@{ name = "Ana"; email = "ana@mail.com"; phone = "3001234567"; message = "Hola" } | ConvertTo-Json)
```

---

## 7. Producción

```bash
npm run build          # genera client/dist
npm run start:prod     # NODE_ENV=production + Express sirve el build de React
```

La app completa queda en <http://localhost:4000>. Express sirve `client/dist` y mantiene la API
en `/api`.

Para cambiar los orígenes permitidos en producción, ajusta `CLIENT_ORIGIN` en `server/.env`.
Las peticiones del **mismo origen** (el navegador usando el mismo dominio que la API) siempre se
aceptan, así que también funciona detrás de un túnel o dominio propio sin tocar esa variable.

---

## 8. Problemas comunes

| Síntoma                                             | Solución                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| `MongoDB no disponible` en la consola               | Inicia MongoDB local o revisa `MONGODB_URI` en `server/.env`.            |
| `503` en `/api/products`                            | La API está corriendo pero sin base de datos; revisa el paso 3.          |
| El frontend muestra el catálogo local               | La API no respondió; revisa la consola del servidor y pulsa "reintentar". |
| `npm.ps1 no se puede cargar`                        | Usa `npm.cmd` o habilita la política de ejecución solo para la sesión.   |
| Cambios en `server/.env` no se aplican              | Reinicia `npm run dev` (dotenv se lee al arrancar).                      |
| El carrito no se guarda                             | Revisa que el navegador permita `localStorage` (modo normal, no incógnito). |

---

## 9. Siguientes pasos sugeridos

- Autenticación de administrador (JWT) para el panel de productos y mensajes.
- Panel de administración en React (`/admin`) para CRUD de productos y bandeja de mensajes.
- Pasarela de pagos para el carrito.
- Despliegue: frontend en Vercel/Netlify y API en Render/Railway + MongoDB Atlas.
