export function EnrollCta() {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
            <div>
                <p className="text-edu-ink font-semibold text-[0.95rem] m-0">¿Te interesa este curso?</p>
                <p className="text-edu-ink-500 text-[0.8rem] mt-1 m-0 leading-[1.5]">
                    Inscríbete para participar en las actividades y evaluaciones de este curso.
                </p>
            </div>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-primary-hover">
                Unirse al curso
            </button>
        </div>
    );
}
