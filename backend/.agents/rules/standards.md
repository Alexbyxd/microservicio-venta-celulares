# 📜 Estándares y Convenciones de Código

## Referencia Obligatoria
- Basar todas las implementaciones en las reglas de [@backend/.agents/skills/nestjs-best-practices/SKILL.md](../skills/nestjs-best-practices/SKILL.md).
- Patrones expertos de RabbitMQ según [@backend/.agents/skills/rabbitmq-expert/SKILL.md](../skills/rabbitmq-expert/SKILL.md).

## Prohibiciones Estrictas 🛑
- **Sin Comentarios**: No añadas comentarios descriptivos innecesarios. El código debe ser autodescriptivo.
  - *Excepción*: Lógica compleja, hacks temporales o reglas de negocio que NO se expliquen por el nombre de las funciones/variables.
- **Inyección por Propiedad**: Usa SIEMPRE inyección por constructor.
- **Logic in Controllers**: Los controladores solo gestionan la petición/respuesta y envían datos al microservicio. La lógica vive en el microservicio correspondiente.

## Estructura de Carpetas (Por Microservicio)
```bash
src/
  ├── common/        # DTOs compartidos, filtros globales, interceptores.
  ├── config/        # Configuración de variables de entorno.
  ├── [module]/      # Módulo funcional (ej: auth).
  │    ├── dto/      # Data Transfer Objects (validación con class-validator).
  │    ├── entities/ # Entidades (si usa ORM).
  │    ├── [module].controller.ts
  │    ├── [module].service.ts
  │    └── [module].module.ts
  ├── app.module.ts  # Orquestador del servicio.
  └── main.ts        # Punto de entrada.
```

## Flujo de Trabajo
1.  **Analizar la Fuente de Verdad** (`backend.md`) antes de proponer cambios.
2.  **Validar con Skills**: Asegurar que el código sigue las mejores prácticas de NestJS.
3.  **Documentar Cambios Mayores**: Si creas un microservicio o un endpoint global, regístralo en el Changelog de `backend.md`.
