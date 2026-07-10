# CLAUDE.md — Reglas del proyecto (Sistema de Gestión Escolar)

> Claude Code lee este archivo automáticamente, pero **solo cuando trabaja en
> este repositorio**. No afecta a otros proyectos. Las reglas globales para
> todos tus proyectos irían en `~/.claude/CLAUDE.md` (otro archivo, no este).

## Estilo de código (siempre activo)

### Idioma: inglés, solo en código nuevo
- Todo identificador **nuevo** en inglés: variables, funciones, tipos,
  interfaces, props y nombres de archivo nuevos (`selectedStudent`,
  `handleSubmit`, `StudentRow`, `useStudentList`).
- **No renombrar lo que ya existe en español.** Se conservan tal cual:
  - Carpetas de rol: `estudiante/`, `docente/`, `coordinador/`, `evaluador/`,
    `tesoreria/`, `director/`, `programador/`.
  - Nombres de página existentes (`CoordCursosPage`, etc.).
  - La capa mock `datos_maquetados/` y sus actions.
  - Términos de dominio ya establecidos (`Lapso`, `Bauche`, `Solvencia`…).
  - Solo se renombran si lo pido explícitamente.

### Sin comentarios explicativos
- **No agregues comentarios que expliquen el funcionamiento del código.**
  Prefiere código autoexplicativo: nombres claros y funciones pequeñas.
- Si al editar un archivo tocas líneas que ya tenían comentarios sobrantes,
  puedes quitarlos. **No hagas barridos masivos** de comentarios en archivos
  que no estás modificando.

## Organización de archivos
- La estructura destino y el orden de trabajo están en
  `ANOTACIONES/organizacion_*.md` (empezar por
  `organizacion_00_plan_general.md`).
- Fuente de verdad: `ANOTACIONES/distribucion_archivos.txt` (si algo se
  contradice, gana ese archivo).
- Para reorganizar una página o mover archivos a la nueva estructura, usa la
  skill **`reorganizar-pagina`** (`.claude/skills/reorganizar-pagina/`).
