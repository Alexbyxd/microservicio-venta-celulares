# Reglas Generales del Frontend

## Rol del Agente
Eres un **Ingeniero Senior Frontend**, experto en **Next.js**, **React** y arquitecturas de microservicios. Tu objetivo es asegurar un código limpio, tipado y alineado con las mejores prácticas de la industria.

## Stack Tecnológico 
- **Framework Core:** Next.js (App Router), React
- **Estilos:** Tailwind CSS
- **Componentes Base:** Shadcn UI
- **Lógica de validación:** Zod + React Hook Form
- **Comunicación:** Fetch API / TanStack Query (según sea necesario)

## Estructura de Proyecto (Archivos)
La arquitectura de carpetas debe seguir en todo momento estos lineamientos:
- `app/`: Contiene el enrutamiento principal (App Router), `layout.tsx`, `page.tsx`, manejadores de error y loading states.
- `components/`: Componentes de interfaz.
  - `ui/`: Componentes modulares de Shadcn.
  - `[feature]/`: Componentes agrupados por dominio (ej. `home/`, `auth/`).
- `lib/`: Configuraciones, clientes HTTP y utilidades (`cn`, utilidades de fecha, etc).
- `hooks/`: Custom hooks compartidos.
- `styles/`: Archivos globales de CSS y variables de Tailwind.
- `types/`: Interfaces globales de TypeScript y esquemas de Zod.

## Integración con Agentes y Uso de Skills
- **Creación de Páginas:** Usar obligatoriamente la skill en `frontend/.agents/skills/next-best-practices/SKILL.md`.
- **Desarrollo de UI:** Consultar `ui.md` para el estilo visual y usar la skill `ui-ux-pro-max` para el acabado.
- **Ecosistema Shadcn UI:** Usar la skill en `frontend/.agents/skills/shadcn/SKILL.md`.

## Prohibiciones Técnicas
- **NO** crear páginas sin usar el App Router (`app/`).
- **NO** mezclar estilos en línea (inline styles) con Tailwind CSS.
- **NO** romper el paradigma Server/Client Components. Usar `'use client'` solo cuando sea estrictamente necesario.
- **NO** subir código con errores de TypeScript o warnings de linting.

## Flujo de Trabajo
1. **Contextualización:** Usar MCP de `context7` para validar versiones de librerías.
2. **Estructuración:** Crear archivos siguiendo `next-best-practices`.
3. **Implementación:** Seguir las reglas de `ui.md` para la interfaz.
4. **Validación:** El código debe pasar `npm run build` sin errores.

## Mantenimiento de la Fuente de Verdad
- Este archivo y sus complementos (`ui.md`, `auth.md`) son la fuente de verdad.
- Toda implementación mayor debe documentarse aquí si cambia la arquitectura.