# Spec: Cloudinary Display con CldImage

## Propósito

Reemplazar el componente `<img>` actual en el listado del catálogo con el componente `CldImage` de `next-cloudinary` para mostrar imágenes optimizadas con transformación automática de Cloudinary.

## Requirements

### Requirement: Uso de CldImage en listado de productos

El sistema DEBE usar el componente `CldImage` de `next-cloudinary` en el archivo `page.tsx` del catálogo para mostrar las miniaturas de productos.

El componente DEBE usar las siguientes props: width=48, height=48, crop="fill".

#### Escenario: Mostrar thumbnail con CldImage

- GIVEN un producto en el catálogo con images[0]: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
- WHEN el componente CldImage renderiza la imagen
- THEN se muestra la imagen con width=48, height=48 y crop="fill"
- AND la imagen se carga desde los servidores de Cloudinary con optimización

#### Escenario: Primera imagen del producto

- GIVEN un producto tiene un array de imágenes
- WHEN se renderiza en la tabla del catálogo
- THEN se usa siempre la primera imagen del array (images[0]) para el thumbnail

#### Escenario: Producto sin imágenes

- GIVEN un producto no tiene imágenes o el array está vacío
- WHEN se renderiza la celda de imagen
- THEN se muestra el fallback actual (ícono de Smartphone en un div gris)

### Requirement: Configuración de cloud name

El sistema DEBE configurar el cloud name de Cloudinary para el componente CldImage usando la variable de entorno NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.

El valor DEBE ser injectado via el config del Next Cloudinary provider.

#### Escenario: Cloud name configurado correctamente

- GIVEN NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME está configurado en el archivo de entorno
- WHEN CldImage renderiza
- THEN usa ese cloud name para construir las URLs de Cloudinary

#### Escenario: Cloud name no configurado

- GIVEN NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está definido
- WHEN CldImage intenta renderizar
- THEN maneja el error gracefulmente (puede fall back a img tradicional)

### Requirement: Manejo de error de display

El sistema DEBE manejar el caso donde la URL de la imagen de Cloudinary no es válida o no se puede cargar.

CldImage DEBE tener un handler de onError que muestre el fallback actual (ícono de Smartphone).

#### Escenario: URL de Cloudinary inválida

- GIVEN un producto tiene una URL de Cloudinary que no existe
- WHEN CldImage falla al cargar
- THEN se muestra el fallback (ícono de Smartphone con fondo gris)

#### Escenario: Consistencia visual del fallback

- GIVEN no hay imagen disponible (vacio o error)
- WHEN se renderiza la celda
- THEN se muestra el mismo diseño que antes: div de 48x48 con ícono de Smartphone

## Environment Variables

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Sí | Nombre de la cuenta Cloudinary para display de imágenes |

## Acceptance Criteria

- [ ] CldImage se usa en page.tsx del catálogo para thumbnails
- [ ] Props width=48, height=48, crop="fill" aplicadas
- [ ] El fallback visual funciona cuando no hay imagen o falla
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME es usado para el cloud name
- [ ] El cambio es backward compatible con productos existentes (sin Cloudinary)
- [ ] La tabla mantiene el mismo layout visual que antes
