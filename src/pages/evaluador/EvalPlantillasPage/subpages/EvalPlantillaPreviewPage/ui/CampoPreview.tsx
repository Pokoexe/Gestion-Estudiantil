import type { Campo } from "@shared/services/actions/plantilla";

interface Props {
  campo: Campo;
}

export function CampoPreview({ campo }: Props) {
  const base =
    "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-edu-ink-700 text-sm font-medium flex items-center gap-1">
        {campo.nombre} <span className="text-edu-danger">*</span>
      </label>
      {campo.tipo === "Fecha" ? (
        <input type="date" required className={`${base} cursor-pointer`} />
      ) : campo.tipo === "Número" ? (
        <input type="number" required placeholder="0" className={base} />
      ) : campo.tipo === "Selección" ? (
        <select required className={`${base} cursor-pointer`}>
          <option value="">Seleccionar…</option>
        </select>
      ) : campo.tipo === "Sí / No" ? (
        <select required className={`${base} cursor-pointer`}>
          <option value="">Seleccionar…</option>
          <option>Sí</option>
          <option>No</option>
        </select>
      ) : (
        <input type="text" required placeholder={`Ingresar ${campo.nombre.toLowerCase()}`} className={base} />
      )}
    </div>
  );
}
