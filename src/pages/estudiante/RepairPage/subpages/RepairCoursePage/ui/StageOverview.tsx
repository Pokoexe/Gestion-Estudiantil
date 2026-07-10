import { Link } from "react-router";
import { Phone, Mail, Wrench, MessageCircle } from "lucide-react";
import { color } from "@themes/tokens";
import type { Etapa, RepairSubjectDetail } from "@shared/services/actions/estudiante";
import { ETAPA_META } from "./StageTabs";

interface StageOverviewProps {
    subject: RepairSubjectDetail;
    etapa: Etapa;
    pendingCount: number;
    gradedCount: number;
}

/** Columna izquierda: banner de la etapa, resumen y datos del docente. */
export function StageOverview({ subject, etapa, pendingCount, gradedCount }: StageOverviewProps) {
    return (
        <div className="lg:col-span-2 space-y-2">
            {/* Banner de la etapa */}
            <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <Wrench style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                        <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                            {subject.code} · {subject.section} · Etapa {etapa.order} de {subject.etapas.length}
                        </span>
                    </div>
                    <h2 className="text-white mb-1.5 text-xl font-bold m-0">{subject.name}</h2>
                    <div className="flex gap-4 flex-wrap">
                        {[etapa.schedule, etapa.room, `Período ${etapa.term}`].map((item) => (
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

            {/* Resumen de la etapa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-4 gap-0">
                {[
                    { label: "Completadas", value: `${gradedCount}/${etapa.assignments.length}`, color: color.success },
                    { label: "Promedio de la etapa", value: etapa.finalAverage ? `${etapa.finalAverage}/20` : "En curso", color: color.primary },
                    { label: "Estado de la etapa", value: ETAPA_META[etapa.status].label, color: ETAPA_META[etapa.status].dot },
                    { label: "Etapa", value: `${etapa.order} de ${subject.etapas.length}`, color: color.purple },
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
                    {subject.teacher.initials}
                </div>

                <div className="flex-1 min-w-[160px]">
                    <div className="text-[0.9375rem] font-bold text-edu-ink">{subject.teacher.name}</div>
                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{subject.teacher.title}</div>
                </div>

                <div className="w-px h-10 bg-edu-border-soft shrink-0" />

                <div className="flex flex-col gap-1.5">
                    <a
                        href={`tel:${subject.teacher.phone}`}
                        className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
                    >
                        <div className="w-7 h-7 rounded-[7px] bg-edu-success-bg flex items-center justify-center">
                            <Phone style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                        </div>
                        <span className="font-medium">{subject.teacher.phone}</span>
                    </a>
                    <a
                        href={`mailto:${subject.teacher.email}`}
                        className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
                    >
                        <div className="w-7 h-7 rounded-[7px] bg-edu-primary-50 flex items-center justify-center">
                            <Mail style={{ width: "13px", height: "13px" }} className="text-edu-primary" />
                        </div>
                        <span className="font-medium">{subject.teacher.email}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
