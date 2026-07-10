import { Menu } from "lucide-react";
import type { Conversation } from "@shared/services/actions/chats";

interface ConversationHeaderProps {
    selected: Conversation;
    onOpenChatList: () => void;
}

export function ConversationHeader({ selected, onOpenChatList }: ConversationHeaderProps) {
    return (
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
                onClick={onOpenChatList}
                aria-label="Ver conversaciones"
                className="md:hidden w-9 h-9 rounded-full border-[1.5px] border-edu-border bg-edu-subtle cursor-pointer flex items-center justify-center text-edu-ink-500 shrink-0"
            >
                <Menu className="w-5 h-5" />
            </button>
        </div>
    );
}
