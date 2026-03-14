# Reglas de UI, Diseño y Experiencia de Usuario

## Dirección de Arte
- **Estilo:** Moderno, ultra limpio, "Web3", fluido, interactivo y con toques 3D de cristal y metálicos.
- **Fondo General:** Negro puro (`#000000`).
- **Tema Visual:** Glassmorphism de alto contraste.

## Tipografía
- **Fuente Principal:** `General Sans` (variable CSS `--font-sans`).
- **Títulos:** Pesos `semibold` o `medium`. Uso frecuente de gradientes metálicos (`bg-clip-text text-transparent`).
- **Cuerpo:** Blancos con opacidades sutiles (`text-white/70`, `text-white/60`).

## Colores y Texturas
- **Primario:** Blanco sólido `#ffffff`.
- **Acentos:** Transparencias y alfas (`bg-white/10`, `border-white/20`).
- **Efectos:** Uso intensivo de `backdrop-blur-md` a `backdrop-blur-2xl` para jerarquía y profundidad.

## Componentes y Controles
- **Botones (Pills):** Bordes redondos (`rounded-full`), bordes finos (`border-[0.6px] border-white/50`) y efectos de "glow" superior.
- **Modales y Tarjetas:** Fondos oscuros difuminados (`bg-black/60`) con sombras profundas para elevación.
- **Inputs:** Fondos `bg-white/5` y resalte suave en focus (`focus-visible:ring-white/30`).

## Animaciones (Framer Motion)
- **Entradas:** Opacidad y transformaciones suaves (`y: 20` a `0`) con `ease: [0.16, 1, 0.3, 1]`.
- **Efectos 3D:** Uso de `rotateX`, `perspective` y `preserve-3d` para simular profundidad.
- **Interacción:** `whileHover={{ scale: 1.05 }}` y `whileTap={{ scale: 0.95 }}`.

## Diseño Responsivo
- **Texto:** Evitar saltos de línea en botones clave con `whitespace-nowrap`.
- **Móvil:** Prioridad absoluta a CTAs, ocultar elementos decorativos y reducir paddings/fuentes significativamente.

## Prohibiciones de Diseño
- **NO** usar colores genéricos (azules, rojos, verdes) fuera de la estética monocromática.
- **NO** eliminar o simplificar animaciones existentes al refactorizar lógica.
- **NO** usar fondos planos opacos; siempre privilegiar el cristal y la transparencia.