import { useState } from "react";
import {
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Clock,
  ListChecks,
  Presentation,
  FlaskConical,
  PenLine,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { color } from "../theme/tokens";
import { Link, useSearchParams } from "react-router";
import { useFetch } from "../datos_maquetados";
import {
  getMateriaActual,
  getMateriaActualDocente,
  getMateriaActualEvaluaciones,
  type Assignment,
} from "../datos_maquetados/actions/estudiante";

const TYPE_META: Record<Assignment["type"], { icon: React.FC<{ style?: React.CSSProperties }>, bg: string, color: string, label: string }> = {
  presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
  exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
  lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
  essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const STATUS_META: Record<Assignment["status"], { bg: string; color: string; label: string }> = {
  pending: { bg: color.warningBg, color: color.warning, label: "Pendiente" },
  submitted: { bg: color.primary100, color: color.primary, label: "Entregada" },
  graded: { bg: color.successBg, color: color.success, label: "Calificada" },
};

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const [expanded, setExpanded] = useState(assignment.id === 1);
  const typeMeta = TYPE_META[assignment.type];
  const statusMeta = STATUS_META[assignment.status];
  const TypeIcon = typeMeta.icon;

  return (
    <div
      className={`bg-edu-surface rounded-xl overflow-hidden transition-colors ${expanded ? "border-[1.5px] border-edu-primary-200" : "border border-edu-border-soft"}`}
    >
      {/* Encabezado de la tarjeta */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3.5 px-[18px] py-4 bg-transparent border-none cursor-pointer text-left"
      >
        <div
          className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
          style={{ backgroundColor: typeMeta.bg }}
        >
          <TypeIcon style={{ width: "18px", height: "18px", color: typeMeta.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.9rem] font-semibold text-edu-ink">{assignment.title}</span>
            <span
              className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill"
              style={{ backgroundColor: typeMeta.bg, color: typeMeta.color }}
            >
              {typeMeta.label}
            </span>
          </div>
          <div className="flex gap-3 mt-1 flex-wrap">
            <span className="text-[0.775rem] text-edu-ink-500 flex items-center gap-1">
              <Clock style={{ width: "11px", height: "11px" }} />
              {assignment.dueDate}
            </span>
            <span className="text-[0.775rem] text-edu-ink-500">Peso: <strong className="text-edu-ink-700">{assignment.weight}</strong></span>
            {assignment.status === "graded" && (
              <span className="text-[0.775rem] text-edu-success font-semibold">
                Nota: {assignment.grade}/100
              </span>
            )}
          </div>
        </div>

        <span
          className="text-[0.7rem] font-semibold px-2.5 py-[3px] rounded-edu-pill shrink-0"
          style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
        >
          {statusMeta.label}
        </span>

        <div className="text-edu-ink-400 shrink-0">
          {expanded ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
        </div>
      </button>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-edu-border-soft px-[18px] py-5 bg-edu-tint flex flex-col gap-4">
          {assignment.description && (
            <div>
              <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                Instrucciones
              </p>
              <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                {assignment.description}
              </p>
            </div>
          )}

          {assignment.topics && assignment.topics.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <ListChecks style={{ width: "15px", height: "15px" }} className="text-edu-primary" />
                <p className="text-[0.78rem] font-semibold text-edu-ink-700 m-0">
                  Temas requeridos ({assignment.topics.length})
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {assignment.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-start gap-2.5 px-3.5 py-2.5 bg-edu-primary-50 rounded-edu-chip border border-edu-primary-100"
                  >
                    <div className="w-[22px] h-[22px] rounded-full bg-edu-primary text-white flex items-center justify-center text-[0.7rem] font-bold shrink-0 mt-px">
                      {topic.id}
                    </div>
                    <span className="text-sm text-[#1e3a5f] leading-[1.5]">{topic.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignment.hasAttachment && (
            <div className="pt-1">
              <button className="w-full inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] border-[1.5px] border-edu-success-200 bg-edu-success-bg text-edu-success text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-success-100">
                <Download style={{ width: "15px", height: "15px" }} />
                Descargar prueba adjunta
                {assignment.attachmentName && (
                  <span className="text-xs text-edu-ink-500 font-normal">
                    · {assignment.attachmentName}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CoursesPage() {
  const [searchParams] = useSearchParams();
  const isPendiente = searchParams.get("pendiente") === "true";

  const [filter, setFilter] = useState<"Todas" | "Pendientes" | "Calificadas">("Todas");
  const { data: course, loading: loadingCourse } = useFetch(getMateriaActual, null);
  const { data: teacher, loading: loadingTeacher } = useFetch(getMateriaActualDocente, null);
  const { data: assignments, loading: loadingAssignments } = useFetch(getMateriaActualEvaluaciones, []);

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const gradedCount = assignments.filter((a) => a.status === "graded").length;
  const filteredAssignments = assignments.filter((a) =>
    filter === "Todas" ? true : filter === "Calificadas" ? a.status === "graded" : a.status !== "graded",
  );

  if (loadingCourse || loadingTeacher || loadingAssignments) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <>
      {/* Banner de la materia */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        <div className="lg:col-span-2 space-y-2">
          <div className={`${isPendiente ? "bg-edu-danger" : "bg-edu-primary"} rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3`}>
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                  {course!.code} · {course!.section}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h2 className="text-white text-xl font-bold m-0">{course!.name}</h2>
                {isPendiente && (
                  <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.35)]">
                    Materia pendiente
                  </span>
                )}
              </div>
              <div className="flex gap-4 flex-wrap">
                {[course!.schedule, course!.room, `Período ${course!.term}`].map((item) => (
                  <span key={item} className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{item}</span>
                ))}

                <Link to="/estudiante/mensajes" className="h-7 rounded-[7px] bg-edu-success-bg flex items-center gap-2 justify-center w-full">
                  <MessageCircle style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                  <span className="text-[0.8rem] text-edu-success">Chat grupal de la materia</span>
                </Link>

              </div>
            </div>
            <div className="flex justify-center gap-3 w-full">
              {[
                { label: "Pendientes", value: pendingCount },
                { label: "Calificadas", value: gradedCount },
              ].map(({ label, value }) => (
                <div key={label} className=" w-full bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
                  <div className="text-[1.3rem] font-bold text-white">{value}</div>
                  <div className="text-[0.72rem] text-[rgba(255,255,255,0.75)] mt-px">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de notas */}
          <div className="grid grid-cols-2 bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-4 gap-0">
            {[
              { label: "Completadas", value: `${gradedCount}/${assignments.length}`, color: color.success },
              { label: "Promedio ponderado", value: "91,5", color: color.primary },
              { label: "Peso restante", value: "65%", color: color.warning },
              { label: "Proyección final", value: "En buen camino", color: color.purple },
            ].map(({ label, value, color: dot }, i, arr) => (
              <div
                key={label}
                className={`flex-1 px-4 py-2.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}
              >
                <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">{label}</div>
                <div className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: dot }} />
                  <span className="text-base font-bold text-edu-ink">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Datos del docente */}
          <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-[18px] flex items-center gap-4 flex-wrap">
            <div className="w-[52px] h-[52px] rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-base font-bold text-edu-primary shrink-0">
              {teacher!.initials}
            </div>

            <div className="flex-1 min-w-[160px]">
              <div className="text-[0.9375rem] font-bold text-edu-ink">{teacher!.name}</div>
              <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{teacher!.title}</div>
            </div>

            <div className="w-px h-10 bg-edu-border-soft shrink-0" />

            <div className="flex flex-col gap-1.5">
              <a
                href={`tel:${teacher!.phone}`}
                className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
              >
                <div className="w-7 h-7 rounded-[7px] bg-edu-success-bg flex items-center justify-center">
                  <Phone style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                </div>
                <span className="font-medium">{teacher!.phone}</span>
              </a>
              <a
                href={`mailto:${teacher!.email}`}
                className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
              >
                <div className="w-7 h-7 rounded-[7px] bg-edu-primary-50 flex items-center justify-center">
                  <Mail style={{ width: "13px", height: "13px" }} className="text-edu-primary" />
                </div>
                <span className="font-medium">{teacher!.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Plan de evaluación */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
            <div>
              <h3 className="m-0 text-edu-ink font-bold text-base">Plan de evaluación</h3>
              <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.8rem]">
                {filteredAssignments.length} de {assignments.length} evaluaciones · Peso total: 100%
              </p>
            </div>
            <div className="flex gap-1.5">
              {(["Todas", "Pendientes", "Calificadas"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-[5px] rounded-[7px] border-[1.5px] text-[0.775rem] font-medium cursor-pointer ${filter === f ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredAssignments.length === 0 ? (
              <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-10 text-center text-edu-ink-400 text-sm">
                No hay evaluaciones {filter === "Pendientes" ? "pendientes" : "calificadas"}.
              </div>
            ) : (
              filteredAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            )}
          </div>
        </div>

      </div>
    </>

  );
}
