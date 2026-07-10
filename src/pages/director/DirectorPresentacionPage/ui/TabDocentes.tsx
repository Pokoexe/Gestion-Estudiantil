import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import type { LandingConfig, Teacher } from "@/pages/Auth/LandingPage/interfaces/types";
import { INPUT } from "../functions/useDirectorPresentacion";
import { TextField } from "./TextField";
import { IconBtn } from "./IconBtn";
import { AddButton } from "./AddButton";

export function TabDocentes({
  config,
  patchTeachers,
  addTeacher,
  updateTeacher,
  removeTeacher,
  moveTeacher,
}: {
  config: LandingConfig;
  patchTeachers: (p: Partial<Omit<LandingConfig["teachers"], "list">>) => void;
  addTeacher: () => void;
  updateTeacher: (id: string, p: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;
  moveTeacher: (i: number, dir: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <TextField label="Título de la sección" value={config.teachers.heading} onChange={(v) => patchTeachers({ heading: v })} />
      <TextField label="Subtítulo" value={config.teachers.subtitle} onChange={(v) => patchTeachers({ subtitle: v })} />
      <div className="flex items-center justify-between">
        <span className="text-[0.75rem] font-semibold text-edu-ink-500">Docentes ({config.teachers.list.length}/12)</span>
        <span className="text-[0.68rem] text-edu-ink-400">Se ven de 4 en 4</span>
      </div>
      <div className="flex flex-col gap-2">
        {config.teachers.list.map((t, i) => (
          <div key={t.id} className="flex gap-2 rounded-edu-control border border-edu-border-soft bg-edu-subtle p-2">
            <img src={t.photo} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover border border-edu-border" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <input className={INPUT} value={t.name} onChange={(e) => updateTeacher(t.id, { name: e.target.value })} placeholder="Nombre del docente" />
              <input className={INPUT} value={t.role} onChange={(e) => updateTeacher(t.id, { role: e.target.value })} placeholder="Materia o cargo" />
              <input className={INPUT} value={t.photo} onChange={(e) => updateTeacher(t.id, { photo: e.target.value })} placeholder="URL de la foto" />
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <IconBtn onClick={() => moveTeacher(i, -1)} disabled={i === 0} label="Subir"><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn onClick={() => moveTeacher(i, 1)} disabled={i === config.teachers.list.length - 1} label="Bajar"><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn onClick={() => removeTeacher(t.id)} label="Eliminar" danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
            </div>
          </div>
        ))}
        <AddButton disabled={config.teachers.list.length >= 12} onClick={addTeacher} label={config.teachers.list.length >= 12 ? "Máximo 12 docentes" : "Agregar docente"} />
      </div>
    </div>
  );
}
