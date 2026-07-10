import { useNavigate } from "react-router";
import { GraduationCap, LogIn } from "lucide-react";

export function PublicShell({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-edu-bg flex flex-col">
            <header className="h-14 bg-edu-surface border-b border-edu-border sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0"
                >
                    <div className="w-9 h-9 rounded-edu-control bg-edu-primary flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div className="leading-tight text-left">
                        <div className="text-edu-ink font-semibold text-[0.95rem]">EduGestión</div>
                        <div className="text-edu-ink-400 text-[0.68rem]">Inscripciones en línea</div>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-[0.8125rem] font-semibold cursor-pointer hover:border-edu-primary-200 hover:text-edu-primary transition-colors"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Iniciar sesión</span>
                </button>
            </header>
            <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
                {children}
            </main>
        </div>
    );
}
