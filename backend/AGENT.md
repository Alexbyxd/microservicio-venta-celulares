# 🏗️ AGENT.md - Backend (NestJS Microservices)

**Rol del Agente**: Senior Microservices Architect (15+ years experience).
**Misión**: Mantener la integridad técnica de la arquitectura de microservicios en NestJS, asegurando escalabilidad, desacoplamiento y alta calidad de código.

## 🧠 Referencia Técnica Principal (OBLIGATORIO)

Toda implementación debe seguir estrictamente las directrices de:

- **Expert Skill (Microservicios)**: @backend/.agents/skills/nestjs-rabbitmq-microservices-expert/SKILL.md
  - _Patrones de arquitectura, configuración de RabbitMQ y manejo de excepciones._
  - _En cada cambio que hagas en el backend debes explicar detalladamente al finzalizar de como es que funciona RabbiMQ ya que el usuario esta aprendiendo y necesita conocer los aspectos tecnicos._
- **NestJS Best Practices**: @backend/.agents/skills/nestjs-best-practices/SKILL.md
  - \*Reglas detalladas para DTOs, Inyección de Dependencias, Testing y Seguridad.

## 📌 Mapa de Contexto

Para detalles específicos, consulta los módulos especializados en `@backend/.agents/rules/`:

- [Arquitectura y Comunicación](@backend/.agents/rules/arch.md) -> Definición de servicios y flujo de RabbitMQ.
- [Estándares y Convenciones](@backend/.agents/rules/standards.md) -> Reglas de NestJS y prohibiciones.
- [Infraestructura de Desarrollo](@backend/.agents/rules/infra.md) -> Podman Compose y persistencia.
- [Documentación y API](@backend/.agents/rules/api.md) -> Swagger y contratos de endpoints.
- [Testing y Calidad](@backend/.agents/rules/testing.md) -> Cobertura (80%) y validaciones.

## 🔄 Registro de Cambios Mayores (System State)

_Cualquier adición de microservicios, nuevos endpoints globales o cambios en el stack debe registrarse aquí._

| Fecha      | Cambio                 | Descripción                                                    |
| :--------- | :--------------------- | :------------------------------------------------------------- |
| 2026-03-12 | Init Project           | Estructura inicial:`client-gateway` y `auth-ms`.               |
| 2026-03-12 | Rules Engine           | Implementación de la Fuente de Verdad modular.                 |
| 2026-03-12 | Context Auto-discovery | Renombrado de `backend.md` a `GEMINI.md` en `/backend`.        |
| 2026-03-14 | Módulo Auth            | Implementación de login y registro con JWT, bcrypt y RabbitMQ. |
| 2026-03-14 | RabbitMQ Integration   | Actualizado client-gateway para usar `ClientsModule` de NestJS en lugar de implementación manual. |
| 2026-03-14 | Manejo de Errores      | Implementación de `RmqExceptionFilter` para propagar mensajes de error correctamente a través de RabbitMQ. |

## 🛠️ Stack Tecnológico

- **Framework**: [NestJS](https://nestjs.com/) (v10+)
- **Lenguaje**: TypeScript
- **Comunicación**: RabbitMQ (Transporte RMQ)
- **Persistencia**: PostgreSQL (v16.2) con Prisma ORM
- **Entorno**: Podman Compose (Dev Mode - Images only)
- **Documentación**: Swagger / OpenAPI
- **Testing**: Jest

## 🐰 RabbitMQ - Explicación Técnica

**¿Qué es RabbitMQ?**
RabbitMQ es un message broker (corredor de mensajes) que implementa el protocolo AMQP. Funciona como un intermediario entre el cliente (frontend) y los microservicios, permitiendo comunicación asíncrona y desacoplada.

### Cómo funciona en nuestra arquitectura:

1. **Flujo de comunicación**:
   - El **Client Gateway** recibe una petición HTTP del frontend (ej: `POST /api/auth/login`)
   - El Gateway transforma esta petición en un mensaje RabbitMQ y lo envía a una cola específica (`auth_queue`)
   - El **Auth Microservice** está escuchando esa cola, procesa la lógica de negocio
   - El microservicio devuelve la respuesta a través de la misma conexión
   - El Gateway transforma la respuesta RabbitMQ y la devuelve al cliente

2. **Componentes clave**:
   - **Queue (Cola)**: Canal donde se almacenan los mensajes temporalmente. En nuestro caso: `auth_queue`
   - **Exchange**: Decide cómo distribuir los mensajes a las colas
   - **Message**: Contiene los datos (pattern + data) con metadatos (correlationId)

3. **Patrón Request-Response**:
   - Usamos `correlationId` para vincular solicitud con respuesta
   - El cliente espera la respuesta con el mismo correlationId

4. **Configuración en el proyecto**:
   - **Emisor (Gateway)**: `src/auth/auth.module.ts` con `ClientsModule` - Usa `ClientProxy` de NestJS para enviar mensajes
   - **Receptor (Microservicio)**: `main.ts` con `Transport.RMQ` - Escucha la cola con `@MessagePattern`

### Implementación del Cliente (Client Gateway)

El Gateway usa `ClientsModule` de `@nestjs/microservices` para comunicarse con los microservicios:

```typescript
// auth.module.ts
ClientsModule.register([
  {
    name: 'AUTH_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqHost],
      queue: 'auth_queue',
      queueOptions: { durable: true },
    },
  },
])
```

```typescript
// auth.service.ts
constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

async login(loginDto: LoginDto) {
  return firstValueFrom(this.authClient.send('loginUser', loginDto));
}
```

**Diferencia clave**: `ClientProxy.send()` envía el patrón en el cuerpo del mensaje (formato de NestJS), mientras que una implementación manual envía el patrón en headers personalizados, lo cual no es reconocido por los microservicios de NestJS.

### Comandos de Infraestructura:

```bash
# Iniciar servicios (RabbitMQ + PostgreSQL)
podman compose up -d

# Ver logs de un servicio
podman compose logs -f rabbit-server
podman compose logs -f auth_db
```

## 🎯 Manejo de Errores en RabbitMQ

### RmqExceptionFilter

El `RmqExceptionFilter` (`auth-ms/src/filters/rmq-exception.filter.ts`) es un filtro global de excepciones diseñado específicamente para microservicios RabbitMQ en NestJS.

**¿Por qué es necesario?**
- Los microservicios RabbitMQ no devuelven respuestas HTTP estándar
- Cuando ocurre una excepción en el microservicio, NestJS lanza un error que debe ser serializado
- Sin este filtro, el gateway recibe un error genérico y no puede extraer el mensaje

**Cómo funciona:**

1. **Captura de excepciones**: El filtro intercepta cualquier excepción (`@Catch()`)
2. **Extracción del mensaje**: 
   - Si es `HttpException`, extrae el status y mensaje
   - Si es `Error` genérico, usa el mensaje
   - otherwise, usa "Internal server error"
3. **Serialización**: Devuelve un objeto `{ statusCode, message }` que el gateway puede leer

**Configuración en main.ts**:
```typescript
app.useGlobalFilters(new RmqExceptionFilter());
```

**En el Gateway**: Se extrae el mensaje así:
```typescript
catch (error: any) {
  const message = error.message?.message || error.message;
  throw new HttpException(message, HttpStatus.UNAUTHORIZED);
}
```

---

**Instrucción Crítica**: Este archivo es el punto de entrada. Si vas a proponer un cambio estructural, actualiza primero el "Registro de Cambios Mayores" aquí.
