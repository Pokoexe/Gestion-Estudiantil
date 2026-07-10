import { Wrench } from "lucide-react";
import { color } from "@themes/tokens";
import type { EtapaStatus, RepairSubjectDetail } from "@shared/services/actions/estudiante";
import { CarouselArrows, CarouselDots } from "@/pages/Auth/LandingPage/ui/LandingView";
import type { ThemePalette } from "@/pages/Auth/LandingPage/functions/themes";

export const ETAPA_META: Record<EtapaStatus, { label: string; dot: string }> = {
    passed: { label: "Aprobada", dot: color.success },
    failed: { label: "Reprobada", dot: color.danger },
    in_progress: { label: "En curso", dot: color.primary },
    pending: { label: "Pendiente", dot: color.ink400 },
};

interface StageTabsProps {
    subject: RepairSubjectDetail;
    activeIdx: number;
    setActiveIdx: (idx: number) => void;
    page: number;
    setPage: (p: number) => void;
    pageCount: number;
    setPaused: (v: boolean) => void;
    go: (dir: -1 | 1) => void;
    theme: ThemePalette;
    glass: React.CSSProperties;
    itemsPerPage: number;
}

/** Pestañas de etapa de reparación (carrusel responsive). */
export function StageTabs({
    subject, activeIdx, setActiveIdx,
    page, setPage, pageCount, setPaused, go,
    theme, glass, itemsPerPage,
}: StageTabsProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-edu-primary" />
                <span className="text-[0.72rem] text-edu-ink-500 font-semibold uppercase tracking-[0.06em]">
                    Etapas de reparación · {subject.name}
                </span>
            </div>


            <div className="" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                <div className="relative">
                    <div key={page} className="lp-anim-fade grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-16">
                        {subject.etapas
                            /* Usamos la variable dinámica en lugar de un número fijo */
                            .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
                            .map((etapa, relativeIdx) => {

                                /* La matemática del índice absoluto también usa la variable dinámica */
                                const absoluteIdx = page * itemsPerPage + relativeIdx;

                                const meta = ETAPA_META[etapa.status];
                                const isActive = absoluteIdx === activeIdx;

                                return (
                                    <div key={etapa.schedule} className="group overflow-hidden rounded-2xl transition-transform hover:-translate-y-1" style={glass}>
                                        <button
                                            key={etapa.room}
                                            onClick={() => setActiveIdx(absoluteIdx)}
                                            className={`flex w-full items-center gap-2 px-4 py-2.5 rounded-edu-control border-[1.5px] text-sm font-semibold cursor-pointer transition-colors ${isActive ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-edu-surface text-edu-ink-500 hover:border-edu-primary-200"}`}
                                        >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                            Etapa {etapa.order}
                                            <span className="text-[0.7rem] font-medium" style={{ color: meta.dot }}>
                                                · {meta.label}
                                            </span>
                                        </button>
                                    </div>
                                )
                            })}
                    </div>
                    <CarouselArrows pageCount={pageCount} go={go} theme={theme} />
                </div>
                <CarouselDots pageCount={pageCount} page={page} setPage={setPage} theme={theme} />
            </div>

        </div>
    );
}
