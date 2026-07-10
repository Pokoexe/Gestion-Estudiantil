import { useState, useRef, useEffect } from "react";
import { getChats, type Conversation } from "@shared/services/actions/chats";
import { nowTime } from "@shared/services/data/chats";

export function useMensajes() {
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

    return {
        convos,
        selectedId,
        query,
        setQuery,
        input,
        setInput,
        chatListOpen,
        setChatListOpen,
        selected,
        filtered,
        messagesEnd,
        send,
        selectConvo,
    };
}
