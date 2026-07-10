import { Phone, Mail } from "lucide-react";
import type { CourseTeacher } from "@shared/services/actions/estudiante";

interface TeacherCardProps {
  teacher: CourseTeacher;
}

/** Datos del docente de la materia: avatar, nombre, cargo y contactos. */
export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-[18px] flex items-center gap-4 flex-wrap">
      <div className="w-[52px] h-[52px] rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-base font-bold text-edu-primary shrink-0">
        {teacher.initials}
      </div>

      <div className="flex-1 min-w-[160px]">
        <div className="text-[0.9375rem] font-bold text-edu-ink">{teacher.name}</div>
        <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{teacher.title}</div>
      </div>

      <div className="w-px h-10 bg-edu-border-soft shrink-0" />

      <div className="flex flex-col gap-1.5">
        <a
          href={`tel:${teacher.phone}`}
          className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
        >
          <div className="w-7 h-7 rounded-[7px] bg-edu-success-bg flex items-center justify-center">
            <Phone style={{ width: "13px", height: "13px" }} className="text-edu-success" />
          </div>
          <span className="font-medium">{teacher.phone}</span>
        </a>
        <a
          href={`mailto:${teacher.email}`}
          className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
        >
          <div className="w-7 h-7 rounded-[7px] bg-edu-primary-50 flex items-center justify-center">
            <Mail style={{ width: "13px", height: "13px" }} className="text-edu-primary" />
          </div>
          <span className="font-medium">{teacher.email}</span>
        </a>
      </div>
    </div>
  );
}
