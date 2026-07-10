import { Fragment } from "react";
import { Check, X } from "lucide-react";
import type { StepKey } from "../interfaces";

interface InscripcionStepperProps {
    STEPS: { key: StepKey; label: string; short: string; icon: React.ElementType }[];
    step: StepKey;
    visited: Set<StepKey>;
    stepValid: Record<StepKey, boolean>;
    goToStep: (key: StepKey) => void;
}

export function InscripcionStepper({ STEPS, step, visited, stepValid, goToStep }: InscripcionStepperProps) {
    return (
        <div className="flex items-center px-4 sm:px-5 py-4 border-b border-edu-border-soft overflow-x-auto">
            {STEPS.map((s, i) => {
                const active = step === s.key;
                // Solo se evalúa (✓/✗) un paso una vez que el usuario ya pasó por él.
                const wasVisited = visited.has(s.key);
                const showOk = wasVisited && stepValid[s.key];
                const showError = wasVisited && !stepValid[s.key];
                return (
                    <Fragment key={s.key}>
                        <button
                            type="button"
                            onClick={() => goToStep(s.key)}
                            title={showError ? "Faltan datos por completar" : s.label}
                            className="flex items-center gap-2 shrink-0 bg-transparent border-none cursor-pointer p-0"
                        >
                            <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.8125rem] font-bold shrink-0 transition-colors ${active
                                        ? "bg-edu-primary text-white"
                                        : showOk
                                            ? "bg-edu-success-bg text-edu-success"
                                            : showError
                                                ? "bg-edu-danger-bg text-edu-danger"
                                                : "bg-edu-subtle text-edu-ink-400 border border-edu-border"
                                    }`}
                            >
                                {showOk ? (
                                    <Check className="w-4 h-4" />
                                ) : showError ? (
                                    <X className="w-4 h-4" />
                                ) : (
                                    i + 1
                                )}
                            </span>
                            <span
                                className={`text-[0.8125rem] font-medium whitespace-nowrap hidden md:inline ${active
                                        ? "text-edu-primary"
                                        : showError
                                            ? "text-edu-danger"
                                            : showOk
                                                ? "text-edu-ink-700"
                                                : "text-edu-ink-400"
                                    }`}
                            >
                                {s.label}
                            </span>
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className="h-px w-5 md:w-8 bg-edu-border shrink-0 mx-1.5 md:mx-2.5" />
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}
