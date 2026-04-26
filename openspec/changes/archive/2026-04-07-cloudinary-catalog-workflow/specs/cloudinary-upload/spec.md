# Spec: Cloudinary Upload Integration

## Propósito

Integrar el upload de imágenes a Cloudinary durante la creación de productos en el backend. El sistema DEBE procesar cada URL de imagen recibida, subirla a Cloudinary (saltando las que ya son de Cloudinary), y almacenar las URLs resultantes en el producto.

## Requirements

### Requirement: Upload de imágenes desde URLs remotas

El sistema DEBE, en el método `create()` de `ProductsService`, después de recibir las URLs originales, usar el SDK de Cloudinary para subir cada imagen desde su URL remota y reemplazar las URLs originales por las URLs de Cloudinary.

El proceso DEBE ejecutarse automáticamente antes de guardar el producto en MongoDB.

#### Escenario: Crear producto con URLs de imágenes válidas

- GIVEN el usuario crea un producto con images: ["https://sitio-externo.com/phone1.jpg", "https://sitio-externo.com/phone2.jpg"]
- WHEN `ProductsService.create()` es llamado con estos datos
- THEN cada imagen es descargada y subida a Cloudinary
- AND el producto guardado en MongoDB contiene las URLs de Cloudinary en el campo images
- AND las URLs originales son reemplazadas completamente

#### Escenario: Crear producto sin imágenes

- GIVEN el usuario crea un producto sin proporcionar el campo images
- WHEN `ProductsService.create()` es llamado
- THEN el producto se crea normalmente sin intentar upload a Cloudinary
- AND el campo images queda undefined o array vacío según lo enviado

#### Escenario: Crear producto con una sola imagen

- GIVEN el usuario crea un producto con una sola imagen: ["https://ejemplo.com/phone.jpg"]
- WHEN `ProductsService.create()` procesa esta URL
- THEN la imagen es subida a Cloudinary
- AND el producto guardado contiene una única URL de Cloudinary

### Requirement: Skip de URLs ya de Cloudinary

El sistema DEBE verificar si cada URL proporcionada ya es una URL de Cloudinary y, en ese caso, omitir el proceso de upload para esa URL.

Una URL se considera de Cloudinary SI contiene "res.cloudinary.com" o el dominio configurado en CLOUDINARY_CLOUD_NAME.

#### Escenario: URL ya es de Cloudinary

- GIVEN el usuario proporciona una imagen que ya está en Cloudinary: "https://res.cloudinary.com/mi-nube/image/upload/v1234567890/folder/phone.jpg"
- WHEN `ProductsService.create()` procesa esta URL
- THEN se detecta que es URL de Cloudinary
- AND se omite el upload (se mantiene la URL original sin cambios)

#### Escenario: Mezcla de URLs externas y de Cloudinary

- GIVEN el usuario proporciona: ["https://externo.com/img1.jpg", "https://res.cloudinary.com/mi-nube/img2.jpg", "https://externo.com/img3.jpg"]
- WHEN `ProductsService.create()` procesa las tres URLs
- THEN img1 se sube a Cloudinary, img2 se salta, img3 se sube
- AND el resultado contiene: [cloudinary_url1, original_cloudinary_url, cloudinary_url3]

### Requirement: Manejo graceful de errores de upload

El sistema DEBE manejar los errores de upload de Cloudinary de manera graceful, permitiendo que el producto se cree aunque algunas imágenes fallen.

Si una imagen falla al subir, el sistema DEBE registrar el error y continuar con las siguientes imágenes, incluyendo en el producto solo las URLs que se procesaron exitosamente.

#### Escenario: Una imagen falla durante el upload

- GIVEN el usuario proporciona tres URLs, pero la segunda URL es inaccesible
- WHEN `ProductsService.create()` procesa las imágenes
- THEN las imágenes 1 y 3 se suben exitosamente
- AND la imagen 2 falla y se registra el error en logs
- AND el producto se crea con solo las URLs exitosas (o se salta la fallida)
- AND no se lanza excepción que bloquee la creación del producto

#### Escenario: Todas las imágenes fallan

- GIVEN el usuario proporciona URLs pero ninguna es accesible para upload
- WHEN `ProductsService.create()` procesa todas las imágenes
- THEN se registran los errores para cada URL
- AND el producto se crea con array vacío de imágenes o se mantiene el campo undefined
- AND el proceso no impide la creación del producto

#### Escenario: Timeout en upload de imagen

- GIVEN una URL que existe pero el servidor de origen responde muy lentamente
- WHEN Cloudinary intenta descargar la imagen y excede el timeout
- THEN se maneja el timeout como error de upload
- AND se continúa con las siguientes imágenes

### Requirement: Configuración de variables de entorno

El sistema DEBE usar las siguientes variables de entorno para la configuración de Cloudinary:

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| CLOUDINARY_CLOUD_NAME | Sí | Nombre de la cuenta Cloudinary |
| CLOUDINARY_API_KEY | Sí | API Key de Cloudinary |
| CLOUDINARY_API_SECRET | Sí | API Secret de Cloudinary |

#### Escenario: Variables de entorno no configuradas

- GIVEN las variables de entorno de Cloudinary no están configuradas
- WHEN `ProductsService.create()` es llamado
- THEN el servicio debe iniciar sin errores (lazy config)
- AND al intentar usar Cloudinary, debe manejar la ausencia de credenciales gracefully

#### Escenario: Configuración parcial de Cloudinary

- GIVEN solo CLOUDINARY_CLOUD_NAME está configurado pero faltan API_KEY y API_SECRET
- WHEN el servicio intenta usar Cloudinary
- THEN debe detectar la configuración incompleta
- AND debe manejar el error sin bloquear la creación del producto

### Requirement: Logging del proceso de upload

El sistema DEBE registrar en logs cada paso del proceso de upload para facilitar el debug.

Cada upload, skip, o error DEBE generar un log con nivel apropiado (info para uploads exitosos, warn para skips, error para fallos).

#### Escenario: Log de upload exitoso

- GIVEN una URL válida que se sube exitosamente
- WHEN el proceso completa
- THEN se registra: "Imagen subida a Cloudinary: {url_original} -> {url_cloudinary}"

#### Escenario: Log de skip por URL de Cloudinary

- GIVEN una URL que ya es de Cloudinary
- WHEN se detecta
- THEN se registra: "Imagen omitida (ya es Cloudinary): {url}"

#### Escenario: Log de error en upload

- GIVEN una URL que falla al subir
- WHEN el error ocurre
- THEN se registra: "Error al subir imagen {url}: {mensaje_error}"

## Acceptance Criteria

- [ ] El método create() procesa cada URL y la sube a Cloudinary
- [ ] Las URLs que ya son de Cloudinary se saltan sin modificación
- [ ] Los errores de upload no bloquean la creación del producto
- [ ] Las URLs originales son reemplazadas por las de Cloudinary en MongoDB
- [ ] El proceso está configurado via variables de entorno
- [ ] Los logs reflejan cada paso del proceso de upload
- [ ] El producto se crea exitosamente aunque todas las imágenes fallen
