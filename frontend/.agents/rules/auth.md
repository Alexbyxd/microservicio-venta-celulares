# Estrategia de Autenticación y Seguridad

## Arquitectura de Autenticación
- **Solución:** Auth.js (NextAuth) v5 Beta.
- **Configuración:** `/auth.ts`.
- **Manejador:** `app/api/auth/[...nextauth]/route.ts`.

## Flujo Híbrido (Frontend-Backend)
Para mantener la integridad en un sistema de microservicios, seguimos este flujo:
1. **Login Social:** El usuario se autentica con Google vía NextAuth.
2. **Sincronización:** En el callback `signIn`, el frontend notifica al `Auth-MS` (vía Gateway).
3. **Registro/Validación:** El `Auth-MS` registra al usuario en la DB (Prisma) y genera un **JWT propio**.
4. **Sesión:** NextAuth almacena el JWT del backend en el objeto de sesión.
5. **Peticiones:** Todas las llamadas al Gateway deben incluir el JWT del backend en el header `Authorization`.

## Proveedores Activos
- **Google:** Requiere `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`.

## Callbacks Críticos
- `signIn`: Sincronización con el backend.
- `jwt`: Persistencia del token del backend en el token de NextAuth.
- `session`: Exposición del token del backend al cliente de React.

## Reglas de Implementación
- **Integridad UI:** Al añadir formularios o botones de login, se debe respetar estrictamente el diseño definido en `ui.md`.
- **Seguridad:** Nunca exponer secretos del cliente en el frontend. Usar siempre variables de entorno.