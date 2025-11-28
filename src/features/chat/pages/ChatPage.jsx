import { useAuthStore } from "@/auth/store/authStore";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import { MessageCircle, CheckCheck, Clock, SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const chatId = user?.chat?.id;
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (user && !chatId && user?.role === "user") {
      navigate("/");
    }
  }, [user, chatId, navigate]);

  const { isLoadingChat, chat } = useChat.useById(chatId, {
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    enabled: !!chatId,
  });

  const { messages, isLoadingMessages } = useChat.useMessages(
    chatId,
    { page: 1, limit: 50, isAdmin: false },
    {
      refetchInterval: 5000,
      refetchIntervalInBackground: false,
      enabled: !!chatId,
    }
  );

  if (isLoadingMessages || isLoadingChat) {
    return <LoadingState />;
  }

  const isSeenByAdmin = chat?.seen_by_admin === 1;

  return (
    // 🆕 Fixed width container with overflow hidden
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      <div className="h-screen flex flex-col px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto">
        <PageHeader />

        {/* 🆕 Constrained width container */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden bg-white border border-gray-200">
          <ChatHeader isSeenByAdmin={isSeenByAdmin} />
          <UserChatContainer messages={messages?.data} activeSender={"user"} />
          <UserSendMessageActions
            chatId={chatId}
            SenderType={"user"}
            inputRef={inputRef}
          />
        </div>

        <InfoCard />
      </div>
    </div>
  );
}

export default ChatPage;

function PageHeader() {
  return (
    <div className="mb-3 sm:mb-6 text-center sm:text-left flex-shrink-0">
      <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md">
          <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chat with Us
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 px-2 sm:px-0">
        Have a question? We're here to help!
      </p>
    </div>
  );
}

function ChatHeader({ isSeenByAdmin }) {
  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs sm:text-base shadow-lg border-2 border-white/30 flex-shrink-0">
            TAG
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-lg font-semibold text-white truncate">
              TAG Support Team
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-white/90 truncate">
                {isSeenByAdmin ? "Active now" : "We'll reply soon"}
              </p>
            </div>
          </div>
        </div>

        {isSeenByAdmin ? (
          <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex-shrink-0">
            <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            <span className="text-[10px] sm:text-xs font-medium text-white hidden xs:inline">
              Seen
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex-shrink-0">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            <span className="text-[10px] sm:text-xs font-medium text-white hidden xs:inline">
              Pending
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// 🆕 Fixed Chat Container with proper overflow
function UserChatContainer({ messages, activeSender }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages?.length === 0]);

  return (
    // 🆕 Added min-w-0 to allow shrinking
    <div className="flex-1 flex flex-col-reverse gap-2 sm:gap-3 px-3 py-3 sm:px-6 sm:py-6 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 bg-gradient-to-b from-gray-50/50 to-transparent">
      <div ref={messagesEndRef} />

      {messages && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
            Start a Conversation
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm">
            Send us your first message! We're here to answer any questions you
            might have.
          </p>
        </div>
      ) : (
        messages?.map((message) => (
          <UserBubbleChatCard
            key={message?.id}
            {...message}
            activeSender={activeSender}
          />
        ))
      )}
    </div>
  );
}

// 🆕 Fixed Bubble Card with proper text wrapping
function UserBubbleChatCard({
  message,
  sender_type,
  activeSender,
  created_at,
}) {
  const isMe = sender_type === activeSender;

  return (
    <div
      className={`flex min-w-0 w-full ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col min-w-0 ${
          isMe ? "items-end" : "items-start"
        } max-w-[85%] sm:max-w-[75%]`}
      >
        <div
          className={`
            ${
              isMe
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md"
                : "bg-white text-gray-900 rounded-tl-md rounded-tr-2xl rounded-bl-2xl rounded-br-2xl border border-gray-200"
            }
            px-3 py-2 sm:px-4 sm:py-3 shadow-sm hover:shadow-md transition-shadow duration-200
            min-w-0 max-w-full overflow-hidden
          `}
        >
          {/* 🆕 NUCLEAR OPTION: break-all forces breaking anywhere */}
          <p
            className="text-sm leading-relaxed"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              hyphens: "auto",
              whiteSpace: "pre-wrap",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
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

// 🆕 Fixed Send Message Actions - No horizontal expansion
function UserSendMessageActions({ chatId, SenderType, inputRef }) {
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
    // 🆕 min-w-0 prevents expansion
    <div
      ref={inputRef}
      className="flex-shrink-0 bg-white border-t shadow-lg min-w-0"
    >
      {/* 🆕 Constrained width with min-w-0 */}
      <div className="flex gap-2 p-2 sm:gap-3 sm:p-4 min-w-0 w-full">
        {/* 🆕 flex-1 with min-w-0 ensures it doesn't overflow */}
        <div className="flex-1 relative min-w-0">
          <Textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="w-full resize-none min-h-[44px] sm:min-h-[48px] max-h-32 rounded-xl sm:rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base overflow-y-auto"
            rows={1}
            style={{
              fieldSizing: "content", // Auto-grow vertically
              maxWidth: "100%", // Prevent horizontal expansion
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        {/* 🆕 Fixed width send button */}
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

function InfoCard() {
  return (
    <div className="hidden sm:block mt-4 sm:mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 flex-shrink-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
            💬 Quick Response Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            We typically respond within{" "}
            <span className="font-semibold text-blue-600">2-4 hours</span>{" "}
            during business hours (9 AM - 6 PM EET)
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-medium">
            ✓ Active
          </div>
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  );
}
