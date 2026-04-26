# Spec: Testing Requirements

## Propósito

Definir los requisitos de testing para los componentes y servicios modificados en el workflow de Cloudinary, incluyendo pruebas unitarias para el backend y pruebas de componentes para el frontend.

## Requirements

### Requirement: Pruebas unitarias para ProductsService con Cloudinary

El sistema DEBE tener pruebas unitarias en `products.service.spec.ts` que cubran la lógica de Cloudinary con mocks del SDK.

Se DEBE usar `jest.mock` para mockear el módulo de Cloudinary y verificar el comportamiento sin hacer llamadas reales a la API.

#### Escenario: Test de upload exitoso

- GIVEN el SDK de Cloudinary está mockeado para retornar URLs exitosas
- WHEN `productsService.create()` es llamado con URLs externas
- THEN las imágenes se suben a Cloudinary (mock)
- AND las URLs en el producto resultado son las URLs de Cloudinary mockeadas

#### Escenario: Test de skip de URLs de Cloudinary

- GIVEN una URL que ya es de Cloudinary es enviada
- WHEN `productsService.create()` procesa esa URL
- THEN el SDK de Cloudinary NO es llamado para esa URL
- AND la URL original se mantiene en el resultado

#### Escenario: Test de manejo de error

- GIVEN el SDK de Cloudinary lanza un error al intentar subir
- WHEN `productsService.create()` procesa la imagen
- THEN el error es manejado gracefully
- AND el producto se crea con las imágenes que pudieron procesarse

#### Escenario: Test de array vacío de imágenes

- GIVEN el usuario crea un producto sin imágenes
- WHEN `productsService.create()` es llamado
- THEN no se intenta usar el SDK de Cloudinary
- AND el producto se crea sin errors

### Requirement: Pruebas de componentes para ImagePreview

El sistema DEBE tener pruebas de componentes usando React Testing Library para el componente ImagePreview.

#### Escenario: Test de renderizado de miniaturas

- GIVEN el componente recibe un string con URLs válidas
- WHEN el componente renderiza
- THEN se renderiza el número correcto de elementos img

#### Escenario: Test de estado de carga

- GIVEN el componente recibe URLs válidas
- WHEN las imágenes están cargando
- THEN se muestra el indicador de carga (spinner/skeleton)

#### Escenario: Test de estado de error

- GIVEN una URL inválida es proporcionada
- WHEN la imagen falla al cargar
- THEN se muestra el estado de error

#### Escenario: Test de botón de eliminación

- GIVEN el componente muestra miniaturas
- WHEN se hace click en el botón de eliminación
- THEN la función onChange es llamada con el array actualizado

### Requirement: Pruebas de integración para CldImage en catálogo

El sistema DEBE verificar que CldImage se usa correctamente en el listado del catálogo.

#### Escenario: Test de uso de CldImage

- GIVEN un producto con imagen de Cloudinary
- WHEN el componente de tabla renderiza
- THEN se renderiza el componente CldImage (o su versión mockeada)

#### Escenario: Test de fallback cuando no hay imagen

- GIVEN un producto sin imágenes
- WHEN la celda de imagen renderiza
- THEN se muestra el ícono de Smartphone

### Requirement: Cobertura de código mínimo

El sistema DEBE mantener una cobertura de código mínima del 80% en los archivos modificados.

| Archivo | Cobertura Mínima |
|---------|------------------|
| products.service.ts | 80% |
| products.service.spec.ts | 80% |
| image-preview.tsx | 70% |

#### Escenario: Verificación de cobertura

- GIVEN las pruebas se ejecutan con --coverage
- WHEN el reporte de coverage se genera
- THEN los archivos mencionados cumplen con el porcentaje mínimo

## Acceptance Criteria

- [ ] ProductsService tiene pruebas unitarias con jest.mock de Cloudinary
- [ ] ImagePreview tiene pruebas con React Testing Library
- [ ] Las pruebas cubren los casos de éxito y error
- [ ] La cobertura de código cumple los mínimos especificados
- [ ] Las pruebas pasan en CI/CD
