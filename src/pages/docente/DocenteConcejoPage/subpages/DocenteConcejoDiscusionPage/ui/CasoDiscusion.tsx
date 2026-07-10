import { Gavel } from "lucide-react";

interface Post {
    materia: string;
    nota: number;
    motivo: string;
}

interface CasoDiscusionProps {
    post: Post;
}

export function CasoDiscusion({ post }: CasoDiscusionProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                <div className="w-8 h-8 rounded-edu-control bg-edu-primary-50 flex items-center justify-center">
                    <Gavel className="w-4 h-4 text-edu-primary" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Caso en discusión</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.8125rem] text-edu-ink-500">Materia:</span>
                    <span className="text-[0.875rem] text-edu-ink font-semibold">{post.materia}</span>
                    <span className="inline-flex items-center px-2 py-[2px] rounded-edu-chip text-[0.72rem] font-semibold bg-edu-danger-bg text-edu-danger">
                        Nota actual: {post.nota}
                    </span>
                </div>
                <div>
                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Justificación del evaluador</div>
                    <p className="text-[0.875rem] text-edu-ink-700 leading-[1.55] m-0">{post.motivo}</p>
                </div>
            </div>
        </div>
    );
}
