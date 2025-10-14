import { useAuthStore } from "@/auth/store/authStore";
import { Textarea } from "@/components/ui/textarea";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import { CheckCheck, RefreshCcw, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

function AdminChatPage() {
  const { chatId } = useParams();
  const { isLoadingChat, chat } = useChat.useById(chatId);
  const { isLoadingMessages, messages, refetchMessages } = useChat.useMessages(
    chatId,
    { page: 1, limit: 50, isAdmin: true },
    {
      // refetchInterval: 5000,
      refetchIntervalInBackground: false,
      enabled: !!chatId,
    }
  );

  if (isLoadingMessages || isLoadingChat) {
    return <LoadingState />;
  }

  const isSeenByUser = chat?.seen_by_user === 1;

  return (
    <div className="flex relative flex-col h-full ">
      <ChatHeader chat={chat} refetchMessages={refetchMessages} />
      <ChatContainer messages={messages?.data} />
      {isSeenByUser && <SeenIndicator firstName={chat?.first_name} />}
      <SendMessageActions chatId={chatId} />
    </div>
  );
}

export default AdminChatPage;

function SeenIndicator({ firstName }) {
  return (
    <div className="text-xs italic flex self-end mr-5 mb-1 text-muted-foreground">
      <CheckCheck className="size-4" />
      <p>Seen by {firstName}</p>
    </div>
  );
}

function ChatHeader({ chat, refetchMessages }) {
  return (
    <div className="sticky top-0 bg-white z-10 border-b px-4 py-2 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h2>{`${chat?.first_name} ${chat?.last_name}`}</h2>
          <p className="text-muted-foreground text-xs">client</p>
        </div>
        <RefreshCcw
          onClick={refetchMessages}
          className="size-4 cursor-pointer"
        />
      </div>
    </div>
  );
}

function ChatContainer({ messages }) {
  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col-reverse gap-2 p-5 overflow-y-auto">
      <div ref={messagesEndRef}></div>
      {messages?.map((message) => (
        <BubbleChatCard key={message?.id} {...message} />
      ))}
    </div>
  );
}

function BubbleChatCard({ message, sender_type }) {
  return (
    <p
      className={`${
        sender_type === "admin" ? "bg-accent/50 self-end " : "bg-gray-200"
      } w-fit p-3 rounded-md text-sm max-w-[70%]`}
    >
      {message}
    </p>
  );
}

function SendMessageActions({ chatId }) {
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
      sender_type: "admin",
      message: messageText,
    });
    setMessageText("");
  }
  return (
    <div className="sticky bottom-0 right-0 w-full  ">
      <div className="flex ">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          className={`p-2 px-6 grid place-items-center cursor-pointer hover:bg-accent hover:text-black transition-all bg-black text-white ${
            isPendingMessage && "bg-gray-500"
          }`}
          onClick={handleSend}
          disabled={isPendingMessage}
        >
          {isPendingMessage ? (
            <div className="animate-spin border w-5 h-5 rounded-full"></div>
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}{" "}
        </button>
      </div>
    </div>
  );
}
