# EduGestión · Maqueta del Sistema de Gestión Escolar

Prototipo navegable (React + Vite + TypeScript) de un sistema de gestión escolar,
en **español neutro latinoamericano**. Toma como base el diseño original de la
pantalla de acceso y lo extiende con un **panel principal por cada rol**.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173/ — verás la pantalla de acceso. Debajo del formulario
hay un selector **“O explora la maqueta como…”** con los 7 roles. También puedes
cambiar de rol en cualquier momento con el botón de la esquina superior derecha del panel.

## Rutas (una pantalla clave por rol)

| Rol          | Ruta                    | Panel |
|--------------|-------------------------|-------|
| Estudiante   | `/estudiante`           | Solvencia, próxima clase, asistencia, horario semanal, evaluaciones pendientes |
| Estudiante   | `/estudiante/materias`  | Detalle de materia + plan de evaluación (ej. exposición de Petróleo) |
| Docente      | `/docente`              | Secciones, clases de hoy, planes de evaluación, pendientes |
| Coordinador  | `/coordinador`          | Reuniones, planificaciones, actividades, incidencias |
| Evaluador    | `/evaluador`            | Cola de revisiones, cronograma, boletines, discusión de notas |
| Tesorería    | `/tesoreria`            | Pagos en 3 monedas, gráfica del mes, sin solvencia, inventario |
| Director     | `/director`             | Visión ejecutiva: académico, finanzas, personal, actividades |
| Programador  | `/programador`          | Usuarios y roles, estado de servicios, registros del sistema |

## Estructura

```
src/app/
  theme/tokens.ts          → paleta, radios, tipografía (un solo sistema visual)
  roles.tsx                → definición de los 7 roles (navegación, identidad, íconos)
  routes.ts                → ruteo por rol
  components/AppLayout.tsx  → barra lateral + encabezado, adaptables al rol
  pages/                   → LoginPage + 1 panel por rol (+ detalle de materia)
```

> El sistema de diseño vive en `theme/tokens.ts`. Cualquier vista nueva debe
> importar `{ color, radius, accent }` desde ahí para mantener la consistencia.

## Llevarlo a Figma

Ver **[GUIA-FIGMA.md](GUIA-FIGMA.md)** — pasos para importar la maqueta a Figma
con el plugin *html.to.design* (queda como capas editables) y opciones de despliegue.

---
Diseño original: https://www.figma.com/design/eabtAuu7iALsIj5IQQ41XU/Design-login-screen-layout
