import { useState } from "react";
import {
    ClipboardCheck,
    Check,
    X,
    Clock,
    CheckCircle2,
    Phone,
    Users,
    UserCheck,
    ClipboardList,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";
import { color } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos e interfaces locales                                          */
/* ------------------------------------------------------------------ */

type EstadoAsistencia = "presente" | "ausente" | "tarde";

interface Estudiante {
    id: number;
    name: string;
    cedula: string;
}

interface SeccionOpt {
    id: string;
    label: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const SECCIONES: SeccionOpt[] = [
    { id: "cn-4b", label: "Ciencias Naturales · 4.º Año B" },
    { id: "bio-5a", label: "Biología · 5.º Año A" },
    { id: "tierra-3c", label: "Ciencias de la Tierra · 3.º Año C" },
    { id: "quim-5b", label: "Química · 5.º Año B" },
];

const ESTUDIANTES: Estudiante[] = [
    { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678" },
    { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321" },
    { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109" },
    { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870" },
    { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542" },
    { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233" },
    { id: 7, name: "Gabriela Alejandra Mora", cedula: "V-31.902.117" },
    { id: 8, name: "Ricardo Antonio Salazar", cedula: "V-30.338.904" },
];

const ESTADOS: { key: EstadoAsistencia; label: string; icon: React.FC<{ className?: string }>; on: string; off: string }[] = [
    { key: "presente", label: "Presente", icon: Check, on: "bg-edu-success text-white border-edu-success", off: "bg-edu-surface text-edu-ink-500 border-edu-border hover:border-edu-success" },
    { key: "ausente", label: "Ausente", icon: X, on: "bg-edu-danger text-white border-edu-danger", off: "bg-edu-surface text-edu-ink-500 border-edu-border hover:border-edu-danger" },
    { key: "tarde", label: "Tarde", icon: Clock, on: "bg-edu-warning-strong text-white border-edu-warning-strong", off: "bg-edu-surface text-edu-ink-500 border-edu-border hover:border-edu-warning-strong" },
];

/* ---- Control de asistencia de docentes (coordinación) ---- */

interface TeacherAtt {
    id: number;
    name: string;
    subject: string;
    present: number;
    total: number;
}

const TEACHER_ATT: TeacherAtt[] = [
    { id: 1, name: "Marisela Ríos", subject: "Matemática", present: 21, total: 22 },
    { id: 2, name: "Luis Aponte", subject: "Castellano", present: 20, total: 22 },
    { id: 3, name: "Yaneth Bravo", subject: "Biología", present: 22, total: 22 },
    { id: 4, name: "Óscar Medina", subject: "Historia", present: 18, total: 22 },
    { id: 5, name: "Karina Suárez", subject: "Inglés", present: 19, total: 22 },
];

const RESPONSABLES = ["Coord. Luis Aponte", "Prof. Marisela Ríos", "Aux. Génesis Prieto", "Dir. Ana Belén Ferrer"];

const ATT_COLS = "grid-cols-[1.4fr_1fr_1fr_1fr]";

function TeacherAttTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-edu-surface border border-edu-border rounded-edu-chip shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
            <div style={{ fontSize: "0.7rem", color: color.ink400, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: "0.9rem", color: color.ink, fontWeight: 700, marginTop: "2px" }}>{payload[0].value} % asistencia</div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteAsistenciaPage() {
    const [seccion, setSeccion] = useState(SECCIONES[0].id);
    const [fecha, setFecha] = useState("2026-07-03");
    // Estado por defecto: todos presentes
    const [registro, setRegistro] = useState<Record<number, EstadoAsistencia>>(
        Object.fromEntries(ESTUDIANTES.map((e) => [e.id, "presente"])) as Record<number, EstadoAsistencia>,
    );
    const [saved, setSaved] = useState(false);
    const [responsable, setResponsable] = useState(RESPONSABLES[0]);

    const attChartData = TEACHER_ATT.map((t) => ({ name: t.name.split(" ")[0], pct: Math.round((t.present / t.total) * 100) }));

    const setEstado = (id: number, estado: EstadoAsistencia) => {
        setRegistro((r) => ({ ...r, [id]: estado }));
        setSaved(false);
    };

    const presentes = Object.values(registro).filter((e) => e === "presente").length;
    const ausentes = Object.values(registro).filter((e) => e === "ausente").length;
    const tardes = Object.values(registro).filter((e) => e === "tarde").length;

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Registrar asistencia</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Marca la asistencia de tus estudiantes por sección y fecha
                </p>
            </div>

            {/* Selectores + contadores */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5 min-w-[240px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
                    <select
                        value={seccion}
                        onChange={(e) => {
                            setSeccion(e.target.value);
                            setSaved(false);
                        }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                    >
                        {SECCIONES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-edu-ink-700 text-sm font-medium">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => {
                            setFecha(e.target.value);
                            setSaved(false);
                        }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] cursor-pointer focus:border-edu-primary"
                    />
                </div>

                <div className="flex gap-2.5 ml-auto">
                    <div className="rounded-edu-control bg-edu-success-bg px-4 py-2 text-center min-w-[80px]">
                        <div className="text-[0.65rem] text-edu-success font-semibold uppercase tracking-[0.04em]">Presentes</div>
                        <div className="text-[1.35rem] font-bold text-edu-success leading-tight">{presentes}</div>
                    </div>
                    <div className="rounded-edu-control bg-edu-danger-bg px-4 py-2 text-center min-w-[80px]">
                        <div className="text-[0.65rem] text-edu-danger font-semibold uppercase tracking-[0.04em]">Ausentes</div>
                        <div className="text-[1.35rem] font-bold text-edu-danger leading-tight">{ausentes}</div>
                    </div>
                    <div className="rounded-edu-control bg-edu-warning-bg px-4 py-2 text-center min-w-[80px]">
                        <div className="text-[0.65rem] text-edu-warning font-semibold uppercase tracking-[0.04em]">Tarde</div>
                        <div className="text-[1.35rem] font-bold text-edu-warning-strong leading-tight">{tardes}</div>
                    </div>
                </div>
            </div>

            {/* Aviso al representante */}
            <div className="flex items-start gap-2 px-4 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                <Phone className="w-4 h-4 shrink-0 mt-px" />
                <span>
                    Al guardar la asistencia, se <strong>notifica automáticamente al representante</strong> por teléfono
                    (SMS/WhatsApp) de cada estudiante marcado como <strong>ausente</strong> o <strong>tarde</strong>.
                </span>
            </div>

            {/* Tabla de estudiantes */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem] flex items-center gap-2">
                        <Users className="w-4 h-4 text-edu-ink-400" />
                        Lista de estudiantes
                    </h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">{ESTUDIANTES.length} estudiantes</span>
                </div>

                <div className="grid grid-cols-[0.5fr_2fr_1fr_1.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["#", "Estudiante", "Cédula", "Estado"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                            {h}
                        </span>
                    ))}
                </div>

                {ESTUDIANTES.map((e, i) => (
                    <div
                        key={e.id}
                        className={`grid grid-cols-[0.5fr_2fr_1fr_1.6fr] px-5 py-[11px] items-center ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                    >
                        <span className="text-[0.8125rem] text-edu-ink-400 font-medium">{i + 1}</span>
                        <span className="text-sm text-edu-ink font-medium">{e.name}</span>
                        <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                        <div className="flex gap-1.5">
                            {ESTADOS.map((est) => {
                                const Icon = est.icon;
                                const active = registro[e.id] === est.key;
                                return (
                                    <button
                                        key={est.key}
                                        onClick={() => setEstado(e.id, est.key)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.75rem] font-semibold border-[1.5px] cursor-pointer transition-colors ${active ? est.on : est.off}`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {est.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Guardar */}
                <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-3">
                    {saved && (
                        <span className="inline-flex items-center gap-1.5 text-edu-success text-[0.8125rem] font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            Asistencia guardada · representantes notificados
                        </span>
                    )}
                    <button
                        onClick={() => setSaved(true)}
                        className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        Guardar asistencia
                    </button>
                </div>
            </div>

            {/* Control de asistencia de docentes */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Control de asistencia de docentes</h3>
                        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Resumen del mes · 22 días hábiles</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-edu-ink-400" />
                            Responsable
                        </span>
                        <select
                            value={responsable}
                            onChange={(e) => setResponsable(e.target.value)}
                            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.8125rem] cursor-pointer focus:border-edu-primary"
                        >
                            {RESPONSABLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Gráfica de asistencia */}
                <div className="px-4 pt-5 pb-2">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={attChartData} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barCategoryGap="30%">
                            <CartesianGrid vertical={false} stroke={color.borderSoft} />
                            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: color.border }} tick={{ fill: color.ink400, fontSize: 12 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fill: color.ink400, fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
                            <Tooltip cursor={{ fill: color.successBg }} content={<TeacherAttTooltip />} />
                            <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={46}>
                                {attChartData.map((d, i) => (
                                    <Cell key={i} fill={d.pct >= 90 ? color.success : color.warningStrong} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tabla resumen */}
                <div className={`grid ${ATT_COLS} px-5 py-2.5 bg-edu-subtle border-y border-edu-border-soft`}>
                    {["Docente", "Materia", "Asistencia", "% del mes"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                    ))}
                </div>
                {TEACHER_ATT.map((t, i) => {
                    const pct = Math.round((t.present / t.total) * 100);
                    const good = pct >= 90;
                    return (
                        <div key={t.id} className={`grid ${ATT_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < TEACHER_ATT.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                            <div className="flex items-center gap-2.5">
                                <div className="w-[34px] h-[34px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                </div>
                                <span className="text-sm text-edu-ink font-medium">{t.name}</span>
                            </div>
                            <span className="text-[0.8125rem] text-edu-ink-700">{t.subject}</span>
                            <span className="text-[0.8125rem] text-edu-ink-700 flex items-center gap-1.5">
                                <ClipboardList className="w-3.5 h-3.5 text-edu-ink-400" />
                                {t.present} / {t.total} días
                            </span>
                            <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${good ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                                {pct} %
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
