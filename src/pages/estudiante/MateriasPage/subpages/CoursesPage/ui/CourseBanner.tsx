import { BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import type { CourseInfo } from "@shared/services/actions/estudiante";

interface CourseBannerProps {
  course: CourseInfo;
  isPendiente: boolean;
  pendingCount: number;
  gradedCount: number;
}

/** Banner de cabecera de la materia: código, nombre, horario, chat y contadores. */
export function CourseBanner({ course, isPendiente, pendingCount, gradedCount }: CourseBannerProps) {
  return (
    <div className={`${isPendiente ? "bg-edu-danger" : "bg-edu-primary"} rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3`}>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
          <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
            {course.code} · {course.section}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <h2 className="text-white text-xl font-bold m-0">{course.name}</h2>
          {isPendiente && (
            <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.35)]">
              Materia pendiente
            </span>
          )}
        </div>
        <div className="flex gap-4 flex-wrap">
          {[course.schedule, course.room, `Período ${course.term}`].map((item) => (
            <span key={item} className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{item}</span>
          ))}

          <Link to="/estudiante/mensajes" className="h-7 rounded-[7px] bg-edu-success-bg flex items-center gap-2 justify-center w-full">
            <MessageCircle style={{ width: "13px", height: "13px" }} className="text-edu-success" />
            <span className="text-[0.8rem] text-edu-success">Chat grupal de la materia</span>
          </Link>

        </div>
      </div>
      <div className="flex justify-center gap-3 w-full">
        {[
          { label: "Pendientes", value: pendingCount },
          { label: "Calificadas", value: gradedCount },
        ].map(({ label, value }) => (
          <div key={label} className=" w-full bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
            <div className="text-[1.3rem] font-bold text-white">{value}</div>
            <div className="text-[0.72rem] text-[rgba(255,255,255,0.75)] mt-px">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
