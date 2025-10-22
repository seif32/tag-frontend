import { Outlet, useNavigate, useParams } from "react-router";
import ChatList from "./ChatList";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Menu, X } from "lucide-react";

function AdminChatsLayout() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const debouncedInput = useDebounce(searchInput, 500);

  const { chats, isLoadingChats, isErrorChats, errorChats, refetchChats } =
    useChat.useAll(
      {
        search: debouncedInput,
      },
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
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-5 left-5 z-50 p-2 bg-accent text-white rounded-lg shadow-lg lg:hidden hover:bg-gray-100 transition-colors"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar - Chat List */}
      <div
        className={`
          fixed lg:relative
          inset-y-0 left-0
          w-full sm:w-80 lg:w-1/3
          bg-white border-r
          transform transition-transform duration-300 ease-in-out
          z-40
          flex flex-col
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
      <div className="flex-1 w-full lg:w-2/3 overflow-hidden">
        {chatId ? (
          <Outlet />
        ) : (
          <div className="h-full flex items-center justify-center bg-stone-50">
            <p className="text-muted-foreground text-center px-4">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChatsLayout;
