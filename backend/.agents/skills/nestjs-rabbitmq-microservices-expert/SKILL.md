---
name: nestjs-rabbitmq-microservices-expert
description: Full context for implementing NestJS Microservices with RabbitMQ, including Gateway mapping (REST -> RMQ), RPC exception filters, interceptors, DTOs with Pipes, and Next.js App Router integration. Use when users ask for microservice patterns, RabbitMQ configuration in NestJS, error handling in distributed systems, or connecting Next.js to a NestJS Gateway.
---

# NestJS RabbitMQ Microservices Expert

Guía definitiva para construir microservicios escalables con NestJS, RabbitMQ y Next.js.

## Arquitectura Recomendada

1.  **Client Gateway**: API REST/GraphQL (NestJS) que actúa como punto de entrada único para el frontend. Transforma peticiones HTTP en mensajes de RabbitMQ.
2.  **Internal Microservices**: Servicios NestJS que escuchan patrones de mensajes/eventos vía RabbitMQ.
3.  **Frontend**: Next.js (App Router) comunicándose con el Gateway mediante Server Actions o Fetch.

## Configuración de RabbitMQ

### En el Gateway (Emisor)
Registra el microservicio en el módulo:
```typescript
ClientsModule.register([
  {
    name: 'AUTH_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmq_url],
      queue: 'auth_queue',
      queueOptions: { durable: true }
    }
  }
])
```

### En el Microservicio (Receptor)
Configura el microservicio en `main.ts`:
```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: [envs.rabbitmq_url],
    queue: 'auth_queue',
    noAck: false, // Recomendado para evitar pérdida de mensajes
    queueOptions: { durable: true }
  }
});
```

## Manejo de Excepciones RPC

Es CRÍTICO usar `RpcException` en lugar de `HttpException` dentro de los microservicios.

1.  **Filtro Global**: Implementa un `RpcExceptionFilter` (ver [references/error-handling.md](references/error-handling.md)).
2.  **Validation Pipe**: Configura el pipe para lanzar `RpcException`:
    ```typescript
    app.useGlobalPipes(new ValidationPipe({
      exceptionFactory: (errors) => new RpcException(errors)
    }));
    ```

## Integración con Next.js

Para una integración fluida:
1.  **Shared Types**: Mantén tus DTOs en una librería compartida o simplemente replica las interfaces en el frontend para asegurar consistencia.
2.  **Server Actions**: Usa Server Actions para llamar al Gateway. Esto permite manejar errores de validación de NestJS directamente en los formularios de Next.js.

## Recursos Adicionales

- **Patrones RMQ**: [references/rabbitmq-patterns.md](references/rabbitmq-patterns.md) - Request-Response vs Event-based.
- **Manejo de Errores**: [references/error-handling.md](references/error-handling.md) - Filtros e interceptores detallados.
- **Frontend Next.js**: [references/nextjs-integration.md](references/nextjs-integration.md) - Conexión y tipos compartidos.
- **Ejemplos**: [references/examples.md](references/examples.md) - Snippets listos para copiar.
