-- ============================================================================
-- OficiosYa - Datos iniciales (5 o más registros por tabla)
-- Ejecutar en pgAdmin (Query Tool) sobre la base oficiosya_db
-- DESPUÉS de aplicar la migración con: npx prisma migrate dev
--
-- Todos los usuarios de ejemplo tienen la contraseña: Oficios2026
-- (en la base se guarda solo el hash de bcrypt, nunca la contraseña)
-- ============================================================================

-- 1. Ubicaciones (no tiene módulo en la API: se cargan solo por SQL)
INSERT INTO "ubicaciones" ("localidad", "provincia", "codigo_postal") VALUES
  ('San Miguel de Tucumán', 'Tucumán', '4000'),
  ('Yerba Buena', 'Tucumán', '4107'),
  ('Tafí Viejo', 'Tucumán', '4103'),
  ('Banda del Río Salí', 'Tucumán', '4109'),
  ('Concepción', 'Tucumán', '4146');

-- 2. Usuarios (5 profesionales + 2 clientes)
INSERT INTO "usuarios" ("nombre", "apellido", "email", "contrasena_hash", "telefono", "rol") VALUES
  ('Carlos', 'Gómez', 'carlos.gomez@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', '3814100001', 'PROFESIONAL'),
  ('María', 'López', 'maria.lopez@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', '3814100002', 'PROFESIONAL'),
  ('Jorge', 'Fernández', 'jorge.fernandez@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', '3814100003', 'PROFESIONAL'),
  ('Lucía', 'Martínez', 'lucia.martinez@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', '3814100004', 'PROFESIONAL'),
  ('Diego', 'Ruiz', 'diego.ruiz@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', '3814100005', 'PROFESIONAL'),
  ('Ana', 'Pérez', 'ana.perez@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', '3814100006', 'CLIENTE'),
  ('Sofía', 'Díaz', 'sofia.diaz@mail.com', '$2b$12$6iM7iygwogO5FvbvRG/M/uj1F03Rmua6ARagerPS73IvEkcce2pGS', NULL, 'CLIENTE');

-- 3. Oficios
INSERT INTO "oficios" ("nombre", "descripcion") VALUES
  ('Electricidad', 'Instalaciones eléctricas, reparaciones y tableros.'),
  ('Plomería', 'Cañerías, pérdidas de agua, sanitarios y griferías.'),
  ('Gasista', 'Instalación y control de artefactos y cañerías de gas.'),
  ('Carpintería', 'Muebles a medida, puertas, ventanas y reparaciones en madera.'),
  ('Pintura', 'Pintura de interiores, exteriores y tratamiento de humedad.');

-- 4. Profesionales (cada uno es un usuario con rol PROFESIONAL)
INSERT INTO "profesionales" ("usuario_id", "ubicacion_id", "descripcion", "matricula") VALUES
  (1, 1, 'Electricista matriculado con 10 años de experiencia.', 'ELEC-1234'),
  (2, 2, 'Plomera especializada en pérdidas y destapaciones.', NULL),
  (3, 3, 'Gasista matriculado, habilitaciones y controles.', 'GAS-5678'),
  (4, 4, 'Carpintera, muebles a medida y restauraciones.', NULL),
  (5, 5, 'Pintor de obra, interiores y exteriores.', NULL);

-- 5. Servicios
INSERT INTO "servicios" ("profesional_id", "oficio_id", "titulo", "descripcion", "precio") VALUES
  (1, 1, 'Instalación de tablero eléctrico', 'Armado e instalación de tablero con disyuntor y térmicas.', 85000.00),
  (2, 2, 'Reparación de pérdidas de agua', 'Detección y reparación de pérdidas en cañerías y griferías.', 30000.00),
  (3, 3, 'Instalación de calefactor', 'Conexión y prueba de calefactor con certificado.', 45000.00),
  (4, 4, 'Placard a medida', 'Diseño y armado de placard en melamina o madera.', 250000.00),
  (5, 5, 'Pintura de habitación', 'Pintura de paredes y techo de una habitación estándar.', 60000.00);

-- 6. Reseñas (las hacen los clientes sobre los servicios)
INSERT INTO "resenas" ("servicio_id", "usuario_id", "calificacion", "comentario") VALUES
  (1, 6, 5, 'Excelente trabajo, muy prolijo y puntual.'),
  (2, 6, 4, 'Resolvió la pérdida rápido.'),
  (3, 7, 5, 'Muy profesional, explicó todo.'),
  (4, 7, 4, 'Quedó muy lindo el placard.'),
  (5, 6, 3, 'Buen trabajo, pero tardó un día más.');

-- 7. Contactos (mensajes del formulario de contacto)
INSERT INTO "contactos" ("nombre", "email", "asunto", "mensaje") VALUES
  ('Pedro Sosa', 'pedro.sosa@mail.com', 'Consulta general', 'Quisiera saber cómo me registro como profesional.'),
  ('Laura Ríos', 'laura.rios@mail.com', 'Problema con mi cuenta', 'No puedo iniciar sesión con mi correo electrónico.'),
  ('Martín Paz', 'martin.paz@mail.com', 'Sugerencia', 'Estaría bueno poder filtrar profesionales por localidad.'),
  ('Elena Vera', 'elena.vera@mail.com', 'Nuevo oficio', 'Podrían agregar el oficio de jardinería al listado.'),
  ('Raúl Medina', 'raul.medina@mail.com', 'Reclamo', 'Un profesional no se presentó en el horario acordado.');
