import { useMensajes } from "./functions/useMensajes";
import { ConversationList } from "./ui/ConversationList";
import { ConversationHeader } from "./ui/ConversationHeader";
import { MessageThread } from "./ui/MessageThread";
import { MessageComposer } from "./ui/MessageComposer";

export function MensajesPage() {
    const {
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
    } = useMensajes();

    return (
        <div className="flex-1 min-h-0 flex flex-col md:flex-row bg-edu-surface overflow-hidden relative">
            <ConversationList
                chatListOpen={chatListOpen}
                onClose={() => setChatListOpen(false)}
                query={query}
                setQuery={setQuery}
                filtered={filtered}
                selectedId={selectedId}
                selectConvo={selectConvo}
            />

            {/* Conversación activa */}
            <div className="flex-1 flex flex-col min-w-0">
                {selected ? (
                    <>
                        <ConversationHeader
                            selected={selected}
                            onOpenChatList={() => setChatListOpen(true)}
                        />
                        <MessageThread
                            selected={selected}
                            messagesEnd={messagesEnd}
                        />
                        <MessageComposer
                            input={input}
                            setInput={setInput}
                            send={send}
                        />
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
