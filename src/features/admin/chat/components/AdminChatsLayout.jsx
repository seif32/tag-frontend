import { Outlet, useNavigate, useParams } from "react-router";
import ChatList from "./ChatList";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Menu, MessageCircleMore, X } from "lucide-react";
import { IconEmptyState } from "@/ui/IconEmptyState";

function AdminChatsLayout() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const debouncedInput = useDebounce(searchInput, 500);

  const { chats, isLoadingChats, isErrorChats, errorChats, refetchChats } =
    useChat.useAll(
      { search: debouncedInput },
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

  const handleChatClick = (id) => {
    navigate(`/admin/chat/${id}`);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-100">
      {/* 🆕 Mobile Toggle Button - Top Left (Better Position) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-white border-2 border-gray-200 text-gray-700 rounded-full shadow-lg lg:hidden hover:shadow-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}
      {/* Sidebar - Chat List */}
      <div
        className={`
          fixed lg:relative
          inset-y-0 left-0
          w-full sm:w-96 lg:w-1/3 xl:w-1/4
          bg-white
          transform transition-transform duration-300 ease-out
          z-40
          flex flex-col
          shadow-xl lg:shadow-none
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <ChatList
          chats={chats}
          selectedChatId={chatId}
          onChatClick={handleChatClick}
          setSearchInput={setSearchInput}
          searchInput={searchInput}
        />
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {chatId ? (
          <Outlet />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <IconEmptyState
              subtitle={"Select a conversation to start messaging"}
              icon={MessageCircleMore}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChatsLayout;
