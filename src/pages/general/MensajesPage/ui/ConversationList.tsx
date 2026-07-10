import { Search } from "lucide-react";
import type { Conversation } from "@shared/services/actions/chats";

interface ConversationListProps {
    chatListOpen: boolean;
    onClose: () => void;
    query: string;
    setQuery: (q: string) => void;
    filtered: Conversation[];
    selectedId: number | null;
    selectConvo: (id: number) => void;
}

export function ConversationList({
    chatListOpen,
    onClose,
    query,
    setQuery,
    filtered,
    selectedId,
    selectConvo,
}: ConversationListProps) {
    return (
        <>
            {/* Backdrop para cerrar la lista en móvil */}
            <div
                className={`absolute inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300 ${chatListOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Lista de conversaciones */}
            <div className={`absolute inset-y-0 left-0 z-30 w-[300px] bg-edu-surface flex flex-col shrink-0 border-r border-edu-border-soft transition-transform duration-300 ${chatListOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:inset-auto md:z-auto md:translate-x-0 md:w-[320px]`}>
                <div className="px-4 py-4 border-b border-edu-border-soft">
                    <h3 className="m-0 mb-3 text-edu-ink font-bold text-base">Mensajes</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar conversación…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-pill pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map((c) => {
                        const last = c.messages[c.messages.length - 1];
                        const active = c.id === selectedId;
                        return (
                            <button
                                key={c.id}
                                onClick={() => selectConvo(c.id)}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-edu-border-soft transition-colors cursor-pointer ${active ? "bg-edu-primary-50" : "bg-transparent hover:bg-edu-subtle"}`}
                            >
                                <div className="relative shrink-0">
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[0.8rem] font-bold"
                                        style={{ backgroundColor: c.color }}
                                    >
                                        {c.initials}
                                    </div>
                                    {c.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-edu-success border-2 border-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[0.875rem] font-semibold text-edu-ink truncate">{c.name}</span>
                                        <span className="text-[0.68rem] text-edu-ink-400 shrink-0">{c.lastTime}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <span className="text-[0.78rem] text-edu-ink-500 truncate">
                                            {last?.fromMe ? "Tú: " : ""}{last?.text}
                                        </span>
                                        {c.unread > 0 && (
                                            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-edu-primary text-white text-[0.65rem] font-bold flex items-center justify-center">
                                                {c.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="px-4 py-10 text-center text-edu-ink-400 text-sm">Sin resultados.</div>
                    )}
                </div>
            </div>
        </>
    );
}
