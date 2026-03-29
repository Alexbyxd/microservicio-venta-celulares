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

## ⚠️ MongoDB y Versiones

**IMPORTANTE**: Usar siempre `mongo:7.0` en lugar de `mongo:latest`.

### Por qué no usar mongo:latest

MongoDB 8.x tiene bugs conocidos con kernels Linux modernos (incluyendo Fedora 40+). El contenedor puede iniciar correctamente pero luego crashear con error código de salida **139** (segmentation fault) o **62** (shutdown por datos corruptos).

### Síntomas del problema

- Contenedor inicia correctamente (logs muestran "mongod startup complete")
- Minutos después el contenedor se detiene solo
- Error `podman ps -a` muestra status "Exited (139)"

### Solución

```yaml
catalog-db:
  image: mongo:7.0  # NO usar mongo:latest
```

Si ya tienes datos con mongo:latest y quieres migrar a 7.0:

```bash
# Eliminar volumen existente (perdemos datos)
podman rm -f catalog-db
podman volume rm <nombre-del-volumen>
podman compose up -d catalog-db
```

### Ejemplo de configuración MongoDB

```yaml
catalog-db:
  image: mongo:7.0
  container_name: catalog-db
  ports:
    - "27017:27017"
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=admin
  volumes:
    - catalog_db_data:/data/db
  networks:
    - microservicios
```
