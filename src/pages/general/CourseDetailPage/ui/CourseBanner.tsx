import { BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { type ExtraCourse } from "@shared/services/actions/courses";

interface CourseBannerProps {
    course: ExtraCourse;
    isEnrolled: boolean;
    pendingCount: number;
    gradedEvalsCount: number;
}

export function CourseBanner({ course, isEnrolled, pendingCount, gradedEvalsCount }: CourseBannerProps) {
    return (
        <div className="bg-edu-purple rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
            <div className="w-full">
                <div className="flex items-center gap-2 mb-1">
                    <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                    <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                        {course.code} · Curso extracurricular
                    </span>
                </div>
                <h2 className="text-white mb-1.5 text-xl font-bold m-0">{course.title}</h2>
                <div className="flex gap-4 flex-wrap">
                    {[course.schedule, course.room, `Período ${course.term}`].map((item) => (
                        <span key={item} className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{item}</span>
                    ))}

                    {isEnrolled && (
                        <Link to="/estudiante/mensajes" className="w-full h-7 rounded-[7px] bg-edu-success-bg flex items-center gap-2 justify-center">
                            <MessageCircle style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                            <span className="text-[0.8rem] text-edu-success">Chat grupal del curso</span>
                        </Link>
                    )}

                </div>
            </div>
            {isEnrolled && (
                <div className="flex justify-center gap-3 w-full">
                    {[
                        { label: "Pendientes", value: pendingCount },
                        { label: "Calificadas", value: gradedEvalsCount },
                    ].map(({ label, value }) => (
                        <div key={label} className=" w-full bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
                            <div className="text-[1.3rem] font-bold text-white">{value}</div>
                            <div className="text-[0.72rem] text-[rgba(255,255,255,0.75)] mt-px">{label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
