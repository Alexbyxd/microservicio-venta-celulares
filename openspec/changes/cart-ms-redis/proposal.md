# Proposal: Implementación de Cart-ms con Redis

## Intent
Crear el microservicio `cart-ms` para manejar el estado temporal del carrito de compras del usuario utilizando Redis. El objetivo es permitir a los usuarios agregar, eliminar y actualizar productos en su carrito, manteniendo el estado entre sesiones mediante persistencia rápida y volátil.

## Scope

### In Scope
- Agregar contenedor `redis-server` en `compose.yml`.
- Crear nuevo microservicio NestJS `cart-ms` conectado a RabbitMQ y Redis (`ioredis`).
- Implementar operaciones CRUD básicas para el carrito (agregar ítem, remover ítem, actualizar cantidad, vaciar carrito, obtener carrito).
- Exponer endpoints REST en `client-gateway` bajo la ruta `/cart`.
- Enrutar peticiones HTTP desde el Gateway hacia `cart-ms` vía RabbitMQ.

### Out of Scope
- Integración en el frontend (UI del carrito).
- Sincronización de precios en tiempo real con el catálogo (se guardará el snapshot del precio al agregar al carrito).
- Persistencia a largo plazo del carrito en base de datos relacional.

## Capabilities

### New Capabilities
- `shopping-cart`: Gestión temporal de ítems seleccionados por el usuario para su futura compra, incluyendo expiración automática (TTL).

### Modified Capabilities
Ninguna.

## Approach
Se construirá `cart-ms` usando NestJS. Se utilizará `ioredis` para la comunicación con Redis, almacenando el estado del carrito (con un TTL para expirar carritos inactivos). La comunicación con el resto del sistema (específicamente `client-gateway`) será puramente asíncrona/RPC usando RabbitMQ.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `compose.yml` | Modified | Agregar `redis-server` y `cart-ms`. |
| `backend/cart-ms/` | New | Nuevo microservicio NestJS. |
| `backend/client-gateway/src/cart/` | New | Módulo en el gateway para enrutamiento. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Inconsistencia de dependencias (Redis no listo) | Medium | Usar `depends_on` adecuado en `compose.yml`. |
| Pérdida de datos por reinicio | Low | Aceptable para carritos temporales; se puede configurar persistencia AOF en Redis si es crítico. |

## Rollback Plan
- Revertir cambios en `compose.yml`.
- Eliminar la carpeta `backend/cart-ms`.
- Eliminar el módulo `cart` de `client-gateway` y revertir su importación en `app.module.ts`.

## Dependencies
- Docker y Docker Compose (para levantar Redis).

## Success Criteria
- [ ] Endpoints `/cart` en Gateway responden exitosamente y delegan a RabbitMQ.
- [ ] Carrito mantiene estado si el Gateway o `cart-ms` se reinician (los datos viven en Redis).
- [ ] Se pueden agregar, eliminar y listar ítems por usuario/sesión.