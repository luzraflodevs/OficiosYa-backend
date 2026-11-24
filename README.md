# OficiosYa — Backend API

API RESTful desarrollada con **NestJS**, **Prisma ORM** y **PostgreSQL** para la plataforma **OficiosYa**, destinada a conectar usuarios que requieren servicios técnicos o del hogar con profesionales verificados por rubro y ubicación.

## Equipo de Desarrollo

* **González Raflo, Luz Priscila**
* **Moschino Molina, Tobías**
* **Monetti, Camila**

## Stack Tecnológico

* **Framework:** NestJS (TypeScript)
* **Base de Datos:** PostgreSQL
* **ORM y Migraciones:** Prisma ORM
* **Validación de Datos:** `class-validator` y `class-transformer`
* **Pruebas de Endpoints:** Postman

## Arquitectura y Módulos del Sistema

El proyecto sigue una arquitectura modular por dominio, estandarizada al 100% en español tanto en el código fuente como en el esquema relacional de la base de datos:

```text
OficiosYa-backend/
├── prisma/
│   ├── migrations/        # Historial de migraciones SQL
│   └── schema.prisma      # Modelado relacional de las 7 entidades
├── src/
│   ├── modules/
│   │   ├── auth/          # Registro y gestión de credenciales
│   │   ├── contactos/     # Consultas y mensajes de contacto
│   │   ├── oficios/       # Catálogo de rubros y especialidades
│   │   ├── profesionales/ # Perfiles de trabajadores y matrículas
│   │   ├── resenas/       # Calificaciones y comentarios sobre servicios
│   │   ├── servicios/     # Publicaciones de servicios ofrecidos
│   │   └── usuarios/      # Gestión de clientes, profesionales y administradores
│   ├── prisma/            # PrismaService y PrismaModule globales
│   └── main.ts            # Punto de entrada y configuración de ValidationPipe
└── .env.example           # Plantilla de variables de entorno
```

### Entidades del Modelo de Datos

1. **`ubicaciones`**: Localidades, provincias y códigos postales de cobertura.
2. **`usuarios`**: Cuentas registradas en la plataforma con roles (`CLIENTE`, `PROFESIONAL`, `ADMIN`).
3. **`profesionales`**: Información extendida del prestador (descripción, matrícula, disponibilidad y ubicación).
4. **`oficios`**: Categorías de oficios disponibles (ej. Electricidad, Plomería, Gasista, Carpintería).
5. **`servicios`**: Servicios publicados por cada profesional asociados a un oficio y tarifa.
6. **`resenas`**: Valoraciones (1 a 5) y comentarios realizados por usuarios sobre servicios contratados.
7. **`contactos`**: Mensajes enviados a través del formulario de contacto de la plataforma.

## Requisitos Previos

* **Node.js** (v18 o superior)
* **npm**
* **PostgreSQL** (v14 o superior) en ejecución local

## Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/luzraflodevs/OficiosYa-backend.git](https://github.com/luzraflodevs/OficiosYa-backend.git)
   cd OficiosYa-backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz del proyecto con los datos de conexión a tu instancia local de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/oficiosya_db?schema=public"
   PORT=4000
   ```

4. **Ejecutar migraciones y generar el cliente Prisma:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Levantar el servidor en modo desarrollo:**
   ```bash
   npm run start:dev
   ```
   El servidor quedará disponible en `http://localhost:4000`.

## Endpoints Principales

Todos los recursos cuentan con validación automática mediante DTOs (`ValidationPipe` global) y operaciones CRUD completas:

| Recurso | Base URL | Métodos Soportados |
| :--- | :--- | :--- |
| **Autenticación** | `/auth` | `GET`, `POST`, `PATCH`, `DELETE` |
| **Usuarios** | `/usuarios` | `GET`, `POST`, `PATCH`, `DELETE` |
| **Profesionales** | `/profesionales` | `GET`, `POST`, `PATCH`, `DELETE` |
| **Oficios** | `/oficios` | `GET`, `POST`, `PATCH`, `DELETE` |
| **Servicios** | `/servicios` | `GET`, `POST`, `PATCH`, `DELETE` |
| **Reseñas** | `/resenas` | `GET`, `POST`, `PATCH`, `DELETE` |
| **Contactos** | `/contactos` | `GET`, `POST`, `PATCH`, `DELETE` |

## Flujo de Trabajo Git

* **`main`**: Rama principal de producción / entregas consolidadas.
* **`dev`**: Rama de integración donde se mergean las funcionalidades y documentación aprobadas.
* **`feature/*`**: Ramas destinadas al desarrollo de nuevos módulos, base de datos o funcionalidades.
* **`docs/*`**: Ramas destinadas exclusivamente a la documentación del proyecto.