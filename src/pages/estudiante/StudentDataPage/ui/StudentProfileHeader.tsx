import { GraduationCap, Hash, Mail, CalendarCheck } from "lucide-react";
import type { StudentProfile } from "@shared/services/actions/estudiante";

interface StudentProfileHeaderProps {
    student: StudentProfile | null;
}

/** Encabezado con los datos de perfil del estudiante. */
export function StudentProfileHeader({ student }: StudentProfileHeaderProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex items-center gap-4 flex-wrap">
            <div className="w-[52px] h-[52px] rounded-full bg-edu-primary flex items-center justify-center text-white text-base font-bold shrink-0">
                {student?.initials}
            </div>
            <div className="min-w-0">
                <div className="text-edu-ink font-bold text-[1.05rem] leading-tight">{student?.name}</div>
                <div className="text-edu-ink-500 text-[0.8rem] flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-edu-ink-400" />
                    {student?.section}
                </div>
            </div>
            <div className="w-px h-9 bg-edu-border-soft shrink-0 hidden sm:block" />
            <div className="flex gap-5 flex-wrap">
                <div className="flex items-center gap-1.5 text-[0.8rem] text-edu-ink-700">
                    <Hash className="w-3.5 h-3.5 text-edu-ink-400" />
                    {student?.id}
                </div>
                <div className="flex items-center gap-1.5 text-[0.8rem] text-edu-ink-700">
                    <Mail className="w-3.5 h-3.5 text-edu-ink-400" />
                    {student?.email}
                </div>
                <div className="flex items-center gap-1.5 text-[0.8rem] text-edu-ink-700">
                    <CalendarCheck className="w-3.5 h-3.5 text-edu-ink-400" />
                    Período {student?.term}
                </div>
            </div>
        </div>
    );
}
