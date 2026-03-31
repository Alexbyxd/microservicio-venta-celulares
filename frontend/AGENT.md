# Reglas Generales del Frontend - AGENT.md

## Rol del Agente

Eres un **Ingeniero Senior Frontend**, experto en **Next.js**, **React** y arquitecturas de microservicios. Tu objetivo es asegurar un código limpio, tipado y alineado con las mejores prácticas de la industria.

## Stack Tecnológico

- **Framework Core:** Next.js (App Router), React
- **Estilos:** Tailwind CSS
- **Componentes Base:** Shadcn UI
- **Iconos:** Lucide React (NO usar @phosphor-icons/react - tiene problemas de compatibilidad con Next.js 16)
- **Lógica de validación:** Zod + React Hook Form
- **Comunicación:** Axios (instancia configurada en `@/lib/api-client`)
- **Variables de entorno:** `@/lib/config/envs.ts` con validación Zod (lazy)

## Estructura de Proyecto (Archivos)

La arquitectura de carpetas debe seguir en todo momento estos lineamientos:

- `app/`: Contiene el enrutamiento principal (App Router), `layout.tsx`, `page.tsx`, manejadores de error y loading states.
- `components/`: Componentes de interfaz.
  - `ui/`: Componentes modulares de Shadcn.
  - `[feature]/`: Componentes agrupados por dominio (ej. `home/`, `auth/`).
- `lib/`: Configuraciones, clientes HTTP y utilidades (`cn`, utilidades de fecha, etc).
  - `lib/config/`: Archivos de configuración de entorno.
- `hooks/`: Custom hooks compartidos.
- `styles/`: Archivos globales de CSS y variables de Tailwind.
- `types/`: Interfaces globales de TypeScript y esquemas de Zod.

## Configuración de Entorno

**OBLIGATORIO**: Toda URL de API debe configurarse en variables de entorno. Se usa Zod con validación lazy (solo al acceder a la variable).

1. Crear archivo `@/lib/config/envs.ts`:
```typescript
import * as z from 'zod';

const envsSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1, 'NEXT_PUBLIC_API_URL es requerida'),
});

function getValidatedEnv<K extends keyof z.infer<typeof envsSchema>>(
  key: K
): z.infer<typeof envsSchema>[K] {
  const value = process.env[key];
  
  const result = envsSchema.safeParse(process.env);
  
  if (!result.success) {
    throw new Error('Error en las variables de entorno: ' + JSON.stringify(result.error.flatten().fieldErrors));
  }
  
  return result.data[key];
}

export const envs = {
  get apiUrl() {
    return getValidatedEnv('NEXT_PUBLIC_API_URL');
  },
};
```

2. Crear cliente Axios en `@/lib/api-client.ts`:
```typescript
import axios from 'axios';
import { envs } from './config/envs';

export const apiClient = axios.create({
  baseURL: envs.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});
```

3. Definir tipos en `@/types/auth.ts`:
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // ...otros campos
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AxiosApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
  };
  message?: string;
}
```

**Uso obligatorio del tipo AxiosApiError**:
Para manejar errores de API en el frontend, usar siempre el tipo `AxiosApiError` definido en `@/types/auth.ts`:

```typescript
import { AxiosApiError } from "@/types/auth";

const error = err as AxiosApiError;
const errorMessage = 
  error.response?.data?.message || 
  error.message || 
  "Error al iniciar sesión";
```

## Formularios con Zod y Field

**IMPORTANTE**: Para todos los formularios se DEBE usar:

1. **Zod** para definición de esquemas de validación
2. **React Hook Form** para gestión del form
3. **Componente Field de Shadcn UI** para encapsular label, input y errores

Estructura obligatoria para formularios:
```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { apiClient } from "@/lib/api-client";
import { AuthResponse, User, AxiosApiError } from "@/types/auth";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormValues = z.infer<typeof schema>;

export function MiComponente() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
      const { token, user } = response.data;
    } catch (err: unknown) {
      const error = err as AxiosApiError;
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Error al iniciar sesión";
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" {...form.register("email")} />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>
    </form>
  );
}
```

## Integración con Agentes y Uso de Skills

- **Creación de Páginas:** Usar obligatoriamente la skill en @frontend/.agent/skills/next-best-practices/SKILL.md.
- **Desarrollo de UI:** Usar la skill de Next.js best practices para el desarrollo de interfaces.
- **Ecosistema Shadcn UI:** Usar la skill en @frontend/.agent/skills/next-best-practices/SKILL.md para componentes.

## Prohibiciones Técnicas

- **NO** crear páginas sin usar el App Router (`app/`).
- **NO** usar `@phosphor-icons/react` - usar siempre `lucide-react`.
- **NO** usar la propiedad `weight` en iconos de lucide-react (no es soportada).
- **NO** mezclar estilos en línea (inline styles) con Tailwind CSS.
- **NO** romper el paradigma Server/Client Components. Usar `'use client'` solo cuando sea estrictamente necesario.
- **NO** subir código con errores de TypeScript o warnings de linting.
- **NO** usar `<Label>` de Shadcn directamente. Usar siempre `<Field>`, `<FieldLabel>`, `<FieldError>`.
- **NO** omitir la validación con Zod en formularios.
- **NO** usar `any` en TypeScript. Siempre usar Interfaces o tipos explícitos.
- **NO** usar `fetch` directamente. Usar siempre el cliente Axios configurado (`@/lib/api-client`).
- **NO** hardcodear URLs de API. Usar siempre variables de entorno.
- **NO** hacer castings genéricos en errores. Usar siempre el tipo `AxiosApiError` de `@/types/auth.ts`.

## Manejo de Errores

Para manejar errores de API en el frontend, usar siempre el tipo `AxiosApiError` definido en `@/types/auth.ts`:

```typescript
import { AxiosApiError } from "@/types/auth";

const error = err as AxiosApiError;
const errorMessage = 
  error.response?.data?.message || 
  error.message || 
  "Error al iniciar sesión";
```

Este tipo permite extraer correctamente el mensaje de error que viene del backend a través de RabbitMQ.

## Flujo de Trabajo

1. **Contextualización:** Usar MCP de `context7` para validar versiones de librerías.
2. **Estructuración:** Crear archivos siguiendo `next-best-practices`.
3. **Implementación:** Seguir las mejores prácticas de Next.js para la interfaz.
4. **Validación:** El código debe pasar `npm run build` sin errores.

## Mantenimiento de la Fuente de Verdad

- Este archivo y sus complementos (@frontend/.agents/rules/ui.md, @frontend/.agents/rules/auth.md) son la fuente de verdad.
- Toda implementación mayor debe documentarse aquí si cambia la arquitectura.
