# 🏗️ Arquitectura y Comunicación (Microservicios)

## Topología de Servicios
Cada microservicio debe ser independiente y autónomo. El monorepo solo sirve para agrupar el desarrollo y compartir tipos si es necesario.

### Servicios Actuales
1.  **Client Gateway**: API REST expuesta al frontend. Transforma peticiones HTTP en mensajes RabbitMQ.
2.  **Auth MS**: Microservicio encargado de la autenticación, usuarios y seguridad. Conexión a PostgreSQL (auth db).

## Comunicación vía RabbitMQ
- **Request-Response**: Usado para validaciones y login (`this.client.send`).
- **Event-Based**: Usado para logs o notificaciones asíncronas (`this.client.emit`).

### Protocolo de Mensajes
Los patrones deben ser descriptivos:
- `auth.login`: Login de usuario.
- `auth.register`: Registro de usuario.
- `auth.validate`: Validación de token/sesión.

## Desacoplamiento
- Los microservicios NUNCA hablan entre sí directamente; siempre a través del Broker (RabbitMQ).
- Cada microservicio gestiona su propia base de datos. NUNCA compartas esquemas de DB entre servicios.
