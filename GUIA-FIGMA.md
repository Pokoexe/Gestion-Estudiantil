# Guía: llevar la maqueta a Figma

Esta maqueta es una app web real (React). Para que tu equipo la **visualice y pruebe**
tienes dos caminos, y puedes usar los dos:

1. **Prototipo navegable** → tu equipo hace clic de verdad en el navegador (recomendado para probar).
2. **Importar a Figma como capas editables** → con el plugin **html.to.design**.

> Importante: no existe un botón mágico “código → Figma” nativo. Figma importa
> desde una **página renderizada** (una URL o la pestaña abierta). Por eso primero
> ponemos la app a correr y luego importamos cada pantalla.

---

## Opción A — Importar a Figma con html.to.design (capas editables)

### 1. Pon la app a correr
```bash
npm install
npm run dev
```
Queda en `http://localhost:5173/`.

### 2. Instala el plugin en Figma
En Figma → *Menú → Plugins → Buscar* → **“html.to.design”** → instálalo.
Instala también su **extensión de navegador** (Chrome/Edge/Firefox) desde
https://html.to.design — la extensión es la vía confiable para páginas en `localhost`.

### 3. Importa cada pantalla (una por rol)
Abre cada ruta en el navegador y, con la extensión, usa **“Import current tab”**.
Cada import cae en tu archivo de Figma como un **frame independiente** con capas editables:

| Pantalla                | URL a importar |
|-------------------------|----------------|
| Acceso / Login          | `http://localhost:5173/` |
| Panel Estudiante        | `http://localhost:5173/estudiante` |
| Detalle de materia      | `http://localhost:5173/estudiante/materias` |
| Panel Docente           | `http://localhost:5173/docente` |
| Panel Coordinador       | `http://localhost:5173/coordinador` |
| Panel Evaluador         | `http://localhost:5173/evaluador` |
| Panel Tesorería         | `http://localhost:5173/tesoreria` |
| Panel Director          | `http://localhost:5173/director` |
| Panel Programador       | `http://localhost:5173/programador` |

Consejos:
- Antes de importar, pon el navegador en un ancho de ~1440 px para que el layout de escritorio se vea completo.
- Las **gráficas** (recharts) se dibujan en SVG/Canvas: se importan como imagen o vector. Si necesitas editarlas dentro de Figma, reemplázalas por un componente de gráfico de Figma.
- Los íconos (lucide) llegan como SVG editable.

### 4. (Alternativa) Importar desde una URL pública
Si en vez de `localhost` prefieres una URL pública, despliega la app (ver Opción B)
y en el plugin usa **“Import from URL”** pegando cada enlace público del cuadro de arriba.

---

## Opción B — Prototipo navegable / desplegar en la nube

Para que tu equipo lo pruebe sin instalar nada:

```bash
npm run build        # genera /dist (estático)
```

Sube `/dist` a cualquier hosting estático (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

⚠️ **SPA fallback**: como usa rutas del lado del cliente (`/estudiante`, `/docente`, …),
configura el host para que **todas las rutas devuelvan `index.html`**:
- **Netlify** → archivo `_redirects` con: `/*    /index.html   200`
- **Vercel** → `vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

Con eso, compartes un solo enlace y tu equipo navega los 7 roles (y desde ahí también puedes importar a Figma con “Import from URL”).

---

## ¿Qué se construyó?

- **Idioma:** todo en español neutro latinoamericano.
- **Sistema visual único:** definido en `src/app/theme/tokens.ts` (mismo azul, tarjetas, badges y tipografía del diseño que ya te gustaba).
- **7 roles** con panel principal + login con selector de rol + cambiador de rol en el encabezado.
- Las vistas marcadas **“Pronto”** en cada barra lateral son las siguientes pantallas por diseñar (segunda etapa).
