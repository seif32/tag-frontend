import { useAuthStore } from "@/auth/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ChatContainer,
  SeenIndicator,
  SendMessageActions,
} from "@/features/admin/chat/pages/AdminChatPage";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";

function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const chatId = user?.chat?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !chatId && user?.role === "user") {
      navigate("/"); // Go back to home if no chat
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
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto">
      <PageTitle />
      <div className="flex relative flex-col h-[calc(100vh-200px)] sm:h-[600px] border rounded-lg shadow-sm overflow-hidden bg-white">
        <ChatContainer messages={messages?.data} activeSender={"user"} />
        {isSeenByAdmin && <SeenIndicator firstName={"TAG"} />}
        <SendMessageActions chatId={chatId} SenderType={"user"} />
      </div>
    </div>
  );
}

function PageTitle() {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Chat</h1>
      <p className="text-sm sm:text-base text-muted-foreground mt-1">
        Message us whatever you want to ask
      </p>
    </div>
  );
}

export default ChatPage;
