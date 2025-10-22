import { useAuthStore } from "@/auth/store/authStore";
import { Button } from "@/components/ui/button";
import {
  ChatContainer,
  SeenIndicator,
  SendMessageActions,
} from "@/features/admin/chat/pages/AdminChatPage";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import { MessageCircleDashed } from "lucide-react";

function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const chatId = user?.chat?.id;

  if (user && !user?.chat && user?.role === "user") return <CreateNewChat />;

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

export default ChatPage;

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

function CreateNewChat() {
  const { createChat, isPendingChat } = useChat.useCreate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-md w-full text-center">
        {/* Icon Container */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full shadow-md">
          <MessageCircleDashed className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Start a Chat!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Message us whatever you want to ask
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={createChat}
          disabled={isPendingChat}
          className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPendingChat ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full" />
              <span>Creating...</span>
            </div>
          ) : (
            "Start Chat"
          )}
        </Button>
      </div>
    </div>
  );
}
