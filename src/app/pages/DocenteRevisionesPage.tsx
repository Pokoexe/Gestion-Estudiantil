import { useState } from "react";
import { useNavigate } from "react-router";
import {
    ClipboardList,
    CheckCircle2,
    X,
    FileText,
    AlertTriangle,
    CalendarCheck,
    Download,
    Upload,
    Send,
    Pencil,
} from "lucide-react";
import { color } from "../theme/tokens";
import { PLANIFICACIONES } from "../data/planificaciones";
import { PLANS } from "../data/plans";

type RevType = "examen" | "tema" | "planificacion" | "plan";
type RevEstado = "Por revisar" | "Cambios enviados";

interface Revision {
    id: string;
    type: RevType;
    title: string;
    materia: string;
    seccion: string;
    fecha: string;
    adjunto: string;
    estado: RevEstado;
    detalle?: string;
}

const TYPE_META: Record<
    RevType,
    { badge: string; block: string; hint: string; icon: React.FC<{ style?: React.CSSProperties }>; bg: string; fg: string }
> = {
    examen: { badge: "Examen", block: "Exámenes", hint: "Pruebas por revisar", icon: FileText, bg: color.warningBg, fg: color.warning },
    tema: { badge: "Tema", block: "Temas reprobadas", hint: "Materias reprobadas", icon: AlertTriangle, bg: color.dangerBg, fg: color.danger },
    planificacion: { badge: "Planificación", block: "Planificaciones", hint: "En revisión", icon: CalendarCheck, bg: color.purpleBg, fg: color.purple },
    plan: { badge: "Plan", block: "Planes de evaluación", hint: "En revisión", icon: ClipboardList, bg: color.primary100, fg: color.primary },
};

/* Exámenes y temas de materias reprobadas (mock). Planificaciones y planes se
   derivan de los stores compartidos (los que están "En revisión"). */
const EXAMENES: Omit<Revision, "estado">[] = [
    { id: "ex-1", type: "examen", title: "Examen · Unidad 3", materia: "Ciencias Naturales", seccion: "4.º Año B", fecha: "5 jul 2026", adjunto: "examen_u3_4B.pdf", detalle: "El evaluador solicitó reformular la pregunta 4 y ajustar la ponderación." },
    { id: "ex-2", type: "examen", title: "Examen · Genética", materia: "Biología", seccion: "5.º Año A", fecha: "7 jul 2026", adjunto: "examen_genetica_5A.pdf", detalle: "Corregir el enunciado del problema 2." },
];

const TEMAS: Omit<Revision, "estado">[] = [
    { id: "tm-1", type: "tema", title: "Temario de recuperación", materia: "Química", seccion: "5.º Año B", fecha: "9 jul 2026", adjunto: "reparacion_quimica_5B.pdf", detalle: "Detallar los temas del período de reparación y adjuntar el material corregido." },
    { id: "tm-2", type: "tema", title: "Temario de recuperación", materia: "Ciencias de la Tierra", seccion: "3.º Año C", fecha: "10 jul 2026", adjunto: "reparacion_ct_3C.pdf", detalle: "Incluir el cronograma de las evaluaciones de recuperación." },
];

function buildRevisiones(): Revision[] {
    const planif: Revision[] = PLANIFICACIONES.filter((p) => p.status === "review").map((p) => ({
        id: `planif-${p.id}`,
        type: "planificacion",
        title: `Planificación · ${p.count} sesiones`,
        materia: p.subject,
        seccion: p.section,
        fecha: "1 jul 2026",
        adjunto: `planificacion_${p.subject.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        estado: "Por revisar",
        detalle: "Planificación enviada al coordinador. Modifícala si se solicitan cambios.",
    }));
    const planes: Revision[] = PLANS.filter((p) => p.status === "review").map((p) => ({
        id: `plan-${p.id}`,
        type: "plan",
        title: `Plan de evaluación · ${p.count} evaluaciones`,
        materia: p.subject,
        seccion: p.section,
        fecha: "1 jul 2026",
        adjunto: `plan_${p.subject.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        estado: "Por revisar",
        detalle: "Plan de evaluación enviado al evaluador. Modifícalo si se solicitan cambios.",
    }));
    return [
        ...EXAMENES.map((e) => ({ ...e, estado: "Por revisar" as RevEstado })),
        ...TEMAS.map((t) => ({ ...t, estado: "Por revisar" as RevEstado })),
        ...planif,
        ...planes,
    ];
}

const TABS: { key: "todos" | RevType; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "examen", label: "Exámenes" },
    { key: "tema", label: "Temas de materias reprobadas" },
    { key: "planificacion", label: "Planificaciones" },
    { key: "plan", label: "Planes de evaluación" },
];

const COLS = "grid-cols-[1fr_1.9fr_0.9fr_0.9fr_0.9fr_0.9fr]";
const HEADERS = ["Tipo", "Detalle", "Sección", "Fecha", "Estado", "Acción"];

export function DocenteRevisionesPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<Revision[]>(() => buildRevisiones());
    const [tab, setTab] = useState<"todos" | RevType>("todos");
    const [selected, setSelected] = useState<Revision | null>(null);
    const [changeFile, setChangeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);

    const countOf = (t: RevType) => items.filter((i) => i.type === t).length;
    const filtradas = tab === "todos" ? items : items.filter((i) => i.type === tab);

    const openItem = (r: Revision) => {
        setSelected(r);
        setChangeFile(null);
    };

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setChangeFile({ url: URL.createObjectURL(file), name: file.name, isImage: file.type.startsWith("image/") });
    };

    const enviarCambio = (id: string) => {
        setItems((rs) => rs.map((r) => (r.id === id ? { ...r, estado: "Cambios enviados" } : r)));
        setSelected(null);
        setChangeFile(null);
    };

    const irAEditar = (r: Revision) => {
        const numId = r.id.split("-")[1];
        navigate(r.type === "planificacion" ? `/docente/planificacion/${numId}/editar` : `/docente/planes/${numId}/editar`);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Revisiones</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Aplica los cambios solicitados en exámenes, temas de reparación, planificaciones y planes de evaluación
                </p>
            </div>

            {/* Bloques por categoría (cantidad que hay) */}
            <div className="grid grid-cols-4 gap-4">
                {(["examen", "tema", "planificacion", "plan"] as RevType[]).map((t) => {
                    const m = TYPE_META[t];
                    const Icon = m.icon;
                    return (
                        <div key={t} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">{m.block}</p>
                                    <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{countOf(t)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: m.bg }}>
                                    <Icon style={{ width: "20px", height: "20px", color: m.fg }} />
                                </div>
                            </div>
                            <p className="text-edu-ink-400 text-xs m-0">{m.hint}</p>
                        </div>
                    );
                })}
            </div>

            {/* Tarjeta con tabs + tabla */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                {/* Tabs */}
                <div className="px-5 pt-3 border-b border-edu-border-soft flex gap-1 flex-wrap">
                    {TABS.map((t) => {
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setTab(t.key)}
                                className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${active ? "border-edu-primary text-edu-primary" : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Cabecera de tabla */}
                <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                    {HEADERS.map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                    ))}
                </div>

                {/* Filas */}
                {filtradas.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-edu-ink-400">No hay revisiones de este tipo.</div>
                ) : (
                    filtradas.map((r, i) => {
                        const m = TYPE_META[r.type];
                        const Icon = m.icon;
                        const redirige = r.type === "planificacion" || r.type === "plan";
                        return (
                            <div
                                key={r.id}
                                onClick={() => openItem(r)}
                                className={`grid ${COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < filtradas.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                    style={{ backgroundColor: m.bg, color: m.fg }}
                                >
                                    <Icon style={{ width: "12px", height: "12px" }} />
                                    {m.badge}
                                </span>
                                <div className="min-w-0 pr-2">
                                    <div className="text-sm text-edu-ink font-medium truncate">{r.title}</div>
                                    <div className="text-[0.72rem] text-edu-ink-400 truncate">{r.materia}</div>
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500">{r.seccion}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{r.fecha}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${r.estado === "Cambios enviados" ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                                    {r.estado}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold">
                                    {redirige ? "Modificar" : "Subir cambio"}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal de detalle / acción de la revisión */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                            const m = TYPE_META[selected.type];
                            const Icon = m.icon;
                            const redirige = selected.type === "planificacion" || selected.type === "plan";
                            return (
                                <>
                                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: m.bg }}>
                                                <Icon style={{ width: "18px", height: "18px", color: m.fg }} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{selected.title}</h3>
                                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.materia} · {selected.seccion}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelected(null)} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col gap-4">
                                        {selected.detalle && (
                                            <div>
                                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Cambio solicitado</div>
                                                <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{selected.detalle}</p>
                                            </div>
                                        )}

                                        {/* Documento actual */}
                                        <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                            <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-edu-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-edu-ink truncate">{selected.adjunto}</div>
                                                <div className="text-xs text-edu-ink-400">Documento actual</div>
                                            </div>
                                            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0">
                                                <Download className="w-3.5 h-3.5" />
                                                Descargar
                                            </button>
                                        </div>

                                        {/* Acción según tipo */}
                                        {redirige ? (
                                            <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                                                <Pencil className="w-4 h-4 shrink-0 mt-px" />
                                                <span>Para aplicar los cambios, abre la {selected.type === "planificacion" ? "planificación" : "plan de evaluación"} y edítalo directamente.</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Adjuntar archivo con el cambio</label>
                                                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary-200 text-edu-ink-500 text-[0.8125rem]">
                                                    <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onChangeFile} />
                                                    <Upload className="w-4 h-4" />
                                                    {changeFile ? "Cambiar archivo" : "Subir el examen o documento corregido"}
                                                </label>
                                                {changeFile && (
                                                    <div className="mt-1">
                                                        {changeFile.isImage ? (
                                                            <img src={changeFile.url} alt={changeFile.name} className="max-h-48 w-full object-contain rounded-edu-control border border-edu-border-soft bg-edu-subtle" />
                                                        ) : (
                                                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                                                <FileText className="w-4 h-4 text-edu-primary shrink-0" />
                                                                <span className="text-[0.8125rem] text-edu-ink truncate">{changeFile.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-2">
                                        <button onClick={() => setSelected(null)} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                                            Cerrar
                                        </button>
                                        {redirige ? (
                                            <button
                                                onClick={() => irAEditar(selected)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                {selected.type === "planificacion" ? "Modificar planificación" : "Modificar plan"}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => enviarCambio(selected.id)}
                                                disabled={!changeFile}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <Send className="w-4 h-4" />
                                                Enviar cambio
                                            </button>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
