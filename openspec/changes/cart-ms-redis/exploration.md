## Exploration: Implementación de cart-ms con Redis

### Current State
Actualmente el sistema cuenta con `auth-ms` (PostgreSQL) y `catalog-ms` (MongoDB), expuestos a través de `client-gateway` usando RabbitMQ como bus de mensajes. Todo está orquestado con Docker Compose. No existe aún manejo de estado para el carrito de compras.

### Affected Areas
- `compose.yml` — Necesita la adición del contenedor `redis-server` y el nuevo microservicio `cart-ms`.
- `backend/cart-ms/` — Nuevo directorio para el microservicio NestJS. Requerirá dependencias de Redis (`ioredis` o `redis`), configuración de RabbitMQ y lógica de carrito.
- `backend/client-gateway/src/cart/` — Nuevo módulo en el gateway para exponer los endpoints REST (`GET`, `POST`, `DELETE` del carrito) hacia el frontend, y enrutar por RMQ al `cart-ms`.
- `frontend/lib/` (Futuro) — Consumo de los nuevos endpoints del carrito.

### Approaches
1. **NestJS + ioredis + RabbitMQ (Recomendado)** — El microservicio se conecta a RabbitMQ para escuchar eventos del Gateway, y usa `ioredis` para persistir los carritos con un TTL (Time To Live).
   - Pros: Alto rendimiento, expiración automática de carritos abandonados, se alinea con la arquitectura actual basada en RMQ.
   - Cons: Requiere gestionar la conexión a Redis manualmente o mediante un módulo de terceros.
   - Effort: Medium

2. **Redis como Transporte y Storage** — Usar Redis tanto para caché como para el bus de mensajes del microservicio.
   - Pros: Menos piezas de infraestructura.
   - Cons: Rompe el estándar del proyecto que ya usa RabbitMQ como event bus central.
   - Effort: Medium

### Recommendation
**Aproximación 1 (NestJS + ioredis + RabbitMQ)**. Mantiene la consistencia del bus de eventos (RabbitMQ) mientras aprovecha la volatilidad y velocidad de Redis exclusivamente como base de datos de estado clave-valor para el carrito.

### Risks
- **Conectividad:** Asegurar que `cart-ms` se levante solo cuando `redis-server` y `rabbit-server` estén listos en `compose.yml`.
- **Estructura de Datos:** Definir correctamente si el carrito guarda objetos completos o solo IDs de producto (recomendado guardar el snapshot del precio para evitar problemas si el precio en el catálogo cambia).

### Ready for Proposal
Yes. La arquitectura está clara y las responsabilidades del nuevo servicio están bien delimitadas.
