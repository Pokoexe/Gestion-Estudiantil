import { MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { useFetch } from "../datos_maquetados";
import { getHorario, getMateriaSeccion } from "../datos_maquetados/actions/docente";

/* ------------------------------------------------------------------ */
/* Tipos e interfaces locales                                          */
/* ------------------------------------------------------------------ */

interface Materia {
    key: string;
    name: string;
    bg: string;
    fg: string;
}

/* ------------------------------------------------------------------ */
/* Mapas presentacionales                                             */
/* ------------------------------------------------------------------ */

const MATERIAS: Materia[] = [
    { key: "cn", name: "Ciencias Naturales", bg: "#dbeafe", fg: "#1e40af" },
    { key: "bio", name: "Biología", bg: "#dcfce7", fg: "#166534" },
    { key: "tierra", name: "Ciencias de la Tierra", bg: "#ede9fe", fg: "#5b21b6" },
    { key: "quim", name: "Química", bg: "#ffedd5", fg: "#9a3412" },
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

const BLOQUES = [
    "07:00 - 08:30",
    "08:30 - 10:00",
    "10:15 - 11:45",
    "11:45 - 13:15",
    "14:00 - 15:30",
] as const;

const materiaMap: Record<string, Materia> = Object.fromEntries(
    MATERIAS.map((m) => [m.key, m]),
);

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteHorarioPage() {
    const navigate = useNavigate();
    const { data: HORARIO } = useFetch(getHorario, []);
    const { data: SUBJECT_TO_SECTION } = useFetch(getMateriaSeccion, {});

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mi horario semanal</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Distribución de clases · Ciclo escolar 2026-I
                </p>
            </div>

            {/* Leyenda de materias */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex flex-wrap gap-4">
                {MATERIAS.map((m) => (
                    <div key={m.key} className="flex items-center gap-2">
                        <span
                            className="w-3.5 h-3.5 rounded-edu-chip shrink-0"
                            style={{ backgroundColor: m.bg, border: `1.5px solid ${m.fg}33` }}
                        />
                        <span className="text-[0.8125rem] text-edu-ink-700 font-medium">{m.name}</span>
                    </div>
                ))}
            </div>

            {/* Tabla de horario */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[860px]">
                        {/* Cabecera */}
                        <div className="grid grid-cols-[0.9fr_repeat(5,1fr)] bg-edu-subtle border-b border-edu-border-soft">
                            <span className="px-4 py-3 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                Hora
                            </span>
                            {DIAS.map((d) => (
                                <span
                                    key={d}
                                    className="px-4 py-3 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] text-center"
                                >
                                    {d}
                                </span>
                            ))}
                        </div>

                        {/* Filas por bloque */}
                        {BLOQUES.map((bloque, bi) => (
                            <div
                                key={bloque}
                                className={`grid grid-cols-[0.9fr_repeat(5,1fr)] ${bi < BLOQUES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="px-4 py-3 flex items-center bg-edu-subtle/50">
                                    <span className="text-[0.75rem] font-semibold text-edu-ink-700">{bloque}</span>
                                </div>
                                {(HORARIO[bi] ?? []).map((clase, di) => (
                                    <div key={di} className="p-2 border-l border-edu-border-soft min-h-[74px]">
                                        {clase ? (
                                            <button
                                                onClick={() => navigate("/docente/secciones", { state: { seccionId: SUBJECT_TO_SECTION[clase.subject] } })}
                                                className="w-full h-full text-left rounded-edu-chip px-2.5 py-2 flex flex-col gap-1 cursor-pointer border-none transition-[filter] hover:brightness-95"
                                                style={{ backgroundColor: materiaMap[clase.subject].bg }}
                                            >
                                                <span
                                                    className="text-[0.75rem] font-semibold leading-tight"
                                                    style={{ color: materiaMap[clase.subject].fg }}
                                                >
                                                    {materiaMap[clase.subject].name}
                                                </span>
                                                <span className="text-[0.68rem] font-medium text-edu-ink-700">{clase.grade}</span>
                                                <span className="text-[0.68rem] text-edu-ink-500 flex items-center gap-1">
                                                    <MapPin style={{ width: "11px", height: "11px" }} />
                                                    {clase.room}
                                                </span>
                                            </button>
                                        ) : (
                                            <div className="h-full rounded-edu-chip flex items-center justify-center">
                                                <span className="text-[0.7rem] text-edu-ink-300">Libre</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
