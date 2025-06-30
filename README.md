# Prueba Técnica Ant Pack

## Descripción

API RESTful para registro, autenticación, consulta de restaurantes cercanos y gestión de transacciones históricas.  
Desarrollada con NestJS, MongoDB y autenticación JWT.

---

## Endpoints

### Autenticación

#### Registrar usuario

**POST** `/auth/register`

**Body:**
```json
{
  "username": "string",
  "password": "string",
  "city": "string (opcional)",
  "status": "string (opcional)"
}
```
**Response:**
```json
{
  "response": "user created successfully"
}
```

---

#### Login

**POST** `/auth/login`

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "username": "string",
  "access_token": "jwt-token"
}
```

---

#### Perfil de usuario

**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```
**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "city": "string",
  "status": "string"
}
```

---

### Usuarios

#### Obtener usuario por username

**GET** `/users/:id`

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "password": "string",
  "city": "string",
  "status": "string"
}
```

---

### Restaurantes

#### Buscar restaurantes cercanos

**GET** `/restaurants/nearby?city={city}&lat={lat}&lon={lon}`

**Headers:**
```
Authorization: Bearer <access_token>
```
**Query Params:**
- `city` (string, opcional)
- `lat` (string, opcional)
- `lon` (string, opcional)

**Response:**
```json
[
  {
    "name": "string",
    "image_url": "string",
    "is_closed": "boolean",
    "url": "string",
  }
]
```

---

### Transacciones

#### Consultar historial de transacciones

**GET** `/transactions/history`

**Headers:**
```
Authorization: Bearer <access_token>
```
**Response:**
```json
[
  {
    "userId": "string",
    "city": "string",
    "coordinates": "string",
    "metadata": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

---

<!-- #### Crear transacción

**POST** `/transactions`

**Body:**
```json
{
  "userId": "string",
  "city": "string",
  "coordinates": "string",
  "metadata": {}
}
```
**Response:**
```json
{
  "userId": "string",
  "city": "string",
  "coordinates": "string",
  "metadata": "string"
}
``` -->

---

## Notas

- Todos los endpoints protegidos requieren el header `Authorization: Bearer <access_token>`.
- El endpoint de restaurantes utiliza la API de Yelp, asegúrate de tener la variable de entorno `YELP_API_KEY` configurada.
- El endpoint de transacciones permite consultar y registrar búsquedas de restaurantes realizadas por los usuarios.

---

## Documentación Swagger

La documentación interactiva está disponible en:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Instalación y ejecución

```bash
npm install
npm run start:dev
```

---

## Ejecución con Docker y Docker Compose

1. **Copia el archivo de variables de entorno:**

   ```bash
   cp .env.example .env
   ```

2. **Edita `.env`** y completa los valores necesarios (`MONGO_URI`, `YELP_API_KEY`, `JWT_SECRET`, etc).

3. **Construye y levanta los servicios:**

   ```bash
   docker-compose up --build
   ```

   Esto levantará tanto la aplicación NestJS como una instancia de MongoDB (si tu `docker-compose.yml` la incluye).

4. **La API estará disponible en** [http://localhost:3000](http://localhost:3000)

---

## Pruebas

```bash
npm run test
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores necesarios:

```
MONGO_URI=
YELP_API_KEY=
JWT_SECRET=
JWT_EXPIRATION=
```