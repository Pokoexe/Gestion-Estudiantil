import { Clock, CheckCircle2, AlertCircle, ClipboardCheck } from "lucide-react";
import { color } from "../theme/tokens";

const SCHEDULE: {
    day: string;
    classes: { time: string; subject: string; teacher: string; color: string }[];
}[] = [
        {
            day: "Lun",
            classes: [
                {
                    time: "07:00",
                    subject: "Matemática",
                    teacher: "Prof. Ramírez",
                    color: "#dbeafe",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Mar",
            classes: [
                {
                    time: "07:00",
                    subject: "Literatura",
                    teacher: "Prof. García",
                    color: "#dcfce7",
                },
                {
                    time: "10:00",
                    subject: "Historia",
                    teacher: "Prof. Flores",
                    color: "#fce7f3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Mié",
            classes: [
                {
                    time: "08:00",
                    subject: "Química",
                    teacher: "Prof. Méndez",
                    color: "#ede9fe",
                },
                {
                    time: "11:00",
                    subject: "Matemática",
                    teacher: "Prof. Ramírez",
                    color: "#dbeafe",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Jue",
            classes: [
                {
                    time: "07:00",
                    subject: "Inglés",
                    teacher: "Prof. Collins",
                    color: "#ffedd5",
                },
                {
                    time: "09:00",
                    subject: "Biología",
                    teacher: "Prof. Ruiz",
                    color: "#dcfce7",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Vie",
            classes: [
                {
                    time: "08:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "10:00",
                    subject: "Arte",
                    teacher: "Prof. Vega",
                    color: "#fce7f3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
    ];

const PENDING_EVALS = [
    {
        id: 1,
        subject: "Matemática",
        type: "Examen parcial",
        dueDate: "5 jul 2026",
        weight: "30%",
        status: "upcoming",
        dot: color.primary,
    },
    {
        id: 2,
        subject: "Química",
        type: "Informe de laboratorio",
        dueDate: "7 jul 2026",
        weight: "15%",
        status: "upcoming",
        dot: color.purple,
    },
    {
        id: 3,
        subject: "Literatura",
        type: "Entrega de ensayo",
        dueDate: "10 jul 2026",
        weight: "20%",
        status: "upcoming",
        dot: color.success,
    },
    {
        id: 4,
        subject: "Historia",
        type: "Exposición oral",
        dueDate: "12 jul 2026",
        weight: "25%",
        status: "late",
        dot: color.danger,
    },
];

export function MateriasPage() {
    const today = new Date();
    const dayIndex = today.getDay();
    const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie"];
    const activeDay =
        dayIndex >= 1 && dayIndex <= 5 ? weekdays[dayIndex - 1] : "Lun";

    return (
        <>
            <div className="grid grid-cols-3 gap-2">


                {/* Mejor materia */}
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Mejor Materia
                            </p>
                            <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                                Física
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-edu-primary" />
                        </div>
                    </div>
                    <div className="flex align-items justify-between space-y-1.5">
                        <p className="text-edu-ink-400 text-xs m-0">
                            Prof. Jonny
                        </p>
                        <span className={`font-semibold px-2 py-[3px] rounded-[6px] text-white bg-edu-success`}>
                            Promedio de 19
                        </span>
                    </div>
                </div>

                {/* Próxima evaluación */}
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Próxima evaluación
                            </p>
                            <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                                Matemática - Examen
                            </p>
                            <p className="text-edu-ink-400 text-xs m-0">
                                Limites y Derivadas
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-edu-primary" />
                        </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="bg-edu-primary-50 text-edu-primary text-[0.7rem] font-semibold px-2 py-[3px] rounded-[6px]">
                            Hoy · 12:20
                        </span>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">
                        Prof. Ramírez · Comienza en 3 h 20 min
                    </p>
                </div>

                {/* Asistencia promedio */}
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Promedio de Asistencia
                            </p>
                            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                                92,4 %
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`}
                            />
                        ))}
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">
                        2 inasistencias este lapso · Mínimo exigido: 75 %
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Evaluaciones pendientes */}
                <div className="col-span-2 bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                            Evaluaciones pendientes de la semana
                        </h3>
                        <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">
                            Ver todas →
                        </span>
                    </div>
                    <div>
                        <div className="grid grid-cols-[1fr_1.2fr_1fr_0.5fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Materia", "Evaluación", "Fecha", "Porcentaje", "Estado"].map((h) => (
                                <span
                                    key={h}
                                    className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                                >
                                    {h}
                                </span>
                            ))}
                        </div>
                        {PENDING_EVALS.map((ev, i) => (
                            <div
                                key={ev.id}
                                className={`grid grid-cols-[1fr_1.2fr_1fr_0.5fr_0.8fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < PENDING_EVALS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: ev.dot }}
                                    />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">
                                        {ev.subject}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {ev.type}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                                    <span className="text-[0.8125rem] text-edu-ink-500">
                                        {ev.dueDate}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700 font-semibold">
                                    {ev.weight}
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ev.status === "late" ? "bg-edu-danger-bg text-edu-danger" : "bg-edu-warning-bg text-edu-warning"}`}
                                >
                                    {ev.status === "late" ? "Atrasada" : "Próxima"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resultados de evaluaciones */}
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                            Resultados de evaluaciones
                        </h3>
                        <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">
                            Ver todas →
                        </span>
                    </div>
                    <div>
                        <div className="grid grid-cols-[1fr_1.2fr_1fr_0.5fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Materia", "Evaluación", "Fecha", "Calificación"].map((h) => (
                                <span
                                    key={h}
                                    className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                                >
                                    {h}
                                </span>
                            ))}
                        </div>
                        {PENDING_EVALS.map((ev, i) => (
                            <div
                                key={ev.id}
                                className={`grid grid-cols-[1fr_1.2fr_1fr_0.5fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < PENDING_EVALS.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: ev.dot }}
                                    />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">
                                        {ev.subject}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {ev.type}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                                    <span className="text-[0.8125rem] text-edu-ink-500">
                                        {ev.dueDate}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700 font-semibold">
                                    {ev.weight}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
