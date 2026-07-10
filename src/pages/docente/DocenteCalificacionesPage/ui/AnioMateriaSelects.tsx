import { LapsoFilter } from "@shared/ui/LapsoFilter";

interface AnioMateriaSelectsProps {
    anio: string;
    setAnio: (v: string) => void;
    materia: string;
    setMateria: (v: string) => void;
    ANIOS: string[];
    MATERIAS: string[];
    selectCls: string;
}

export function AnioMateriaSelects({
    anio,
    setAnio,
    materia,
    setMateria,
    ANIOS,
    MATERIAS,
    selectCls,
}: AnioMateriaSelectsProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 grid md:grid-cols-2 items-end gap-4">
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                <label className="text-edu-ink-700 text-sm font-medium">Año</label>
                <select value={anio} onChange={(e) => setAnio(e.target.value)} className={selectCls}>
                    {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                <label className="text-edu-ink-700 text-sm font-medium">Materia</label>
                <select value={materia} onChange={(e) => setMateria(e.target.value)} className={selectCls}>
                    {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
                <LapsoFilter />
            </div>
        </div>
    );
}
