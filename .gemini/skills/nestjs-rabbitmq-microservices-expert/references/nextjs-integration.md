# Integración Next.js con NestJS (Microservicios)

En una arquitectura de microservicios, el frontend de Next.js típicamente NO habla directamente con los microservicios internos. En su lugar, usa el **Client Gateway**.

## Server Actions
Recomendado en Next.js App Router para llamar al backend de forma segura y eficiente.

### Server Action de Ejemplo
```typescript
'use server'

import { revalidatePath } from 'next/cache'

export async function loginUser(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const res = await fetch(`${process.env.NESTJS_GATEWAY_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    const error = await res.json()
    return { error: error.message || 'Error en el login' }
  }

  const data = await res.json()
  // Lógica de sesión (e.g., auth() de NextAuth)
  revalidatePath('/')
  return { success: true, user: data.user }
}
```

## Shared Types (Typescript)
Para evitar inconsistencias, mantén las interfaces de tus DTOs compartidas.

### Estructura en el Monorepo:
```
/proyecto_2
  /libs
    /shared-types
      /index.ts  <-- Contiene interfaces exportadas
  /backend
    /auth-ms (usa libs/shared-types)
  /frontend
    /app (usa libs/shared-types)
```

## Manejo de Sesiones
Dado que el Gateway es NestJS, puedes usar **NextAuth.js (Auth.js)** en el frontend y el Gateway solo se encarga de validar el JWT o la sesión que el proveedor de Auth (como Auth-MS) emita.

1.  Next.js captura las credenciales.
2.  Llama a una Server Action.
3.  La Server Action llama al `/login` del Gateway.
4.  El Gateway envía un mensaje `login_user` a `Auth-MS` vía RabbitMQ.
5.  `Auth-MS` valida y responde al Gateway.
6.  El Gateway responde al frontend.
