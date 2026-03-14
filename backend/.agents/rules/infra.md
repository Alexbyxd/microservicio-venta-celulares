# 🐳 Infraestructura de Desarrollo (Podman Compose)

Este entorno es **solo para desarrollo**. NO se usan Dockerfiles; se usan imágenes directas del Docker Hub/Podman.

## ⚠️ IMPORTANTE: Usar Podman en lugar de Docker

Este proyecto utiliza **Podman** en lugar de Docker. Todos los comandos deben usar `podman` en vez de `docker`.

### Comandos básicos de Podman:
```bash
# Iniciar servicios
podman compose up -d

# Ver logs
podman compose logs -f [servicio]

# Detener servicios
podman compose down

# Ver estado de servicios
podman compose ps
```

## Gestión de Podman Compose (`@backend/compose.yml`)
Todas las dependencias de infraestructura (DBs, Brokers) deben estar centralizadas aquí.

### Cómo Agregar un Microservicio (DB + Dependencias)
Cuando se crea un nuevo microservicio que requiere persistencia:

1.  **Nuevo Servicio de DB**: 
    - Usa una imagen oficial (ej: `postgres:16.2`).
    - Define un nombre de contenedor descriptivo (ej: `orders-db`).
    - Usa un volumen persistente único (ej: `orders-db-data_micro_2`).
    - Asigna un puerto libre (ej: `5433:5432`).
2.  **Red Compartida**: Asegúrate de que todos los servicios estén en la red `microservicios`.

### Ejemplo de Estructura de DB
```yaml
services:
  [nombre]-db:
    image: postgres:16.2
    container_name: [nombre]-db
    environment:
      - POSTGRES_DB=[db_name]
      - POSTGRES_USER=[user]
      - POSTGRES_PASSWORD=[pass]
    ports:
      - "[free_port]:5432"
    volumes:
      - [volume_name]:/var/lib/postgresql/data
    networks:
      - microservicios
```

## Persistencia
- **Prisma ORM**: Cada microservicio debe tener su propia instancia de Prisma. NUNCA compartas el `schema.prisma` entre microservicios.
- **RabbitMQ**: Centralizado en el servicio `rabbit-server`. Todos los microservicios se conectan a este broker.
