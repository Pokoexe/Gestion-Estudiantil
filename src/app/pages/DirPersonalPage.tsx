import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users2,
  Eye,
  Pencil,
  UserPlus,
  XCircle,
  CalendarPlus,
  CalendarClock,
  MapPin,
  Clock,
  Plus,
} from "lucide-react";
import { color } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import { getDocentes, getReuniones, getHorario, type Meeting, type TeacherState } from "../datos_maquetados/actions/director";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const STATE_META: Record<TeacherState, string> = {
  Activo: "bg-edu-success-bg text-edu-success",
  Permiso: "bg-edu-warning-bg text-edu-warning",
  Suplente: "bg-edu-primary-100 text-edu-primary",
};

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
        {action ?? (hint && <span className="text-xs text-edu-ink-400 font-medium">{hint}</span>)}
      </div>
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
      {children}
    </span>
  );
}

function ActionIcon({
  icon: Icon,
  label,
  danger,
}: {
  icon: React.FC<{ style?: React.CSSProperties }>;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`w-8 h-8 rounded-edu-chip border border-edu-border bg-edu-surface flex items-center justify-center cursor-pointer transition-colors ${
        danger ? "text-edu-danger hover:bg-edu-danger-bg hover:border-edu-danger-bg" : "text-edu-ink-500 hover:text-edu-primary hover:border-edu-primary-200"
      }`}
    >
      <Icon style={{ width: "15px", height: "15px" }} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirPersonalPage() {
  const { data: TEACHERS, loading: loadingDocentes } = useFetch(getDocentes, []);
  const { data: SCHEDULE, loading: loadingHorario } = useFetch(getHorario, []);
  const { data: reuniones } = useFetch(getReuniones, []);

  const [tab, setTab] = useState<"docentes" | "reuniones">("docentes");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  useEffect(() => setMeetings(reuniones), [reuniones]);
  const [creating, setCreating] = useState(false);

  const addMeeting = () => {
    const next: Meeting = {
      id: Date.now(),
      title: "Nueva reunión de personal",
      date: "15 jul 2026",
      time: "14:00",
      place: "Sala de profesores",
      attendees: "Por definir",
      status: "Programada",
    };
    setMeetings((m) => [next, ...m]);
    setCreating(false);
  };

  if (loadingDocentes || loadingHorario)
    return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div>
        <h2 className="m-0 text-edu-ink font-bold text-xl">Gestión de personal</h2>
        <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
          Docentes, asignaciones y reuniones institucionales · Período 2026-I
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-1 border-b border-edu-border-soft">
        {[
          { key: "docentes", label: "Docentes", icon: GraduationCap },
          { key: "reuniones", label: "Reuniones", icon: Users2 },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "docentes" | "reuniones")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-[0.85rem] font-semibold border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
                active ? "border-edu-warning text-edu-warning" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
              }`}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* --- Pestaña Docentes --- */}
      {tab === "docentes" && (
        <>
          <SectionCard title="Plantilla docente" hint={`${TEACHERS.length} docentes`}>
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.4fr_1.4fr_0.7fr_1fr_0.8fr_1.2fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                {["Nombre", "Área", "Secciones", "Asistencia", "Estado", "Acciones"].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </div>
              {TEACHERS.map((t, i) => (
                <div
                  key={t.id}
                  className={`grid grid-cols-[1.4fr_1.4fr_0.7fr_1fr_0.8fr_1.2fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < TEACHERS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="text-sm text-edu-ink font-semibold">Prof. {t.name}</span>
                  <span className="text-[0.8125rem] text-edu-ink-500">{t.area}</span>
                  <span className="text-sm text-edu-ink-700">{t.sections}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                      <div className="h-full rounded-edu-pill" style={{ width: `${t.attendance}%`, backgroundColor: t.attendance >= 90 ? color.success : color.warning }} />
                    </div>
                    <span className="text-[0.8rem] text-edu-ink-700 font-medium">{t.attendance} %</span>
                  </div>
                  <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${STATE_META[t.state]}`}>{t.state}</span>
                  <div className="flex items-center gap-1.5">
                    <ActionIcon icon={Eye} label="Ver" />
                    <ActionIcon icon={Pencil} label="Modificar" />
                    <ActionIcon icon={UserPlus} label="Asignar" />
                    <ActionIcon icon={XCircle} label="Cancelar asignación" danger />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </SectionCard>

          {/* Horarios resumido */}
          <SectionCard title="Asignación de docentes por hora" hint="Resumen semanal">
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
              <div className="grid grid-cols-[1fr_1.4fr_1.4fr_1.4fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                {["Bloque", "Lunes", "Miércoles", "Viernes"].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </div>
              {SCHEDULE.map((r, i) => (
                <div
                  key={r.block}
                  className={`grid grid-cols-[1fr_1.4fr_1.4fr_1.4fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < SCHEDULE.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                >
                  <span className="text-[0.8rem] text-edu-ink font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-edu-ink-400 shrink-0" /> {r.block}
                  </span>
                  {[r.monday, r.wednesday, r.friday].map((cell, j) => (
                    <span key={j} className="text-[0.8125rem] text-edu-ink-700 bg-edu-subtle rounded-edu-chip px-2.5 py-1 w-fit">{cell}</span>
                  ))}
                </div>
              ))}
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {/* --- Pestaña Reuniones --- */}
      {tab === "reuniones" && (
        <SectionCard
          title="Reuniones de personal"
          action={
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-edu-control text-[0.8rem] font-semibold border-none cursor-pointer transition-colors text-white hover:opacity-90"
              style={{ backgroundColor: color.warning }}
            >
              <CalendarPlus className="w-4 h-4" /> Crear reunión
            </button>
          }
        >
          {creating && (
            <div className="mx-5 mt-4 p-4 rounded-edu-control border border-edu-warning-bg bg-edu-warning-bg/40 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[0.85rem] text-edu-ink-700">
                Se creará una reunión de ejemplo con datos por defecto. Podrás editarla luego.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCreating(false)}
                  className="px-3.5 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-[0.8rem] font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                >
                  Cancelar
                </button>
                <button
                  onClick={addMeeting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-white text-[0.8rem] font-semibold border-none cursor-pointer transition-colors hover:opacity-90"
                  style={{ backgroundColor: color.warning }}
                >
                  <Plus className="w-4 h-4" /> Confirmar
                </button>
              </div>
            </div>
          )}
          <div className="p-4 flex flex-col gap-3">
            {meetings.map((m) => (
              <div key={m.id} className="border border-edu-border-soft rounded-edu-control px-4 py-3.5 flex items-center gap-3.5 transition-colors hover:border-edu-warning-bg">
                <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0 bg-edu-warning-bg">
                  <CalendarClock style={{ width: "22px", height: "22px", color: color.warning }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.9rem] font-semibold text-edu-ink">{m.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-[0.78rem] text-edu-ink-500 flex-wrap">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> {m.date} · {m.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {m.place}</span>
                    <span className="inline-flex items-center gap-1"><Users2 className="w-3.5 h-3.5" /> {m.attendees}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${m.status === "Programada" ? "bg-edu-primary-100 text-edu-primary" : "bg-edu-success-bg text-edu-success"}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
