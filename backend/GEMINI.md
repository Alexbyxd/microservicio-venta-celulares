---
trigger: always_on
---

# 🏗️ Backend Source of Truth (v1.0.0)

**Rol del Agente**: Senior Microservices Architect (15+ years experience).
**Misión**: Mantener la integridad técnica de la arquitectura de microservicios en NestJS, asegurando escalabilidad, desacoplamiento y alta calidad de código.

## 🧠 Referencia Técnica Principal (OBLIGATORIO)
Toda implementación debe seguir estrictamente las directrices de:
- **Expert Skill (Microservicios)**: [nestjs-rabbitmq-microservices-expert](../.gemini/skills/nestjs-rabbitmq-microservices-expert/SKILL.md)
  *Patrones de arquitectura, configuración de RabbitMQ y manejo de excepciones.*
- **NestJS Best Practices**: [.agents/skills/nestjs-best-practices/SKILL.md](.agents/skills/nestjs-best-practices/SKILL.md)
  *Reglas detalladas para DTOs, Inyección de Dependencias, Testing y Seguridad.*

## 📌 Mapa de Contexto
Para detalles específicos, consulta los módulos especializados en `.agents/rules/`:

- [Arquitectura y Comunicación](.agents/rules/arch.md) -> Definición de servicios y flujo de RabbitMQ.
- [Estándares y Convenciones](.agents/rules/standards.md) -> Reglas de NestJS y prohibiciones.
- [Infraestructura de Desarrollo](.agents/rules/infra.md) -> Docker Compose y persistencia.
- [Documentación y API](.agents/rules/api.md) -> Swagger y contratos de endpoints.
- [Testing y Calidad](.agents/rules/testing.md) -> Cobertura (80%) y validaciones.

## 🔄 Registro de Cambios Mayores (System State)
*Cualquier adición de microservicios, nuevos endpoints globales o cambios en el stack debe registrarse aquí.*

| Fecha | Cambio | Descripción |
| :--- | :--- | :--- |
| 2026-03-12 | Init Project | Estructura inicial: `client-gateway` y `auth-ms`. |
| 2026-03-12 | Rules Engine | Implementación de la Fuente de Verdad modular. |
| 2026-03-12 | Context Auto-discovery | Renombrado de `backend.md` a `GEMINI.md` en `/backend`. |

## 🛠️ Stack Tecnológico
- **Framework**: [NestJS](https://nestjs.com/) (v10+)
- **Lenguaje**: TypeScript
- **Comunicación**: RabbitMQ (Transporte RMQ)
- **Persistencia**: PostgreSQL (v16.2) con Prisma ORM
- **Entorno**: Docker Compose (Dev Mode - Images only)
- **Documentación**: Swagger / OpenAPI
- **Testing**: Jest

---
**Instrucción Crítica**: Este archivo es el punto de entrada. Si vas a proponer un cambio estructural, actualiza primero el "Registro de Cambios Mayores" aquí.
