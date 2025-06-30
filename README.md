# Prueba Técnica Ant Pack

## Descripción

API RESTful para registro, autenticación, consulta de restaurantes cercanos y gestión de transacciones históricas.  
Desarrollada con NestJS, MongoDB y autenticación JWT.

Versión desplegada en fly.io:
[https://ant-pack-test.fly.dev/api-docs](https://ant-pack-test.fly.dev/api-docs)

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

## Decisiones técnicas

- **NestJS**: Se eligió NestJS por su arquitectura modular, soporte nativo para TypeScript, integración sencilla con MongoDB y buenas prácticas para construir APIs escalables y mantenibles.
- **MongoDB + Mongoose**: MongoDB es ideal para prototipos y aplicaciones que requieren flexibilidad en el esquema. Mongoose facilita la validación y modelado de datos, dado que en esta aplicación no neecsitamos data relacional ni transacciones que afecten varias entidades al tiempo.
- **Autenticación JWT**: Se implementó autenticación basada en JWT para proteger los endpoints y permitir escalabilidad (stateless auth).
- **Separación de módulos**: Cada dominio principal (usuarios, autenticación, restaurantes, transacciones) está en su propio módulo para facilitar el mantenimiento y la escalabilidad.
- **Variables de entorno**: Se usan variables de entorno para credenciales y secretos, evitando exponer información sensible en el código fuente.
- **Swagger**: Se incluyó documentación Swagger para facilitar el consumo y prueba de la API.
- **Pruebas unitarias**: Se agregaron pruebas unitarias para controladores y servicios clave, usando mocks para dependencias externas y bases de datos.
- **Persistencia de transacciones**: Cada búsqueda de restaurantes por un usuario se almacena como una transacción, permitiendo un historial auditable.
- **Integración con API pública**: Para obtener restaurantes cercanos se utiliza la API pública de Yelp, pero el diseño permite cambiar fácilmente a otro proveedor si es necesario.
- **Soporte Docker**: Se provee un `Dockerfile` y `docker-compose.yaml` para facilitar la ejecución y despliegue local o en la nube.

---

## Documentación Swagger

La documentación interactiva está disponible en:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)
o en:
[https://ant-pack-test.fly.dev/api-docs](https://ant-pack-test.fly.dev/api-docs)

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