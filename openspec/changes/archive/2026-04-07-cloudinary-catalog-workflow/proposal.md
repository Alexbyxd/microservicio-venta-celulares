# Proposal: Mejorar Flujo de Imágenes del Catálogo con Cloudinary

## Intent

El usuario no puede verificar visualmente las URLs de imágenes que ingresa al crear productos, lo que genera productos con URLs incorrectas o rotas. Además, el manejo actual de imágenes carece de optimización y almacenamiento robusto. Esta propuesta busca implementar previsualización en el frontend y integración con Cloudinary para gestión centralizada de imágenes.

## Scope

### In Scope
- **Frontend - Image Preview**: Componente para previsualizar miniaturas de URLs de imágenes (separadas por coma) en la página de creación de productos.
- **Backend - Cloudinary Upload**: Integración en catalog-ms para subir imágenes desde URLs remotas a Cloudinary y almacenar las URLs resultantes en el producto.
- **Frontend - Cloudinary Display**: Uso de `CldImage` de `next-cloudinary` en el listado del catálogo para mostrar imágenes optimizadas.
- **Testing**: Pruebas unitarias para el servicio de productos con Cloudinary y pruebas de componentes para el preview y display de imágenes.

### Out of Scope
- Upload de imágenes locales desde el navegador (solo URLs remotas).
- Eliminación de imágenes de Cloudinary al eliminar productos.
- Transformaciones avanzadas de Cloudinary (watermarks, formatos, etc.).

## Capabilities

### New Capabilities
- `image-preview`: Preview de miniaturas de URLs de imágenes separadas por coma en tiempo real.
- `cloudinary-upload`: Upload de imágenes desde URLs remotas durante creación de producto.
- `cloudinary-display`: Display de imágenes optimizadas usando CldImage en el catálogo.

### Modified Capabilities
- `product-creation`: Extender para incluir procesamiento de imágenes con Cloudinary.

## Approach

1. **Frontend - Image Preview**: Crear componente `ImagePreview` que tome el string de URLs, las separe por coma, y renderice miniaturas con manejo de errores de carga.
2. **Backend - Cloudinary**: En `ProductsService.create()`, después de recibir las URLs originales, usar el SDK de Cloudinary para subir cada imagen y reemplazar las URLs originales por las de Cloudinary.
3. **Frontend - CldImage**: Reemplazar el `<img>` actual en el listado por `<CldImage>` con las props de width, height y crop.
4. **Testing**: Jest para backend (mock de Cloudinary), React Testing Library para frontend.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/app/admin/catalog/create/page.tsx` | Modified | Agregar ImagePreview component |
| `frontend/components/ui/image-preview.tsx` | New | Componente de previsualización |
| `backend/catalog-ms/src/products/products.service.ts` | Modified | Integrar Cloudinary upload |
| `backend/catalog-ms/src/config/cloudinary.module.ts` | New | Módulo de configuración Cloudinary |
| `frontend/app/admin/catalog/page.tsx` | Modified | Usar CldImage para display |
| `backend/catalog-ms/src/products/products.service.spec.ts` | New | Tests unitarios |
| `frontend/components/ui/image-preview.spec.tsx` | New | Tests del componente |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| URLs de imagen no accesibles | Medium | Validar que las URLs respondan antes de subir; mostrar error si fallan |
| Cloudinary API key no configurada | Low | Usar variables de entorno con valores por defecto opcionales |
| Timeout en upload de imágenes | Medium | Implementar retry logic y timeout apropiado |
| Imágenes existentes sin Cloudinary | Medium | Backward compatibility: verificar si la URL ya es de Cloudinary |

## Rollback Plan

1. **Frontend**: Revertir cambios en `create/page.tsx` y `page.tsx` para usar `<img>` directo.
2. **Backend**: Remover integración de Cloudinary en `products.service.ts`, mantener URLs originales.
3. **Tests**: Eliminar archivos de test creados.
4. **Config**: Remover variables de Cloudinary del .env si fueron agregadas.

## Dependencies

- `cloudinary` (npm package) - SDK de Node.js para Cloudinary
- `next-cloudinary` - Componente React para Next.js
- Variables de entorno: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Success Criteria

- [ ] El usuario puede ver miniaturas de las URLs ingresadas antes de crear el producto
- [ ] Las imágenes se suben a Cloudinary y se almacenan las URLs de Cloudinary (no las originales)
- [ ] El listado del catálogo muestra imágenes usando CldImage con optimización
- [ ] Las pruebas unitarias del backend pasan (mocks de Cloudinary)
- [ ] Las pruebas de componentes del frontend pasan (preview y display)