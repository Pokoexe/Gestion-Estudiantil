import type { RefObject } from "react";
import type { Conversation } from "@shared/services/actions/chats";

interface MessageThreadProps {
    selected: Conversation;
    messagesEnd: RefObject<HTMLDivElement>;
}

export function MessageThread({ selected, messagesEnd }: MessageThreadProps) {
    return (
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
    );
}
