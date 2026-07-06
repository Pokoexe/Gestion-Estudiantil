# Datos maquetados — Capa de API simulada

Documentación de la carpeta `src/app/datos_maquetados/`: todos los datos estáticos
del sistema centralizados aquí y expuestos a través de "endpoints" simulados que
se llaman con **axios real** (con sesión), pero cuya respuesta está maquetada en
memoria. Ninguna petición sale a la red: el `adapter` de axios resuelve cada
llamada contra una tabla de rutas local. Así el código de las páginas es idéntico
al que se usaría contra un backend real y migrar a uno de verdad es trivial.

- **125 endpoints** en **20 dominios**.
- **1 sesión maquetada** (token Bearer adjuntado en cada petición, sin lógica de auth).

---

## 1. Arquitectura y flujo de datos

```
 Página (.tsx)
   │  useFetch(getRecurso, [])        ← hook estándar de carga async
   ▼
 actions/<dominio>.ts
   │  api.get("/ruta")                ← axios REAL (instancia con baseURL /api)
   ▼
 client.ts
   │  interceptor request  → adjunta  Authorization: Bearer <token de session.ts>
   │  adapter maquetado    → NO sale a la red (latencia MOCK_LATENCY_MS = 0)…
   ▼
 server/router.ts
   │  resolveRoute(method, path)      ← empareja método + path (soporta :params)
   ▼
 server/routes/<dominio>.routes.ts    ← tabla de rutas (auto-registrada por import.meta.glob)
   │  handler({ params, query, body })
   ▼
 data/<dominio>.ts                    ← los datos maquetados (arrays/objetos tipados)
```

### Archivos de infraestructura

| Archivo | Rol |
|---|---|
| `client.ts` | Instancia axios (`api`) con `baseURL: "/api"`. Interceptor de sesión + `adapter` maquetado. Latencia simulada configurable: `MOCK_LATENCY_MS = 0` (sin latencia). |
| `session.ts` | Sesión maquetada (`MOCK_SESSION`: token + usuario/rol). `getSession()`, `setSession()`, `getAuthHeader()`. Sin lógica de autenticación real. |
| `server/types.ts` | Tipos del servidor mock (`MockRoute`, `MockRequestCtx`, `RouteHandler`) y el helper `defineRoutes()`. |
| `server/router.ts` | Recolecta todas las rutas con `import.meta.glob("./routes/*.routes.ts")` y las empareja (`resolveRoute`). Añadir un dominio = crear un `*.routes.ts` (no hay agregador central que tocar). |
| `server/routes/*.routes.ts` | Tablas de rutas por dominio. Cada ruta: `{ method, path, description, handler }`. |
| `data/*.ts` | Los datos maquetados en sí (colecciones tipadas) + helpers de formato/cálculo puros. |
| `actions/*.ts` | SDK cliente: una función `async` por endpoint que llama a `api.*` y devuelve `response.data`. Re-exporta los tipos del dominio. |
| `useFetch.ts` | Hook `useFetch(fn, valorInicial, deps?)` → `{ data, loading, error, reload }`. |
| `index.ts` | Barrel de infraestructura (`useFetch`, `api`, sesión). |

### Cómo consumir un endpoint desde una página

```tsx
import { useFetch } from "../datos_maquetados";
import { getMaterias, type Subject } from "../datos_maquetados/actions/estudiante";

export function MateriasPage() {
  const { data: materias, loading } = useFetch(getMaterias, []); // inicial [] (misma forma)
  if (loading) return <div>Cargando…</div>;
  return <>{materias.map((m) => /* … */)}</>;
}
```

### Sesión maquetada

`session.ts` exporta `MOCK_SESSION = { token, user: { id, name, email, role } }`. El
interceptor de `client.ts` adjunta en **cada** petición:

```
Authorization: Bearer <token>
X-User-Role:   <rol>
```

No se valida en ningún sitio (es una maqueta). `setSession()` permite cambiar de
usuario/rol para explorar la maqueta. **`lapsos`** y **`solvency`** se mantienen
como configuración **síncrona** (no son endpoints): se importan directo de
`data/lapsos` y `data/solvency`.

### Migrar a un backend real

1. Borrar la línea `api.defaults.adapter = mockAdapter;` de `client.ts`.
2. Poner el `baseURL` real (p. ej. `import.meta.env.VITE_API_URL`).
3. Sustituir el token maquetado de `session.ts` por el real (login/localStorage).
4. Las `actions/*.ts`, el `useFetch` y las páginas **no cambian**: ya llaman a axios.

### Mutaciones

Los endpoints `POST`/`PATCH` (planes, planificaciones, reparaciones, discusiones)
invocan las funciones mutadoras del `data/*.ts` correspondiente, que modifican el
array en memoria (el "store" del mock) y devuelven el estado actualizado.

---

## 2. Endpoints por rol / dominio

> Método · Path (relativo a `/api`) · Descripción. Las funciones-action viven en
> `actions/<dominio>.ts`.

### Estudiante — `data/estudiante.ts` · `actions/estudiante.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/estudiante/materias` | Materias del estudiante con promedio, asistencia y estado. |
| GET | `/estudiante/horario` | Horario semanal de clases. |
| GET | `/estudiante/dashboard/horario` | Horario del dashboard (con id de materia por clase). |
| GET | `/estudiante/dashboard/evaluaciones-pendientes` | Evaluaciones pendientes de la semana. |
| GET | `/estudiante/perfil` | Datos de perfil del estudiante. |
| GET | `/estudiante/proximas-evaluaciones` | Próximas evaluaciones (perfil). |
| GET | `/estudiante/materias-reprobadas` | Materias reprobadas o en riesgo (perfil). |
| GET | `/estudiante/incidencias` | Incidencias del estudiante (perfil). |
| GET | `/estudiante/actividades-perfil` | Participaciones en actividades/cursos (perfil). |
| GET | `/estudiante/materia-actual` | Datos de la materia actual (banner CoursesPage). |
| GET | `/estudiante/materia-actual/docente` | Docente de la materia actual. |
| GET | `/estudiante/materia-actual/evaluaciones` | Plan de evaluación de la materia actual. |
| GET | `/estudiante/materias-pendientes` | Materias pendientes de años anteriores. |
| GET | `/estudiante/calificaciones` | Calificaciones (evaluaciones realizadas). |
| GET | `/estudiante/evaluaciones` | Evaluaciones por hacer. |
| GET | `/estudiante/pagos` | Historial de pagos. |
| GET | `/estudiante/actividades` | Actividades extracurriculares. |
| GET | `/estudiante/reparacion-materias` | Materias en reparación/pendientes/reprobadas. |
| GET | `/estudiante/reparacion/:id` | Detalle de una materia en reparación, con sus etapas. |

### Docente — `data/docente.ts` · `actions/docente.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/docente/clases-hoy` | Clases del día (dashboard). |
| GET | `/docente/horario-semanal` | Horario semanal resumido (dashboard). |
| GET | `/docente/secciones` | Secciones asignadas al docente. |
| GET | `/docente/estudiantes` | Estudiantes de una sección. |
| GET | `/docente/plan-seccion` | Plan de evaluación de una sección. |
| GET | `/docente/pendientes` | Entregas pendientes por estudiante. |
| GET | `/docente/horario` | Matriz completa del horario semanal. |
| GET | `/docente/materia-seccion` | Mapa materia del horario → id de sección. |

### Docente (evaluación/cursos) — `data/docente-eval.ts` · `actions/docente-eval.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/docente/postulaciones` | Actividades del docente y sus estudiantes postulados. |
| GET | `/docente/postulaciones-estudiantes` | Estudiantes disponibles para postular. |
| GET | `/docente/calificaciones-seccion` | Calificaciones por lapso (años, materias, plan, estudiantes, asistencia). |
| GET | `/docente/cursos` | Cursos extracurriculares solicitados/aceptados. |
| GET | `/docente/cursos-inscripciones` | Serie mensual de inscripciones por curso (área). |
| GET | `/docente/cursos-docente-actual` | Datos del docente a cargo al solicitar un curso. |

### Coordinador — `data/coordinador.ts` · `actions/coordinador.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/coordinador/dashboard/reuniones` | Reuniones recientes (dashboard). |
| GET | `/coordinador/dashboard/planificaciones` | Planificaciones por revisar (dashboard). |
| GET | `/coordinador/dashboard/actividades` | Actividades en curso (dashboard). |
| GET | `/coordinador/dashboard/incidencias` | Incidencias recientes (dashboard). |
| GET | `/coordinador/dashboard/incidencias-por-mes` | Serie de incidencias por mes (gráfica). |
| GET | `/coordinador/reuniones` | Agenda de reuniones. |
| GET | `/coordinador/actividades` | Actividades con sus postulados. |
| GET | `/coordinador/actividades/agenda` | Agenda de actividades (tabla). |
| GET | `/coordinador/docentes` | Docentes seleccionables en actividades. |
| GET | `/coordinador/planificaciones` | Planificaciones entregadas por los docentes. |
| GET | `/coordinador/incidencias` | Registro de incidencias. |
| GET | `/coordinador/incidencias/formato` | Campos del formato de incidencias. |
| GET | `/coordinador/secciones` | Secciones del plantel. |
| GET | `/coordinador/materias` | Materias del plan de estudios. |
| GET | `/coordinador/bloques` | Bloques horarios. |
| GET | `/coordinador/secciones/docentes` | Docentes seleccionables en secciones/horarios. |
| GET | `/coordinador/asistencia/estudiantes` | Asistencia mensual de estudiantes. |
| GET | `/coordinador/asistencia/docentes` | Asistencia mensual de docentes. |
| GET | `/coordinador/personas/estudiantes` | Directorio de estudiantes (con representante). |
| GET | `/coordinador/personas/docentes` | Directorio de docentes. |
| GET | `/coordinador/personas/por-seccion` | Distribución de estudiantes por sección (donut). |
| GET | `/coordinador/cursos` | Cursos extracurriculares (aprobación del coordinador). |
| GET | `/coordinador/cursos/chart` | Serie de estudiantes por curso. |
| GET | `/coordinador/cursos/docentes` | Docentes seleccionables al crear un curso. |

### Evaluador — `data/evaluador.ts` · `actions/evaluador.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/evaluador/dashboard` | KPIs y distribución de revisiones (dashboard). |
| GET | `/evaluador/revisiones` | Cola de revisiones (material enviado por docentes). |

### Evaluador (discusión/reparación) — `data/evaluador-discusion.ts` · `actions/evaluador-discusion.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/evaluador/reparaciones-estudiantes` | Estudiantes en riesgo académico (vista de reparaciones). |

### Tesorería — `data/tesoreria.ts` · `actions/tesoreria.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/tesoreria/recaudo-mensual` | Serie de recaudo mensual USD (dashboard). |
| GET | `/tesoreria/pagos-por-confirmar-resumen` | Pagos por confirmar (dashboard). |
| GET | `/tesoreria/morosos` | Representantes sin solvencia (dashboard). |
| GET | `/tesoreria/pagos` | Historial de pagos. |
| GET | `/tesoreria/recaudo-semanal` | Serie de recaudo semanal USD (página de pagos). |
| GET | `/tesoreria/representantes` | Solvencia de representantes (en mora + solventes). |
| GET | `/tesoreria/pagos-por-confirmar` | Comprobantes (bauches) en espera de validación. |
| GET | `/tesoreria/inventario` | Inventario de la institución. |
| GET | `/tesoreria/inventario/movimientos` | Registro de descuentos (salidas). |
| GET | `/tesoreria/inventario/saldo` | Saldo disponible inicial en USD. |
| GET | `/tesoreria/reportes` | Reportes ante eventualidades. |

### Director — `data/director.ts` · `actions/director.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/director/dashboard/matricula` | Serie mensual de matrícula y asistencia. |
| GET | `/director/dashboard/finanzas` | Serie financiera por moneda vs. sin pagar. |
| GET | `/director/dashboard/actividades` | Próximas actividades. |
| GET | `/director/dashboard/hitos` | Hitos del cierre de lapso. |
| GET | `/director/academico/secciones` | Tabla de secciones por año. |
| GET | `/director/academico/rendimiento` | Rendimiento promedio por año. |
| GET | `/director/academico/rendimiento-lapso` | Rendimiento promedio por lapso. |
| GET | `/director/academico/asistencia-mes` | Asistencia promedio mensual. |
| GET | `/director/academico/ajustes-lapso` | Ajustes agregados de promedio/asistencia por lapso. |
| GET | `/director/academico/incidencias` | Incidencias recientes (académico). |
| GET | `/director/finanzas/ingresos` | Ingresos mensuales en USD (finanzas globales). |
| GET | `/director/finanzas/deudores` | Representantes deudores. |
| GET | `/director/finanzas/pagos-pendientes` | Pagos por confirmar en revisión. |
| GET | `/director/actividades` | Cursos y actividades extracurriculares. |
| GET | `/director/personal/docentes` | Plantilla docente. |
| GET | `/director/personal/reuniones` | Reuniones de personal. |
| GET | `/director/personal/horario` | Asignación de docentes por hora. |

### Programador / Misc — `data/misc.ts` · `actions/misc.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/programador/kpis` | KPIs (uptime, usuarios, errores, respaldo). |
| GET | `/programador/acciones-rapidas` | Acciones rápidas del panel. |
| GET | `/programador/usuarios` | Gestión de usuarios y roles. |
| GET | `/programador/servicios` | Estado de servicios / integraciones. |
| GET | `/programador/distribucion-roles` | Distribución de usuarios por rol (barras). |
| GET | `/programador/logs` | Registros recientes del sistema. |

---

## 3. Dominios COMPARTIDOS (usados por varios roles)

### Boletines — `data/boletines.ts` · `actions/boletines.ts`
Helpers síncronos: `promedio`, `notaColor`, `notasDe`, `desglose`, `actividadesDe`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/boletines` | Boletines de estudiantes con notas por materia. |
| GET | `/boletines/anios` | Años académicos para filtrar. |
| GET | `/boletines/secciones` | Secciones para filtrar. |
| GET | `/boletines/materias` | Materias que componen el boletín. |

### Cronograma — `data/cronograma.ts` · `actions/cronograma.ts`
Helpers síncronos: `ESTADO_LABEL`, `fmtFecha`, `fmtFechaLarga`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/cronograma/planes` | Planes de evaluación con sus evaluaciones y estado. |

### Discusiones — `data/discusiones.ts` · `actions/discusiones.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/discusiones/postulaciones` | Postulaciones para discusión de notas ante el Concejo. |
| GET | `/discusiones/materias` | Materias disponibles para postular. |
| GET | `/discusiones/anios` | Años/secciones disponibles para postular. |
| POST | `/discusiones/postular` | Postula un estudiante ante el Concejo (queda Pendiente). |
| PATCH | `/discusiones/postulaciones/:id/decidir` | El Concejo acepta o rechaza una postulación. |

### Plantilla — `data/plantilla.ts` · `actions/plantilla.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/plantillas/campos` | Campos por defecto de la plantilla del plan de evaluación. |
| GET | `/plantillas/tipos` | Tipos de campo disponibles. |

### Planes de evaluación — `data/plans.ts` · `actions/plans.ts`
Síncronos: `LAPSO`, `MIN_EVALS`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/planes` | Planes de evaluación del docente. |
| GET | `/planes/materias` | Materias disponibles para un plan. |
| GET | `/planes/secciones` | Secciones disponibles para un plan. |
| GET | `/planes/:id` | Detalle de un plan por id. |
| POST | `/planes` | Crea un plan (queda en revisión). |
| PATCH | `/planes/:id` | Actualiza un plan existente. |

### Planificaciones — `data/planificaciones.ts` · `actions/planificaciones.ts`
Síncronos: `MATERIA_OPTIONS`, `SECCION_OPTIONS`, `LAPSO`, `MIN_SESIONES`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/planificaciones` | Planificaciones del docente. |
| GET | `/planificaciones/:id` | Detalle de una planificación por id. |
| POST | `/planificaciones` | Crea una planificación (queda en revisión). |
| PATCH | `/planificaciones/:id` | Actualiza una planificación existente. |

### Reparaciones — `data/reparaciones.ts` · `actions/reparaciones.ts`
Síncronos: `LAPSO`, `MIN_REP`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/reparaciones` | Reparaciones del docente. |
| GET | `/reparaciones/:id` | Detalle de una reparación por id. |
| POST | `/reparaciones/:id/evaluaciones` | Guarda las evaluaciones de una reparación. |

### Cursos extracurriculares — `data/courses.ts` · `actions/courses.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/cursos-extra` | Catálogo de cursos extracurriculares. |
| GET | `/cursos-extra/:id` | Detalle de un curso por id. |

### Inscripciones — `data/inscripciones.ts` · `actions/inscripciones.ts`
Síncronos: `INSCRIPCION_FEE`, `TIPO_META`, `ESTADO_META`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/inscripciones` | Inscripciones del panel del Director. |
| GET | `/inscripciones/serie` | Serie mensual: nuevos vs. reinscritos. |

### Chats — `data/chats.ts` · `actions/chats.ts`
Síncrono: `nowTime`.

| Método | Path | Descripción |
|---|---|---|
| GET | `/chats` | Conversaciones (mensajería) del usuario. |

### Bauche — `data/baucheMock.ts` · `actions/bauche.ts`

| Método | Path | Descripción |
|---|---|---|
| GET | `/bauche` | Imagen de prueba del comprobante (data-URI SVG). |

---

## 4. Config SÍNCRONA (no son endpoints)

| Archivo | Contenido | Por qué es síncrono |
|---|---|---|
| `data/lapsos.ts` | `LAPSOS`, `CURRENT_LAPSO`, `getLapso`, `LapsoId` | Config de período usada por el header, `LapsoContext` y los filtros de lapso en render. |
| `data/solvency.ts` | `SOLVENT`, `DEBT_LEVEL`, `DEBT_MESSAGE`, `DEBT_STYLES`, `MONTHS_OWED`… | Flags/estilos del banner de morosidad, derivados de una constante. |

_Última actualización: refactor de la maqueta a capa de API simulada._
