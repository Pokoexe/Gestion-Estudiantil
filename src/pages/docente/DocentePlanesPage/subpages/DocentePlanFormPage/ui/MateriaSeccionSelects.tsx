interface MateriaSeccionSelectsProps {
    form: { subject: string; section: string };
    setForm: (form: { subject: string; section: string }) => void;
    MATERIA_OPTIONS: string[];
    SECCION_OPTIONS: string[];
    inputCls: string;
    labelCls: string;
}

export function MateriaSeccionSelects({
    form,
    setForm,
    MATERIA_OPTIONS,
    SECCION_OPTIONS,
    inputCls,
    labelCls,
}: MateriaSeccionSelectsProps) {
    return (
        /* Materia + sección: selects solo al crear (en modificar van en el banner) */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Materia</label>
                <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={`${inputCls} cursor-pointer`}
                >
                    <option value="">Selecciona una materia</option>
                    {MATERIA_OPTIONS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Sección</label>
                <select
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className={`${inputCls} cursor-pointer`}
                >
                    <option value="">Selecciona una sección</option>
                    {SECCION_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
