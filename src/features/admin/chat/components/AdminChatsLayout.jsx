import { Outlet, useNavigate, useParams } from "react-router";
import ChatList from "./ChatList";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";

function AdminChatsLayout() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const { chats, isLoadingChats, isErrorChats, errorChats, refetchChats } =
    useChat.useAll(
      {},
      {
        refetchInterval: 5000,
        refetchIntervalInBackground: false,
      }
    );

  if (isLoadingChats) return <LoadingState />;

  if (isErrorChats) {
    return (
      <ErrorMessage
        message={errorChats?.message || "Failed to load data"}
        dismissible
        onDismiss={refetchChats}
      />
    );
  }

  return (
    <div className="flex  ">
      <div className="w-1/3 border-r flex flex-col">
        <ChatList
          chats={chats?.data}
          selectedChatId={chatId}
          onChatClick={(id) => navigate(`/admin/chat/${id}`)}
        />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminChatsLayout;
