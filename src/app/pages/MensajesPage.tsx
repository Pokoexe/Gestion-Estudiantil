import { useState, useRef, useEffect } from "react";
import { Search, Send, Menu } from "lucide-react";
import { nowTime } from "../datos_maquetados/data/chats";
import { getChats, type Conversation } from "../datos_maquetados/actions/chats";

export function MensajesPage() {
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [input, setInput] = useState("");
    const [chatListOpen, setChatListOpen] = useState(false);
    const messagesEnd = useRef<HTMLDivElement>(null);

    // Siembra las conversaciones desde el endpoint maquetado (patrón async).
    useEffect(() => {
        let alive = true;
        getChats().then((fetched) => {
            if (!alive) return;
            setConvos(fetched);
            setSelectedId((prev) => prev ?? fetched[0]?.id ?? null);
        });
        return () => {
            alive = false;
        };
    }, []);

    const selected = convos.find((c) => c.id === selectedId);

    const filtered = convos.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase()),
    );

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ block: "end" });
    }, [selected?.messages.length, selectedId]);

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

    const selectConvo = (id: number) => {
        setSelectedId(id);
        setChatListOpen(false);
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col md:flex-row bg-edu-surface overflow-hidden relative">
            {/* Backdrop para cerrar la lista en móvil */}
            <div
                className={`absolute inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300 ${chatListOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setChatListOpen(false)}
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

            {/* Conversación activa */}
            <div className="flex-1 flex flex-col min-w-0">
                {selected ? (
                    <>
                        {/* Encabezado */}
                        <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-bold shrink-0"
                                style={{ backgroundColor: selected.color }}
                            >
                                {selected.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[0.9rem] font-semibold text-edu-ink truncate">{selected.name}</div>
                                <div className="text-[0.72rem] text-edu-ink-400 truncate">
                                    {selected.online ? "En línea" : selected.subtitle}
                                </div>
                            </div>
                            <button
                                onClick={() => setChatListOpen(true)}
                                aria-label="Ver conversaciones"
                                className="md:hidden w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500 shrink-0"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2 bg-edu-tint">
                            {selected.messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`max-w-[72%] px-3.5 py-2 rounded-2xl ${m.fromMe
                                        ? "self-end bg-edu-primary text-white rounded-br-sm"
                                        : "self-start bg-edu-surface text-edu-ink border border-edu-border-soft rounded-bl-sm"}`}
                                >
                                    <div className="text-[0.85rem] leading-[1.45] whitespace-pre-wrap break-words">{m.text}</div>
                                    <div className={`text-[0.62rem] mt-0.5 text-right ${m.fromMe ? "text-white/70" : "text-edu-ink-400"}`}>
                                        {m.time}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEnd} />
                        </div>

                        {/* Barra de escritura */}
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
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-edu-ink-400 text-sm">
                        Cargando…
                    </div>
                )}
            </div>
        </div>
    );
}
