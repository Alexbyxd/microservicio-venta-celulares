# Design: Implementación de Cart-ms con Redis

## Technical Approach
Se implementará un microservicio NestJS `cart-ms` que actúa como consumidor de RabbitMQ para peticiones RPC del Gateway. Utilizará `ioredis` para la persistencia rápida del estado del carrito. El Gateway expondrá endpoints REST que mapean directamente a patrones de mensajes de RabbitMQ.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Persistencia | Redis (`ioredis`) | MongoDB, PostgreSQL | Alta velocidad de lectura/escritura y soporte nativo de TTL para carritos volátiles. |
| Comunicación | RabbitMQ RPC | HTTP Directo, gRPC | Consistencia con la arquitectura actual del proyecto; permite desacoplamiento y escalabilidad. |
| Estructura de Datos | JSON String en Redis | Redis Hashes | Simplicidad al manejar objetos anidados (productos con specs) y facilidad de recuperación completa del carrito. |

## Data Flow

    Client (Browser) ──[HTTP]─→ Client Gateway ─[RMQ RPC]─→ Cart MS ──→ Redis (Store/Get)
         ↑                         │                          │
         └──────────[JSON]─────────┴──────────[JSON]──────────┘

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `compose.yml` | Modify | Agregar `redis-server` y `cart-ms`. |
| `backend/cart-ms/package.json` | Create | Definir dependencias (`@nestjs/microservices`, `amqplib`, `ioredis`). |
| `backend/cart-ms/src/app.module.ts` | Create | Módulo raíz configurando RMQ y Redis. |
| `backend/cart-ms/src/cart/cart.service.ts` | Create | Lógica de negocio (CRUD en Redis). |
| `backend/cart-ms/src/cart/cart.controller.ts` | Create | Manejador de eventos de RabbitMQ. |
| `backend/client-gateway/src/cart/cart.controller.ts` | Create | Endpoints REST públicos. |
| `backend/client-gateway/src/cart/cart.module.ts` | Create | Registro del Proxy de RabbitMQ para el carrito. |

## Interfaces / Contracts

```typescript
// Cart Item Structure
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Redis Key Format: cart:user-{userId}
// Payload for RMQ patterns:
// 'cart.get'      -> { userId: string }
// 'cart.add'      -> { userId: string, item: CartItem }
// 'cart.update'   -> { userId: string, productId: string, quantity: number }
// 'cart.remove'   -> { userId: string, productId: string }
// 'cart.clear'    -> { userId: string }
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | CartService | Mocks de Redis para validar lógica de agregado y cálculo de totales. |
| Integration | CartController | Validar comunicación RMQ -> Service -> Redis usando `Test.createTestingModule`. |
| E2E | Gateway -> Cart | Test de integración real del flujo desde HTTP hasta la persistencia en un Redis de prueba. |

## Migration / Rollout
No migration required. Redis se inicializará vacío y los carritos se crearán bajo demanda.

## Open Questions
- [ ] ¿Cuál debería ser el TTL (Time To Live) por defecto para un carrito? (Propuesto: 24 horas).
- [ ] ¿El Gateway debe validar la existencia del producto en `catalog-ms` antes de enviar al `cart-ms`? (Recomendado: Sí, para evitar carritos con productos fantasmas).
