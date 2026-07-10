import { useDocenteHorario } from "./functions/useDocenteHorario";
import { MateriasLegend } from "./ui/MateriasLegend";
import { HorarioTable } from "./ui/HorarioTable";

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteHorarioPage() {
    const { HORARIO, SUBJECT_TO_SECTION, navigate, MATERIAS, DIAS, BLOQUES, materiaMap } = useDocenteHorario();

    return (
        <div className="flex flex-col gap-5">
            {/* <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mi horario semanal</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Distribución de clases · Ciclo escolar 2026-I
                </p>
            </div> */}

            <MateriasLegend MATERIAS={MATERIAS} />

            <HorarioTable
                HORARIO={HORARIO}
                SUBJECT_TO_SECTION={SUBJECT_TO_SECTION}
                DIAS={DIAS}
                BLOQUES={BLOQUES}
                materiaMap={materiaMap}
                navigate={navigate}
            />
        </div>
    );
}
