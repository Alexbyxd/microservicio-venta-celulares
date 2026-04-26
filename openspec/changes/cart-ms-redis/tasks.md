# Tasks: Implementación de Cart-ms con Redis

## Phase 1: Infrastructure & Foundation
- [ ] 1.1 Update `compose.yml`: Add `redis-server` (image: mongo:7.0 -> redis:7.0-alpine).
- [ ] 1.2 Update `compose.yml`: Add `cart-ms` service definition with RabbitMQ and Redis environment variables.
- [ ] 1.3 Initialize `backend/cart-ms`: Create `package.json` with dependencies (`@nestjs/microservices`, `amqplib`, `ioredis`, `@nestjs-modules/ioredis`).
- [ ] 1.4 Configure `backend/cart-ms`: Create `main.ts` for RMQ Microservice and `app.module.ts` with Redis module registration.

## Phase 2: Cart-ms Core Implementation
- [ ] 2.1 Create `CartItem` interface and `Cart` types in `backend/cart-ms/src/cart/interfaces/`.
- [ ] 2.2 Implement `CartService` in `backend/cart-ms/src/cart/`: CRUD logic using `ioredis` with 24h TTL.
- [ ] 2.3 Implement `CartController` in `backend/cart-ms/src/cart/`: Handle RMQ patterns (`cart.get`, `cart.add`, etc.).

## Phase 3: Client Gateway Integration
- [ ] 3.1 Update `backend/client-gateway/src/catalog/`: Export `CatalogService` or add internal RMQ call to validate product existence.
- [ ] 3.2 Create `CartController` in `backend/client-gateway/src/cart/`: REST endpoints (`GET`, `POST`, `PATCH`, `DELETE`).
- [ ] 3.3 Implement validation in Gateway: Ensure product exists in `catalog-ms` before calling `cart.add`.

## Phase 4: Testing & Verification
- [ ] 4.1 Write Unit Tests for `CartService` (Mocks for Redis).
- [ ] 4.2 Write Integration Tests for `CartController` in `cart-ms` (RMQ pattern handling).
- [ ] 4.3 Write E2E Tests in Gateway: Validate full flow `HTTP -> Gateway -> RMQ -> Cart-MS -> Redis`.

## Phase 5: Cleanup & Final Check
- [ ] 5.1 Verify build for `cart-ms` and `client-gateway`.
- [ ] 5.2 Validate TTL in Redis manually using `redis-cli`.
