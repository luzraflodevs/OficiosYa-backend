# OficiosYa — Backend API

API REST desarrollada con **NestJS**, **TypeScript**, **Prisma ORM** y **PostgreSQL** para la plataforma de gestión y contratación de servicios de oficios **OficiosYa**.

---

## Tecnologías Utilizadas

* **Framework:** NestJS (Node.js + TypeScript)
* **ORM y Base de Datos:** Prisma ORM 7 + PostgreSQL
* **Autenticación y Seguridad:** JWT (`@nestjs/jwt`) + Encriptación de contraseñas (`bcrypt`)
* **Validación de Datos:** `class-validator` y `class-transformer` (DTOs)
* **Pruebas de API:** Colección de Postman (`postman/collections/OficiosYa-backend.postman_collection.json`)

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura modular organizada en `src/modules/`:

```text
OficiosYa-backend/
├── postman/
│   └── collections/
│       └── OficiosYa-backend.postman_collection.json
├── prisma/
│   ├── migrations/
│   ├── datos-iniciales.sql
│   └── schema.prisma
├── src/
│   ├── generated/
│   ├── modules/
│   │   ├── app/
│   │   ├── auth/
│   │   ├── contactos/
│   │   ├── oficios/
│   │   ├── prisma/
│   │   ├── profesionales/
│   │   ├── resenas/
│   │   ├── servicios/
│   │   └── usuarios/
│   └── main.ts
├── .env.example
├── package.json
├── prisma.config.ts
└── tsconfig.json
```


### Descripción de Módulos
* **`auth`**: Registro e inicio de sesión de usuarios con encriptación de contraseñas (`bcrypt`) y generación de tokens JWT.
* **`prisma`**: Módulo y servicio global de conexión a PostgreSQL mediante Prisma ORM.
* **`usuarios`**: Gestión de usuarios de la plataforma (clientes y profesionales) con validaciones DTO y borrado lógico.
* **`profesionales`**: Administración de perfiles profesionales, matrícula, descripción y estado activo.
* **`oficios`**: Catálogo de rubros y especialidades disponibles en la plataforma.
* **`servicios`**: Publicación y gestión de servicios ofrecidos por los profesionales.
* **`resenas`**: Calificaciones y comentarios de clientes sobre servicios contratados.
* **`contactos`**: Solicitudes de contacto y presupuestos entre clientes y profesionales.

---

## Instalación y Configuración Local

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd OficiosYa-backend
npm install
```

### 2. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto tomando como plantilla `.env.example`:
```bash
cp .env.example .env
```
Completar las variables requeridas en `.env`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/oficiosya?schema=public"
JWT_SECRET="tu_clave_secreta_jwt"
PORT=3000
```

### 3. Generar el cliente de Prisma y aplicar migraciones
```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Cargar datos iniciales de prueba (Seed SQL)
Ejecutar el script `prisma/datos-iniciales.sql` desde pgAdmin o mediante `psql` para poblar las tablas con usuarios, oficios, profesionales, servicios, reseñas y contactos de prueba.

### 5. Levantar el servidor
```bash
# Modo desarrollo
npm run start:dev

# Compilación y producción
npm run build
npm run start:prod
```

---


## Endpoints Principales

| Módulo | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Registrar un nuevo usuario en la plataforma |
| **Auth** | `POST` | `/auth/login` | Iniciar sesión con correo y contraseña |
| **Usuarios** | `GET` / `POST` / `PATCH` / `DELETE` | `/usuarios` | CRUD de usuarios con borrado lógico |
| **Profesionales** | `GET` / `POST` / `PATCH` / `DELETE` | `/profesionales` | CRUD de perfiles profesionales |
| **Oficios** | `GET` / `POST` / `PATCH` / `DELETE` | `/oficios` | CRUD de categorías de oficios |
| **Servicios** | `GET` / `POST` / `PATCH` / `DELETE` | `/servicios` | CRUD de servicios publicados |
| **Reseñas** | `GET` / `POST` / `PATCH` / `DELETE` | `/resenas` | CRUD de valoraciones y comentarios |
| **Contactos** | `GET` / `POST` / `PATCH` / `DELETE` | `/contactos` | CRUD de solicitudes de contacto |

---

## Pruebas con Postman

Importar el archivo `postman/collections/OficiosYa-backend.postman_collection.json` en Postman para probar todos los endpoints documentados, incluyendo el flujo completo de registro, login con JWT y operaciones CRUD.

---


## Equipo de Desarrollo


* **Luz Priscila González Raflo**
* **Tobias Moschino Molina**
* **Camila Monetti**
