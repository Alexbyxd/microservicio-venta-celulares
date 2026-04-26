# Design: Cloudinary Catalog Workflow

## Technical Approach

Implementar un flujo completo de gestión de imágenes para el catálogo: preview en frontend durante creación, upload a Cloudinary en backend durante creación, y display optimizado con CldImage en el listado. El flujo es secuencial: el usuario ingresa URLs → preview muestra miniaturas → al crear, backend sube a Cloudinary → al listar, se muestran imágenes optimizadas.

## Architecture Decisions

### Decision: ImagePreview State Management

**Choice**: Estado interno con array de URLs parseadas + statuses (loading/loaded/error)
**Alternatives considered**: Usar el string directamente sin parsear | delegar todo al padre
**Rationale**: Permite manejar estados de carga por imagen, retry individual, y delete sin re-parsear el string completo. El callback onChange comunica el array actualizado al padre para sincronización.

### Decision: Cloudinary SDK Integration

**Choice**: Crear CloudinaryService dedicado con método `uploadFromUrl(url)` que retorna la URL de Cloudinary
**Alternatives considered**: Integrar lógica directamente en ProductsService | usar upload streaming
**Rationale**: Separa responsabilidad de upload de la lógica de productos. Facilita testing con jest.mock. El método único encapsula la complejidad de detección de URLs existentes de Cloudinary.

### Decision: Error Handling Strategy

**Choice**: Fail-graceful: si el upload de una imagen falla, se logged y se continúa con las demás. El producto se crea con las URLs que pudieron procesarse.
**Alternatives considered**: Fail-fast (lanzar excepción) | skip automático sin logs
**Rationale**: specs indican que el producto debe crearse aunque algunas imágenes fallen. Logging es requerido para debug. No bloquear la operación principal por imágenes opcionales.

### Decision: CldImage vs img nativo

**Choice**: Reemplazar `<img>` por `<CldImage>` con width=48, height=48, crop="fill"
**Alternatives considered**: Mantener img y agregar Cloudinary URL como src | usar el wrapper de next-cloudinary
**Rationale**: CldImage optimiza automáticamente formato, calidad y responsive. Las props especificadas mantienen el tamaño del thumbnail existente (48px = size-12 en Tailwind).

### Decision: Frontend Testing Setup

**Choice**: Agregar Vitest + React Testing Library al proyecto frontend
**Alternatives considered**: Jest con webpack | Testing sin framework (manual)
**Rationale**: Vitest es el estándar actual para Next.js 16 (vite-based). Integración nativa con React Testing Library. El proyecto actualmente no tiene framework de testing.

## Data Flow

```
[Frontend - Create Page]
        │
        ▼
┌───────────────────┐
│ ImagePreview     │  Parses comma-separated URLs
│ (internal state) │  Renders thumbnails with status
└───────────────────┘
        │ onChange(array)
        ▼
[Submit Form] ──→ catalogService.createProduct(imagesArray)
        │
        ▼
[Backend - ProductsService.create()]
        │
        ├─→ [CloudinaryService.uploadFromUrl()] ──→ (for each non-Cloudinary URL)
        │       │
        │       ▼
        │   [Cloudinary API] - Upload from remote URL
        │       │
        │       ▼
        │   Returns Cloudinary URL
        │
        └─→ Save to MongoDB with Cloudinary URLs
        │
        ▼
[Frontend - Catalog Page]
        │
        ▼
┌───────────────────┐
│ CldImage          │  Optimized display
│ width=48          │
│ height=48         │
│ crop="fill"       │
└───────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/components/ui/image-preview.tsx` | Create | Componente de preview con grid de thumbnails 48x48px, estados loading/loaded/error, botón de eliminación |
| `frontend/app/admin/catalog/create/page.tsx` | Modify | Agregar ImagePreview debajo del campo de imágenes, pasar form.watch("images") |
| `frontend/app/admin/catalog/page.tsx` | Modify | Importar CldImage, reemplazar `<img>` por CldImage con props especificadas |
| `backend/catalog-ms/src/config/cloudinary.module.ts` | Create | NestJS Module que importa CloudinaryService |
| `backend/catalog-ms/src/config/cloudinary.service.ts` | Create | Servicio con método uploadFromUrl, detección de URLs existentes, manejo de errores |
| `backend/catalog-ms/src/config/envs.ts` | Modify | Agregar validación de CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET |
| `backend/catalog-ms/src/products/products.module.ts` | Modify | Importar CloudinaryModule |
| `backend/catalog-ms/src/products/products.service.ts` | Modify | En create(), procesar imágenes con CloudinaryService antes de guardar |
| `backend/catalog-ms/src/products/products.service.spec.ts` | Create | Tests unitarios con jest.mock de Cloudinary |
| `frontend/components/ui/image-preview.spec.tsx` | Create | Tests con React Testing Library |

## Interfaces / Contracts

```typescript
// Frontend - ImagePreview
interface ImagePreviewProps {
  urls: string;                    // comma-separated URLs
  onChange?: (urls: string[]) => void;  // called with updated array
}

interface ImageItem {
  url: string;
  status: 'loading' | 'loaded' | 'error';
}
```

```typescript
// Backend - CloudinaryService
interface CloudinaryService {
  uploadFromUrl(url: string): Promise<string>;  // returns Cloudinary URL
  isCloudinaryUrl(url: string): boolean;          // detection helper
}
```

```typescript
// Backend - CreateProductDto (extension)
interface ProcessedProductData extends CreateProductDto {
  images?: string[];  // After Cloudinary processing - Cloudinary URLs
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit (Backend) | ProductsService.create() con imágenes, skip URLs Cloudinary, error handling | jest.mock Cloudinary SDK, verificar llamadas y resultado |
| Unit (Backend) | CloudinaryService.uploadFromUrl(), isCloudinaryUrl() | Unit tests del servicio |
| Component (Frontend) | ImagePreview renderizado, estados, eliminación | React Testing Library, fireEvent |
| Component (Frontend) | CldImage usage en tabla | Verificar componente renderiza con props correctas |

**Mocks required**:
- `cloudinary` npm package en backend (jest.mock)
- `next-cloudinary` en frontend (puede usar el componente real o mock)

## Migration / Rollout

1. **Backend** (primero): Agregar CloudinaryService, modificar ProductsService.create(), actualizar envs
2. **Frontend**: Agregar ImagePreview, modificar create page
3. **Display**: Modificar catalog page para usar CldImage
4. **Testing**: Agregar框架 de testing, crear tests

**Backward compatibility**: 
- Productos existentes sin Cloudinary: el display maneja fallback (Smartphone icon)
- URLs que ya son de Cloudinary: se skippea el upload
- Sin imágenes: funciona igual que antes

**Env vars required**:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (backend)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (frontend para CldImage)

## Open Questions

- [ ] ¿Se necesita retry logic para uploads que fallan temporalmente? (spec menciona timeout handling pero no retry)
- [ ] ¿El público de Cloudinary debe ser "authenticated" o "fetch"? (afecta seguridad y acceso)
- [ ] ¿Se debe validar que las URLs remotas son accesibles ANTES de enviar a Cloudinary?