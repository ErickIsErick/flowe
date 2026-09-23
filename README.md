# 🌻 Flores para ti

Una pequeña experiencia web romántica: tres girasoles animados en SVG que nacen desde la oscuridad, una brisa permanente, un mensaje que aparece poco a poco, y corazones que brotan al tocar la pantalla. Todo en HTML + CSS + JavaScript puro, sin frameworks ni backend, lista para GitHub Pages.

## 📁 Estructura

```
flores-para-ti/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── audio/
    │   └── romantic.mp3   ← tú agregas este archivo
    └── fonts/
```

## ▶️ Probarlo en tu computador

1. Abre la carpeta en VS Code.
2. Haz doble clic en `index.html` (o usa la extensión "Live Server" de VS Code para evitar restricciones del navegador con `file://`).
3. Pulsa el botón **"Abrir 🌻"**.

> Nota: algunos navegadores restringen ciertas cosas al abrir un `.html` directamente desde el disco. Si el audio no se reproduce en local, prueba con Live Server o súbelo directo a GitHub Pages — ahí funciona sin problema.

## 🎵 Cómo agregar la música

1. Consigue un archivo de audio romántico en formato **MP3** (asegúrate de tener los derechos para usarlo).
2. Renómbralo exactamente como: `romantic.mp3`
3. Colócalo en: `assets/audio/romantic.mp3`
4. Listo — el código ya está preparado para cargarlo automáticamente al pulsar "Abrir 🌻".

Si no agregas el archivo, la experiencia visual funciona igual, simplemente sin sonido (falla en silencio, no rompe la página).

## ✏️ Cómo cambiar el mensaje

Abre `index.html` y busca estas líneas:

```html
<p class="message-line" id="line1">Para la flor más bonita de mi vida 🌻❤️</p>
<p class="message-line" id="line2">Te amo.</p>
```

Cambia el texto entre las etiquetas `<p>` por el mensaje que quieras. Puedes ajustar cuándo aparece cada frase editando en `script.js`:

```js
const CONFIG = {
  ...
  messageDelay1: 9500,   // milisegundos desde el inicio
  messageDelay2: 11500,
  ...
};
```

## 🎨 Cómo cambiar los colores

Todos los colores están centralizados al inicio de `style.css`:

```css
:root {
  --bg-color: #000000;
  --petal-yellow-1: #ffd23f;
  --petal-yellow-2: #ffb703;
  --petal-yellow-3: #f4a300;
  --flower-center: #4a2e05;
  --leaf-green: #6b8e23;
  --gold-particle: #ffdd7a;
  --text-color: #ffe9b8;
}
```

Cambia estos valores hexadecimales para probar otra paleta (por ejemplo, rosados o rojos) sin tocar el resto del código.

## 🔤 Cambiar la tipografía

La fuente romántica actual es **Great Vibes** (Google Fonts), cargada en el `<head>` de `index.html`. Si quieres otra, reemplaza el enlace de Google Fonts y el valor de `--font-romantic` en `style.css`. La página sigue funcionando aunque la fuente no cargue (usa `cursive` como respaldo).

## 🌻 Cómo ajustar las flores

En `script.js`, dentro de `FLOWER_LAYOUT`, puedes mover, agrandar o retrasar cada flor:

```js
const FLOWER_LAYOUT = [
  { id: 'top',    baseX: 230, baseY: 700, stemH: 340, cx: 240, cy: 300, scale: 0.72, sway: 6.5, delay: 0 },
  { id: 'left',   baseX: 90,  baseY: 700, stemH: 260, cx: 95,  cy: 440, scale: 0.62, sway: 5.5, delay: 400 },
  { id: 'center', baseX: 190, baseY: 700, stemH: 190, cx: 195, cy: 555, scale: 1.05, sway: 4.5, delay: 800 }
];
```

- `cx`, `cy`: posición del centro de la flor.
- `scale`: tamaño relativo.
- `sway`: cuánto se balancea con el viento.
- `delay`: cuánto tarda en empezar a aparecer respecto a las demás.

También puedes cambiar `petalsPerFlower` en `CONFIG` para tener más o menos pétalos por flor.

## 🚀 Publicar en GitHub Pages

### 1. Crear el repositorio

1. Entra a [github.com](https://github.com) e inicia sesión.
2. Pulsa **New repository**.
3. Nómbralo, por ejemplo: `flores-para-ti`.
4. Déjalo público, sin README (ya tienes uno), y crea el repositorio.

### 2. Subir los archivos

**Opción A — desde el navegador (más fácil):**
1. En la página del repositorio recién creado, pulsa **uploading an existing file**.
2. Arrastra toda la carpeta `flores-para-ti` (o los archivos `index.html`, `style.css`, `script.js`, `README.md` y la carpeta `assets/`).
3. Confirma el commit.

**Opción B — desde terminal (Git):**
```bash
cd flores-para-ti
git init
git add .
git commit -m "Primera versión de la experiencia"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/flores-para-ti.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
3. Pulsa **Save**.

### 4. Obtener el enlace

Después de guardar, GitHub tarda uno o dos minutos en publicar. El enlace aparecerá en la misma página de **Settings → Pages**, con un formato como:

```
https://TU_USUARIO.github.io/flores-para-ti/
```

### 5. Probarlo desde un teléfono

1. Copia ese enlace.
2. Envíatelo por WhatsApp, Telegram o donde prefieras.
3. Ábrelo desde el teléfono de tu novia (o el tuyo para probar antes) — no necesita instalar nada, solo un navegador.

## ⚠️ Notas técnicas

- No requiere backend, base de datos ni Node.js: todo corre en el navegador.
- Las flores están hechas con SVG generado por JavaScript (no son emojis ni imágenes estáticas), y cada pétalo es un elemento independiente animable.
- El sistema de partículas usa Canvas 2D optimizado (pocas partículas, sin librerías externas).
- El audio solo comienza tras el toque del usuario en "Abrir 🌻", respetando las políticas de autoplay de iOS/Android.
- Probado conceptualmente para Chrome (Android/Windows), Safari (iPhone), Edge y Firefox, usando solo APIs estándar y estables.
