Nuevas Integraciones para "EventTix"
Vamos a potenciar 3 microservicios clave con plataformas reales:
Auth Service: Login con Google (OAuth2).
Payments Service: Procesamiento real con Stripe.
Media Service (Nuevo o dentro de Events): Subida de imágenes con Cloudinary o AWS S3.

1. 🔐 Auth Service + Google OAuth2
   Implementar OAuth en microservicios tiene un truco: ¿Quién maneja el callback?
   Generalmente, el Gateway expone la ruta, pero el Auth Service hace la validación.
   Tecnología: passport-google-oauth20
   El Flujo:
   Frontend: El usuario hace clic en "Login con Google".
   Gateway: Redirige a la URL de Google.
   Google: El usuario acepta y Google redirige a tu api.tudominio.com/auth/google/callback con un code.
   Gateway -> Auth Service: El Gateway pasa ese code al Auth Service.
   Auth Service: Intercambia el code por el perfil del usuario (email, nombre, foto) con Google.
   Lógica: Si el email no existe en tu DB, lo registra (tabla Users). Si existe, lo loguea.
   Auth Service: Genera tu propio JWT interno y se lo devuelve al Gateway/Frontend.
   Reto Extra: Intenta que el sistema unifique cuentas. Si me registro con correo y contraseña, y luego entro con Google con el mismo correo, no debería crear dos usuarios, sino vincularlos.
2. 💳 Payments Service + Stripe
   Olvidemos el setTimeout. Usaremos Stripe en modo prueba (Test Mode). Esto te enseñará sobre Webhooks, algo fundamental en microservicios.
   Tecnología: Librería stripe de Node.js.
   El Flujo:
   Orders Service: Cuando se crea la orden, avisa a Payments.
   Payments Service: Llama a la API de Stripe para crear una "Checkout Session". Retorna una URL de pago.
   Frontend: Redirige al usuario a esa URL de Stripe (página de pago segura alojada por ellos).
   Usuario: Paga.
   Stripe (La magia): Envía un evento Webhook (una petición POST) a tu Gateway (/payments/webhook).
   Gateway -> Payments Service: Redirige el webhook.
   Payments Service: Valida la firma del webhook (seguridad), confirma que se pagó y emite el evento order_paid a RabbitMQ.
   Por qué esto es nivel PRO: Los webhooks son asíncronos. Tu sistema debe estar preparado para recibir esa confirmación 2 segundos o 2 horas después de que el usuario haga clic.
3. 🖼 Events Service + Cloudinary (Imágenes)
   Los eventos necesitan pósters/banners. No guardes imágenes en la base de datos (Base64 es mala práctica) ni en el sistema de archivos local del contenedor (porque si el contenedor se reinicia, pierdes la foto).
   Tecnología: API de cloudinary (Tienen capa gratuita generosa).
   El Flujo:
   Frontend: Envía el formulario del evento con un archivo de imagen (multipart/form-data).
   Gateway: Recibe el archivo y lo pasa al microservicio (esto es complejo con gRPC/RabbitMQ, así que usualmente se sube primero o se pasa como Buffer).
   Events Service: Toma el archivo y lo sube a Cloudinary.
   Cloudinary: Devuelve una URL pública (ej: https://res.cloudinary.com/.../evento.jpg).
   Events Service: Guarda esa URL de texto en la base de datos MongoDB.
   📝 Resumen de Tecnologías Externas a usar
   Microservicio Plataforma Externa Librería npm Sugerida Propósito
   Auth Google Cloud Platform (OAuth) @nestjs/passport, passport-google-oauth20 Registro/Login social
   Payments Stripe stripe Cobros reales y manejo de Webhooks
   Events Cloudinary (o AWS S3) cloudinary Almacenamiento de imágenes en la nube
   Notifications SendGrid (o Resend) @sendgrid/mail Enviar emails transaccionales bonitos
   🚀 Roadmap Ajustado (Nivel Medio-Alto)
   Configuración de Cuentas: Crea cuentas gratuitas en Google Cloud Console, Stripe Dev, Cloudinary y SendGrid (o Resend).
   Variables de Entorno: Aprende a manejar .env de forma segura. Tendrás muchas claves (GOOGLE_CLIENT_ID, STRIPE_SECRET_KEY, etc.). Nunca las subas a GitHub.
   Implementa Auth primero: Es lo más visual. Ver que puedes entrar con tu cuenta de Google es muy satisfactorio.
   Implementa Cloudinary: Modifica el endpoint de "Crear Evento" para aceptar archivos.
   Implementa Stripe: Deja esto para el final, ya que la lógica de webhooks y sincronizar el estado de la orden (Pending -> Paid) es la parte más compleja del sistema.
4.

### 1. Catalog-ms (Gestión de Productos)

**Este servicio se encarga de todo lo que el usuario ve antes de comprar.**

- **Responsabilidades:** **CRUD de celulares (marca, modelo, especificaciones, precio, fotos), gestión de categorías y búsqueda.**
- **Por qué:** **Es el núcleo de tu tienda. Separa la lógica de "mostrar productos" de la lógica de "comprar".**
- **Dato importante:** **Aquí vive tu base de datos de productos (ej. PostgreSQL o MongoDB).**

### 2. Cart-ms (Carrito de Compras)

**Este servicio maneja el estado temporal de la selección del usuario.**

- **Responsabilidades:** **Agregar productos al carrito, eliminar ítems, actualizar cantidades y persistir el estado del carrito (para que si el usuario cierra la web y vuelve, sus productos sigan ahí).**
- **Por qué:** **Es un servicio de "estado". A diferencia del catálogo que es mayormente lectura, este es de escritura frecuente.**
- **Tip:** **Para práctica, puedes usar** **Redis** **para que el carrito sea ultra rápido, ya que son datos temporales.**

### 3. Order-ms (Gestión de Pedidos)

**Aquí ocurre la "magia" de la venta.**

- **Responsabilidades:** **Recibir el carrito finalizado, crear una orden de compra, descontar el stock (comunicándose con** **catalog-ms**) y cambiar el estado del pedido (pendiente, pagado, enviado).
- **Por qué:** **Es el servicio que garantiza la integridad. Si el usuario paga, debe haber un registro inmutable de esa transacción.**

---

### Resumen de la arquitectura propuesta:

- **Auth-ms:** **Usuarios.**
- **Catalog-ms:** **Inventario y detalles de productos.**
- **Cart-ms:** **Carrito temporal.**
- **Order-ms:** **Transacciones y flujos de compra.**

| **Microservicio** | **Base de Datos** | **¿Por qué?**                                                                                                                                                                      |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth-ms**       | **PostgreSQL**    | **Necesitas integridad referencial y seguridad (usuarios, roles, permisos).**                                                                                                      |
| **Catalog-ms**    | **MongoDB**       | **Los celulares tienen especificaciones muy variables (memoria, cámara, pantalla, colores). MongoDB te permite guardar esos atributos sin hacer migraciones de tablas complejas.** |
| **Cart-ms**       | **Redis**         | **Es memoria volátil. Es la mejor forma de manejar carritos de compra que expiran o se actualizan constantemente.**                                                                |
| **Order-ms**      | **PostgreSQL**    | **Vital.** **Una orden de compra requiere transacciones ACID (que no haya errores en el dinero ni en el stock).**                                                                  |
