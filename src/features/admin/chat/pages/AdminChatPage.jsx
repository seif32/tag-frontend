import { useAuthStore } from "@/auth/store/authStore";
import { Textarea } from "@/components/ui/textarea";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import { CheckCheck, RefreshCcw, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

function AdminChatPage() {
  const { chatId } = useParams();
  const { isLoadingChat, chat } = useChat.useById(chatId, {
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    enabled: !!chatId,
  });
  const { isLoadingMessages, messages, refetchMessages } = useChat.useMessages(
    chatId,
    { page: 1, limit: 50, isAdmin: true },
    {
      refetchInterval: 5000,
      refetchIntervalInBackground: false,
      enabled: !!chatId,
    }
  );

  if (isLoadingMessages || isLoadingChat) {
    return <LoadingState />;
  }

  const isSeenByUser = chat?.seen_by_user === 1;

  return (
    <div className="flex flex-col w-full h-full  bg-stone-100">
      <ChatHeader chat={chat} refetchMessages={refetchMessages} />
      <ChatContainer messages={messages?.data} activeSender={"admin"} />
      {/* {isSeenByUser && <SeenIndicator firstName={chat?.first_name} />} */}
      <SendMessageActions chatId={chatId} SenderType={"admin"} />
    </div>
  );
}

export default AdminChatPage;

export function SeenIndicator({ firstName }) {
  return (
    <div className="bg-stone-100 w-full flex justify-end px-4 sm:px-6">
      <div className="text-xs italic flex items-center gap-1 mb-2 text-muted-foreground">
        <CheckCheck className="w-4 h-4" />
        <p>Seen by {firstName}</p>
      </div>
    </div>
  );
}

export function ChatHeader({ chat, refetchMessages }) {
  return (
    <div className="sticky top-0 bg-white z-10 border-b px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold truncate">
            {`${chat?.first_name} ${chat?.last_name}`}
          </h2>
          <p className="text-muted-foreground text-xs">client</p>
        </div>
        <button
          onClick={refetchMessages}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2 flex-shrink-0"
          aria-label="Refresh messages"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ChatContainer({ messages, activeSender }) {
  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col-reverse gap-2 px-4 sm:px-6 py-4 overflow-y-auto bg-stone-100 min-h-0">
      {" "}
      {/* ✅ flex-1 and min-h-0 */}
      <div ref={messagesEndRef} />
      {messages?.map((message) => (
        <BubbleChatCard
          key={message?.id}
          {...message}
          activeSender={activeSender}
        />
      ))}
    </div>
  );
}

export function BubbleChatCard({ message, sender_type, activeSender }) {
  return (
    <p
      className={`${
        sender_type === activeSender
          ? "bg-accent/50 self-end ml-auto"
          : "bg-white self-start mr-auto"
      } w-fit p-3 rounded-lg text-sm max-w-[85%] sm:max-w-[70%] shadow-sm break-words`}
    >
      {message}
    </p>
  );
}

export function SendMessageActions({ chatId, SenderType }) {
  const [messageText, setMessageText] = useState("");
  const user = useAuthStore((state) => state.user);

  const { isPendingMessage, sendMessage } = useChat.useSendMessage(chatId, {
    onSuccess: () => {
      setMessageText("");
    },
  });

  function handleSend() {
    if (!messageText.trim()) return;

    sendMessage({
      sender_id: user?.id,
      sender_type: SenderType,
      message: messageText,
    });
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-3 sm:p-4">
      <div className="flex gap-2 max-w-5xl mx-auto">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 resize-none min-h-[44px] max-h-32"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          className={`px-4 sm:px-6 py-2 grid place-items-center cursor-pointer hover:bg-gray-800 transition-all bg-black text-white rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0`}
          onClick={handleSend}
          disabled={isPendingMessage || !messageText.trim()}
          aria-label="Send message"
        >
          {isPendingMessage ? (
            <div className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full" />
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
