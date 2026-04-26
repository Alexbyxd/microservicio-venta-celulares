# Spec: Image Preview Component

## Propósito

Permitir al usuario previsualizar miniaturas de URLs de imágenes separadas por coma en tiempo real durante la creación de productos, con manejo de estados de carga, error y opción de eliminar imágenes individuales.

## Requirements

### Requirement: Renderizado de miniaturas desde URLs separadas por coma

El sistema DEBE renderizar un componente que tome un string de URLs separadas por coma, las parsea correctamente y renderice miniaturas individuales para cada URL válida.

El componente DEBE aceptar una prop `urls` de tipo string que contenga cero o más URLs separadas por coma.

#### Escenario: URLs válidas proporcionadas

- GIVEN el usuario ingresa "https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg" en el campo de imágenes
- WHEN el componente ImagePreview recibe este string
- THEN se renderizan dos miniaturas de 48x48 píxeles mostrando las imágenes cargadas

#### Escenario: Cadena vacía proporcionada

- GIVEN el usuario no ingresa ninguna URL en el campo de imágenes
- WHEN el componente ImagePreview recibe una cadena vacía
- THEN no se renderiza ninguna miniatura y no se muestra error

#### Escenario: Una sola URL proporcionada

- GIVEN el usuario ingresa "https://ejemplo.com/img1.jpg" en el campo de imágenes
- WHEN el componente ImagePreview recibe esta única URL
- THEN se renderiza una única miniatura correctamente

### Requirement: Estados de carga y error

El sistema DEBE manejar estados de carga mientras las imágenes se cargan y estados de error cuando las URLs son inválidas o las imágenes no pueden cargarse.

Cada miniatura DEBE mostrar un indicador de carga (spinner o skeleton) mientras la imagen está cargando, y un estado de error con icono de alerta cuando la carga falla.

#### Escenario: Imagen cargando exitosamente

- GIVEN una URL válida se proporciona al componente
- WHEN la imagen está en proceso de carga
- THEN se muestra un estado de carga (spinner o skeleton) en lugar de la imagen
- AND cuando la carga completa, se muestra la imagen

#### Escenario: URL de imagen rota o inaccesible

- GIVEN una URL inválida o inaccesible como "https://ejemplo.com/invalid.jpg"
- WHEN la imagen falla al cargar
- THEN se muestra un estado de error con icono de alerta
- AND el fondo de la miniatura muestra un color de error (rojo/gris)

#### Escenario: Múltiples URLs con algunas válidas y otras rotas

- GIVEN el usuario ingresa "https://valida1.jpg, https://rota.jpg, https://valida2.jpg"
- WHEN el componente procesa las tres URLs
- THEN la primera y tercera muestran miniaturas exitosas
- AND la segunda muestra estado de error sin bloquear las demás

### Requirement: Botón de eliminación por imagen

El sistema DEBE permitir al usuario eliminar imágenes individuales del preview mediante un botón de eliminación en cada miniatura.

Cada miniatura renderizada DEBE tener un botón de eliminación visible al pasar el cursor sobre la miniatura.

#### Escenario: Eliminación de una imagen del preview

- GIVEN el componente muestra múltiples miniaturas
- WHEN el usuario hace clic en el botón de eliminación de una miniatura específica
- THEN esa miniatura se elimina del estado interno
- AND las miniaturas restantes se actualizan reflejando el cambio
- AND la prop onChange es llamada con el array actualizado de URLs

#### Escenario: Click en botón de eliminación cuando hay una sola imagen

- GIVEN el componente muestra una única miniatura
- WHEN el usuario hace clic en el botón de eliminación
- THEN el array de URLs se vacía
- AND onChange es llamado con array vacío

### Requirement: Integración con formulario de creación

El sistema DEBE integrarse con el formulario de creación de productos para mostrar el preview en tiempo real conforme el usuario escribe las URLs.

El componente DEBE actualizar el preview en tiempo real (onChange o debounce) conforme el campo de imágenes cambia.

#### Escenario: Preview actualiza en tiempo real

- GIVEN el usuario está en el formulario de creación de producto
- WHEN el usuario escribe o pega URLs en el campo de imágenes
- THEN el componente ImagePreview se actualiza automáticamente sin necesidad de submit

## Environment Variables

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Sí | Nombre de la cuenta Cloudinary para display |

## Acceptance Criteria

- [ ] El componente acepta URLs separadas por coma y las renderiza como miniaturas
- [ ] Cada miniatura muestra estado de carga mientras carga
- [ ] Cada miniatura muestra estado de error si la URL es inválida
- [ ] Cada miniatura tiene botón de eliminación funcional
- [ ] La eliminación de una imagen notifica al componente padre via onChange
- [ ] El preview actualiza en tiempo real conforme el usuario escribe
- [ ] El componente maneja gracefully URLs vacías
