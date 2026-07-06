import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronLeft, Send, Minus } from "lucide-react";
import { CONVERSATIONS, nowTime, type Conversation } from "../datos_maquetados/data/chats";

interface FloatingChatProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Conversación a abrir (p. ej. desde una notificación). */
    openConversationId: number | null;
}

export function FloatingChat({ open, onOpenChange, openConversationId }: FloatingChatProps) {
    const [convos, setConvos] = useState<Conversation[]>(CONVERSATIONS);
    const [view, setView] = useState<"list" | "chat">("list");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const messagesEnd = useRef<HTMLDivElement>(null);

    // Al abrir desde una notificación, saltar a esa conversación.
    useEffect(() => {
        if (openConversationId != null) {
            setSelectedId(openConversationId);
            setView("chat");
        }
    }, [openConversationId]);

    const selected = convos.find((c) => c.id === selectedId) ?? null;
    const totalUnread = convos.reduce((sum, c) => sum + c.unread, 0);

    useEffect(() => {
        if (view === "chat") messagesEnd.current?.scrollIntoView({ block: "end" });
    }, [selected?.messages.length, view, selectedId]);

    const openConversation = (id: number) => {
        setSelectedId(id);
        setView("chat");
        setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    };

    const send = () => {
        const text = input.trim();
        if (!text || selectedId == null) return;
        const time = nowTime();
        setConvos((prev) =>
            prev.map((c) =>
                c.id === selectedId
                    ? { ...c, messages: [...c.messages, { id: Date.now(), fromMe: true, text, time }], lastTime: time }
                    : c,
            ),
        );
        setInput("");
    };

    // Botón flotante (cerrado)
    if (!open) {
        return (
            <button
                onClick={() => onOpenChange(true)}
                aria-label="Abrir chat"
                className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-edu-primary text-white flex items-center justify-center shadow-[0_6px_20px_rgba(26,86,219,0.4)] border-none cursor-pointer transition-transform hover:scale-105"
            >
                <MessageCircle className="w-6 h-6" />
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-edu-danger-strong text-white text-[0.65rem] font-bold flex items-center justify-center border-2 border-white">
                        {totalUnread}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 w-[340px] h-[460px] max-h-[calc(100vh-3rem)] bg-edu-surface rounded-edu-card border border-edu-border shadow-[0_12px_32px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden">
            {view === "chat" && selected ? (
                <>
                    {/* Encabezado de la conversación */}
                    <div className="px-3 py-2.5 border-b border-edu-border-soft flex items-center gap-2 bg-edu-primary text-white">
                        <button
                            onClick={() => setView("list")}
                            aria-label="Volver"
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-white/90 hover:bg-white/15"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0 bg-white/20"
                        >
                            {selected.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[0.85rem] font-semibold truncate leading-tight">{selected.name}</div>
                            <div className="text-[0.68rem] text-white/75 truncate">
                                {selected.online ? "En línea" : selected.subtitle}
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            aria-label="Minimizar"
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-white/90 hover:bg-white/15"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5 bg-edu-tint">
                        {selected.messages.map((m) => (
                            <div
                                key={m.id}
                                className={`max-w-[80%] px-3 py-1.5 rounded-2xl ${m.fromMe
                                    ? "self-end bg-edu-primary text-white rounded-br-sm"
                                    : "self-start bg-edu-surface text-edu-ink border border-edu-border-soft rounded-bl-sm"}`}
                            >
                                <div className="text-[0.8rem] leading-[1.4] whitespace-pre-wrap break-words">{m.text}</div>
                                <div className={`text-[0.6rem] mt-0.5 text-right ${m.fromMe ? "text-white/70" : "text-edu-ink-400"}`}>
                                    {m.time}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEnd} />
                    </div>

                    {/* Entrada */}
                    <div className="px-2.5 py-2.5 border-t border-edu-border-soft flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                            placeholder="Escribe…"
                            className="flex-1 border-[1.5px] border-edu-border rounded-edu-pill px-3.5 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                        <button
                            onClick={send}
                            disabled={!input.trim()}
                            aria-label="Enviar"
                            className="w-9 h-9 rounded-full bg-edu-primary text-white flex items-center justify-center border-none transition-colors enabled:cursor-pointer enabled:hover:bg-edu-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Encabezado de la lista */}
                    <div className="px-4 py-3 border-b border-edu-border-soft flex items-center justify-between bg-edu-primary text-white">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-semibold text-[0.9rem]">Mensajes</span>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            aria-label="Cerrar chat"
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-white/90 hover:bg-white/15"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Lista de conversaciones */}
                    <div className="flex-1 overflow-y-auto">
                        {convos.map((c) => {
                            const last = c.messages[c.messages.length - 1];
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => openConversation(c.id)}
                                    className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 border-b border-edu-border-soft bg-transparent hover:bg-edu-subtle transition-colors cursor-pointer"
                                >
                                    <div className="relative shrink-0">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.72rem] font-bold"
                                            style={{ backgroundColor: c.color }}
                                        >
                                            {c.initials}
                                        </div>
                                        {c.online && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-edu-success border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[0.82rem] font-semibold text-edu-ink truncate">{c.name}</span>
                                            <span className="text-[0.65rem] text-edu-ink-400 shrink-0">{c.lastTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-0.5">
                                            <span className="text-[0.74rem] text-edu-ink-500 truncate">
                                                {last?.fromMe ? "Tú: " : ""}{last?.text}
                                            </span>
                                            {c.unread > 0 && (
                                                <span className="shrink-0 min-w-[17px] h-[17px] px-1 rounded-full bg-edu-primary text-white text-[0.6rem] font-bold flex items-center justify-center">
                                                    {c.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
