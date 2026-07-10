import {
    ClipboardCheck,
    Check,
    X,
    CheckCircle2,
    UserCheck,
    UserX,
    ClipboardList,
    CalendarPlus,
    Search,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { color, accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { useAttendancePanel } from "../functions/useAttendancePanel";
import { DonutTooltip } from "./DonutTooltip";
import type { PanelProps } from "../interfaces";

const ATT_COLS = "grid-cols-[1.6fr_1fr_1fr_0.8fr]";

export function AttendancePanel({ data, setData, entidad, metaLabel, tablaTitulo, tablaHint, icon: Icon }: PanelProps) {
    const {
        registerOpen,
        setRegisterOpen,
        todayMarks,
        setTodayMarks,
        saved,
        query,
        setQuery,
        setPage,
        presentes,
        ausentes,
        totalReg,
        pct,
        totalPages,
        currentPage,
        paged,
        donutData,
        hoyPresentes,
        hoyAusentes,
        openRegister,
        guardarHoy,
    } = useAttendancePanel(data, setData);

    return (
        <div className="flex flex-col gap-5">
            {/* ---- Grid cols 3: donut (col-span-2) + KPIs (col-span-1) ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Donut */}
                <div className="lg:col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-edu-border-soft">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Asistencia de este mes · {entidad}s</h3>
                        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Distribución de registros · 22 días hábiles</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-4 flex-1 max-sm:flex-col">
                        {/* Gráfica donut con % al centro */}
                        <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="66%"
                                        outerRadius="92%"
                                        paddingAngle={2}
                                        stroke="none"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {donutData.map((d) => (
                                            <Cell key={d.name} fill={d.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DonutTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[1.9rem] font-bold text-edu-ink leading-none">{pct}%</span>
                                <span className="text-[0.7rem] text-edu-ink-400 font-medium mt-1">asistencia</span>
                            </div>
                        </div>
                        {/* Leyenda */}
                        <div className="flex flex-col gap-2.5 flex-1 pl-2">
                            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                                <span className="inline-flex items-center gap-2 text-[0.8125rem] text-edu-ink-700 font-medium">
                                    <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color.success }} />
                                    Presente
                                </span>
                                <span className="text-[0.8125rem] font-bold text-edu-ink">
                                    {presentes.toLocaleString("es")}
                                    <span className="text-edu-ink-400 font-medium"> · {totalReg ? Math.round((presentes / totalReg) * 100) : 0}%</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                                <span className="inline-flex items-center gap-2 text-[0.8125rem] text-edu-ink-700 font-medium">
                                    <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color.danger }} />
                                    Ausente
                                </span>
                                <span className="text-[0.8125rem] font-bold text-edu-ink">
                                    {ausentes.toLocaleString("es")}
                                    <span className="text-edu-ink-400 font-medium"> · {totalReg ? Math.round((ausentes / totalReg) * 100) : 0}%</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPIs */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex-1 flex flex-col justify-center">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-edu-ink-500 text-[0.72rem] font-semibold m-0 uppercase tracking-[0.05em]">Presente</p>
                                <p className="text-[1.9rem] font-bold mt-1.5 m-0 text-edu-success leading-none">{presentes.toLocaleString("es")}</p>
                                <p className="text-edu-ink-400 text-[0.72rem] m-0 mt-1.5">registros del mes</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.green.bg }}>
                                <UserCheck style={{ width: 20, height: 20, color: accent.green.fg }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex-1 flex flex-col justify-center">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-edu-ink-500 text-[0.72rem] font-semibold m-0 uppercase tracking-[0.05em]">Ausente</p>
                                <p className="text-[1.9rem] font-bold mt-1.5 m-0 text-edu-danger leading-none">{ausentes.toLocaleString("es")}</p>
                                <p className="text-edu-ink-400 text-[0.72rem] m-0 mt-1.5">registros del mes</p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.red.bg }}>
                                <UserX style={{ width: 20, height: 20, color: accent.red.fg }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---- Tabla resumen + registrar hoy ---- */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem] flex items-center gap-2">
                            <Icon className="w-4 h-4 text-edu-ink-400" />
                            {tablaTitulo}
                        </h3>
                        <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">{tablaHint}</p>
                    </div>
                    {!registerOpen && (
                        <div className="w-full md:w-auto  flex items-center gap-3">
                            {saved && (
                                <span className="inline-flex items-center gap-1.5 text-edu-success text-[0.8125rem] font-semibold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Asistencia de hoy registrada
                                </span>
                            )}
                            <button
                                onClick={openRegister}
                                className="w-full justify-center md:w-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold cursor-pointer border-none text-white"
                                style={{ backgroundColor: accent.purple.fg }}
                            >
                                <CalendarPlus className="w-4 h-4" />
                                Registrar asistencia de hoy
                            </button>
                        </div>
                    )}
                </div>

                {/* Panel de registro de hoy */}
                {registerOpen && (
                    <div className="border-b border-edu-border-soft bg-edu-primary-50">
                        <div className="px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap border-b border-edu-border-soft">
                            <div className="flex items-center gap-2">
                                <CalendarPlus className="w-4 h-4" style={{ color: accent.purple.fg }} />
                                <span className="text-[0.875rem] font-semibold text-edu-ink">Asistencia de la jornada de hoy</span>
                            </div>
                            <div className="flex gap-2.5">
                                <div className="rounded-edu-control bg-edu-success-bg px-3.5 py-1.5 text-center">
                                    <span className="text-[0.65rem] text-edu-success font-semibold uppercase tracking-[0.04em]">Presentes</span>
                                    <span className="ml-2 text-[1.05rem] font-bold text-edu-success">{hoyPresentes}</span>
                                </div>
                                <div className="rounded-edu-control bg-edu-danger-bg px-3.5 py-1.5 text-center">
                                    <span className="text-[0.65rem] text-edu-danger font-semibold uppercase tracking-[0.04em]">Ausentes</span>
                                    <span className="ml-2 text-[1.05rem] font-bold text-edu-danger">{hoyAusentes}</span>
                                </div>
                            </div>
                        </div>

                        {data.map((p, i) => (
                            <div
                                key={p.id}
                                className={`flex items-center justify-between gap-4 px-5 py-2.5 ${i < data.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-[30px] h-[30px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-[0.7rem] font-bold text-edu-ink-500 shrink-0">
                                        {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                    </div>
                                    <span className="text-[0.875rem] text-edu-ink font-medium truncate">{p.name}</span>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <button
                                        onClick={() => setTodayMarks((m) => ({ ...m, [p.id]: "presente" }))}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.75rem] font-semibold border-[1.5px] cursor-pointer transition-colors ${todayMarks[p.id] === "presente"
                                            ? "bg-edu-success text-white border-edu-success"
                                            : "bg-edu-surface text-edu-ink-500 border-edu-border hover:border-edu-success"
                                            }`}
                                    >
                                        <Check className="w-3 h-3" />
                                        Presente
                                    </button>
                                    <button
                                        onClick={() => setTodayMarks((m) => ({ ...m, [p.id]: "ausente" }))}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.75rem] font-semibold border-[1.5px] cursor-pointer transition-colors ${todayMarks[p.id] === "ausente"
                                            ? "bg-edu-danger text-white border-edu-danger"
                                            : "bg-edu-surface text-edu-ink-500 border-edu-border hover:border-edu-danger"
                                            }`}
                                    >
                                        <X className="w-3 h-3" />
                                        Ausente
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="px-5 py-3.5 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setRegisterOpen(false)}
                                className="px-4 py-2.5 rounded-edu-control text-sm font-semibold bg-edu-subtle text-edu-ink-700 border border-edu-border cursor-pointer hover:bg-edu-border-soft"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarHoy}
                                className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer"
                                style={{ backgroundColor: accent.purple.fg }}
                            >
                                <ClipboardCheck className="w-4 h-4" />
                                Guardar asistencia
                            </button>
                        </div>
                    </div>
                )}

                {/* Buscador */}
                <div className="px-5 py-3 border-b border-edu-border-soft">
                    <div className="relative">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                            placeholder={`Buscar por nombre o ${metaLabel.toLowerCase()}…`}
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                </div>

                {/* Cabecera de la tabla */}
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className={`grid ${ATT_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {[entidad, metaLabel, "Asistencias", "% del mes"].map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                    {h}
                                </span>
                            ))}
                        </div>

                        {/* Filas */}
                        {paged.length === 0 ? (
                            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">
                                No hay registros que coincidan con la búsqueda.
                            </p>
                        ) : (
                            paged.map((p, i) => {
                                const rowPct = Math.round((p.present / p.total) * 100);
                                const good = rowPct >= 90;
                                return (
                                    <div
                                        key={p.id}
                                        className={`grid ${ATT_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-[34px] h-[34px] rounded-full bg-edu-subtle border border-edu-border flex items-center justify-center text-xs font-bold text-edu-ink-500 shrink-0">
                                                {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                            </div>
                                            <span className="text-sm text-edu-ink font-medium">{p.name}</span>
                                        </div>
                                        <span className="text-[0.8125rem] text-edu-ink-700">{p.meta}</span>
                                        <span className="text-[0.8125rem] text-edu-ink-700 flex items-center gap-1.5">
                                            <ClipboardList className="w-3.5 h-3.5 text-edu-ink-400" />
                                            {p.present} / {p.total} días
                                        </span>
                                        <span
                                            className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${good ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}
                                        >
                                            {rowPct} %
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
