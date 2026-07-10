import { Award } from "lucide-react";

interface Post {
    actividades: string[];
}

interface ActividadesExtracurricularesProps {
    post: Post;
}

export function ActividadesExtracurriculares({ post }: ActividadesExtracurricularesProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                    <Award className="w-4 h-4 text-edu-primary" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades extracurriculares</h3>
            </div>
            <div className="p-5">
                {post.actividades.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {post.actividades.map((a) => (
                            <div key={a} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                                <Award className="w-4 h-4 text-edu-primary shrink-0" />
                                <span className="text-[0.8125rem] text-edu-ink-700 font-medium">{a}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[0.8125rem] text-edu-ink-400 m-0">Sin actividades extracurriculares registradas.</p>
                )}
            </div>
        </div>
    );
}
