# RabbitMQ Patterns in NestJS

NestJS soporta dos patrones principales para RabbitMQ: **Request-Response** y **Event-based**.

## Request-Response (Mensajes)
Usado cuando esperas una respuesta inmediata del microservicio. Se usa `@MessagePattern()`.

### Gateway (Emisor)
```typescript
@Get()
findAll() {
  return this.client.send({ cmd: 'find_all' }, {});
}
```

### Microservicio (Receptor)
```typescript
@MessagePattern({ cmd: 'find_all' })
handleFindAll() {
  return [ { id: 1, name: 'Item' } ];
}
```

## Event-based (Eventos)
Usado para tareas asíncronas donde NO se espera respuesta (e.g., enviar un email). Se usa `@EventPattern()`.

### Gateway (Emisor)
```typescript
@Post()
create(@Body() dto: CreateDto) {
  this.client.emit('user_created', dto);
}
```

### Microservicio (Receptor)
```typescript
@EventPattern('user_created')
async handleUserCreated(data: CreateDto) {
  // Lógica de creación (e.g., persistir en DB)
}
```

## Ruteo con Wildcards
Configura `wildcards: true` en las opciones de RMQ para soportar patrones complejos.

- `*` (asterisco): Coincide con exactamente una palabra.
- `#` (numeral): Coincide con cero o más palabras.

### Ejemplo:
```typescript
@MessagePattern('logs.#')
handleAllLogs(@Payload() data: any, @Ctx() context: RmqContext) {
  const pattern = context.getPattern();
  console.log(`Matched pattern: ${pattern}`);
}
```
Esto coincidirá con `logs.info`, `logs.error.critical`, etc.
