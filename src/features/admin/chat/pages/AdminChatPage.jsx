import { useAuthStore } from "@/auth/store/authStore";
import { Textarea } from "@/components/ui/textarea";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import { RefreshCcw, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

function AdminChatPage() {
  const { chatId } = useParams();
  const inputRef = useRef(null);

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

  return (
    // 🆕 Added overflow-x-hidden
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden overflow-x-hidden min-w-0">
      <ChatHeader chat={chat} refetchMessages={refetchMessages} />
      <ChatContainer messages={messages?.data} activeSender={"admin"} />
      <SendMessageActions
        chatId={chatId}
        SenderType={"admin"}
        inputRef={inputRef}
      />
    </div>
  );
}

export default AdminChatPage;

export function ChatHeader({ chat, refetchMessages }) {
  return (
    <div className="flex-shrink-0 bg-white border-b shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0 shadow-md">
            {chat?.first_name?.[0]}
            {chat?.last_name?.[0]}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {`${chat?.first_name} ${chat?.last_name}`}
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-gray-500">Client</p>
            </div>
          </div>
        </div>

        <button
          onClick={refetchMessages}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ml-2 flex-shrink-0 active:scale-95"
          aria-label="Refresh messages"
        >
          <RefreshCcw className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export function ChatContainer({ messages, activeSender }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages?.length === 0]);

  return (
    // 🆕 Added min-w-0 and overflow-x-hidden
    <div className="flex-1 flex flex-col-reverse gap-3 px-4 sm:px-6 py-6 overflow-y-auto overflow-x-hidden min-h-0 min-w-0">
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

export function BubbleChatCard({
  message,
  sender_type,
  activeSender,
  created_at,
}) {
  const isMe = sender_type === activeSender;

  return (
    // 🆕 Added min-w-0 and w-full
    <div
      className={`flex min-w-0 w-full ${
        isMe ? "justify-end" : "justify-start"
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {/* 🆕 Added min-w-0 */}
      <div
        className={`flex flex-col min-w-0 ${
          isMe ? "items-end" : "items-start"
        } max-w-[85%] sm:max-w-[70%]`}
      >
        {/* 🆕 Added min-w-0, max-w-full, overflow-hidden */}
        <div
          className={`
            ${
              isMe
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md"
                : "bg-white text-gray-900 rounded-tl-md rounded-tr-2xl rounded-bl-2xl rounded-br-2xl border border-gray-200"
            }
            px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200
            min-w-0 max-w-full overflow-hidden
          `}
        >
          {/* 🆕 CRITICAL FIX: Added break-all, whitespace-pre-wrap, max-w-full, overflow-hidden */}
          <p className="text-sm leading-relaxed break-all whitespace-pre-wrap max-w-full overflow-hidden">
            {message}
          </p>
        </div>

        {created_at && (
          <p className="text-[10px] text-gray-400 mt-1 px-2 truncate max-w-full">
            {new Date(created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export function SendMessageActions({ chatId, SenderType, inputRef }) {
  const [messageText, setMessageText] = useState("");
  const textareaRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  const { isPendingMessage, sendMessage } = useChat.useSendMessage(chatId, {
    onSuccess: () => {
      setMessageText("");

      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        textareaRef.current?.focus();
      }, 100);
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
    // 🆕 Added min-w-0
    <div
      ref={inputRef}
      className="flex-shrink-0 bg-white border-t shadow-lg min-w-0"
    >
      {/* 🆕 Added min-w-0 and w-full */}
      <div className="flex gap-2 p-2 sm:gap-3 sm:p-4 min-w-0 w-full">
        {/* 🆕 Added min-w-0 */}
        <div className="flex-1 relative min-w-0">
          <Textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="w-full resize-none min-h-[44px] sm:min-h-[48px] max-h-32 rounded-xl sm:rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base overflow-y-auto"
            rows={1}
            style={{
              maxWidth: "100%", // 🆕 Prevent horizontal expansion
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        <button
          className={`
            w-11 h-11 sm:w-14 sm:h-14
            rounded-full
            flex items-center justify-center
            transition-all duration-200
            flex-shrink-0
            ${
              messageText.trim()
                ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg active:scale-95"
                : "bg-gray-200 cursor-not-allowed"
            }
            disabled:opacity-50
          `}
          onClick={handleSend}
          disabled={isPendingMessage || !messageText.trim()}
          aria-label="Send message"
        >
          {isPendingMessage ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <SendHorizontal
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                messageText.trim() ? "text-white" : "text-gray-400"
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
}
