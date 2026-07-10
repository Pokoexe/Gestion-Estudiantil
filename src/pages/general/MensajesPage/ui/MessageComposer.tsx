import { Send } from "lucide-react";

interface MessageComposerProps {
    input: string;
    setInput: (value: string) => void;
    send: () => void;
}

export function MessageComposer({ input, setInput, send }: MessageComposerProps) {
    return (
        <div className="px-4 py-3 border-t border-edu-border-soft flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Escribe un mensaje…"
                className="flex-1 border-[1.5px] border-edu-border rounded-edu-pill px-4 py-2.5 text-[0.875rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
            />
            <button
                onClick={send}
                disabled={!input.trim()}
                aria-label="Enviar"
                className="w-10 h-10 rounded-full bg-edu-primary text-white flex items-center justify-center border-none transition-colors enabled:cursor-pointer enabled:hover:bg-edu-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
                <Send className="w-[18px] h-[18px]" />
            </button>
        </div>
    );
}
