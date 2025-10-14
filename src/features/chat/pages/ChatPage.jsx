import {
  ChatContainer,
  ChatHeader,
  SeenIndicator,
  SendMessageActions,
} from "@/features/admin/chat/pages/AdminChatPage";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";

function ChatPage() {
  const chatId = 2;
  const { isLoadingChat, chat } = useChat.useById(chatId, {
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    enabled: !!chatId,
  });
  const { isLoadingMessages, messages, refetchMessages } = useChat.useMessages(
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
    <div>
      <PageTitle />
      <div className="flex relative flex-col h-full border rounded-md">
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
    <div className="mb-8">
      <h1 className="text-5xl font-bold">Chat</h1>
      <p className="text-md text-muted-foreground">
        Message us whatever you want to ask
      </p>
    </div>
  );
}
