interface Props {
  selAnio: string;
  anios: string[];
  onAnio: (a: string) => void;
}

export function AnioSelector({ selAnio, anios, onAnio }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex gap-3 items-end flex-wrap">
      <div className="flex flex-col gap-1.5">
        <label className="text-edu-ink-700 text-[0.8125rem] font-medium">Año</label>
        <select
          value={selAnio}
          onChange={(e) => onAnio(e.target.value)}
          className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600 min-w-[160px]"
        >
          <option value="">Selecciona un año…</option>
          {anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
