import { Input } from "@/components/ui/input";
import useChat from "@/hooks/useChat";
import { IconEmptyState } from "@/ui/IconEmptyState";
import LoadingState from "@/ui/LoadingState";
import { formatDateMDY } from "@/utils/dateUtils";
import { MessageCircleDashed, Search } from "lucide-react";
import { useNavigate } from "react-router";

function ChatList({
  chats,
  selectedChatId,
  onChatClick,
  setSearchInput,
  searchInput,
}) {
  return (
    // 🆕 h-full instead of h-screen to fit in parent container
    <div className="flex flex-col h-full bg-white">
      <ListHeader setSearchInput={setSearchInput} searchInput={searchInput} />

      {chats?.length === 0 ? (
        <IconEmptyState
          height={"py-15"}
          subtitle={"No contacts yet"}
          icon={MessageCircleDashed}
        />
      ) : (
        // 🆕 This scrolls independently
        <div className="flex-1 overflow-y-auto">
          {chats?.map((chat) => (
            <ChatCard
              key={chat?.id}
              {...chat}
              onChatClick={onChatClick}
              selectedChatId={selectedChatId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;

function ListHeader({ setSearchInput, searchInput }) {
  const navigate = useNavigate();
  const { unseenCount, isLoadingUnseenCount } = useChat.useUnseenCount({
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });

  if (isLoadingUnseenCount) return <LoadingState />;

  return (
    <div className="px-4 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Header Title */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl text-gray-900">Messages</h1>
        {Boolean(unseenCount) && (
          <span className="min-w-[24px] h-6 px-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-xs font-semibold text-white shadow-md">
            {unseenCount}
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="h-10 pl-10 rounded-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
          placeholder="Search conversations..."
          value={searchInput}
          onChange={(e) => {
            navigate("/admin/chat");
            setSearchInput(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

function ChatCard({
  id,
  onChatClick,
  first_name,
  last_name,
  seen_by_admin,
  latest_message_date,
  latest_message,
  selectedChatId,
}) {
  const isSelected = selectedChatId == id;
  const isUnread = !seen_by_admin;

  return (
    <div
      className={`
        flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-all duration-200
        border-l-4
        ${
          isSelected
            ? "bg-blue-50 border-l-blue-500"
            : isUnread
            ? "bg-red-50/30 border-l-red-500 hover:bg-red-50/50"
            : "border-l-transparent hover:bg-gray-50"
        }
      `}
      onClick={() => onChatClick(id)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm
            ${
              isUnread
                ? "bg-gradient-to-br from-red-500 to-pink-600"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }
            ${isSelected && "ring-2 ring-blue-500 ring-offset-2"}
          `}
        >
          {first_name?.[0]}
          {last_name?.[0]}
        </div>

        {/* Online Indicator */}
        {isUnread && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        {/* Name and Time */}
        <div className="flex justify-between items-baseline gap-2 mb-1">
          <p
            className={`text-sm truncate ${
              isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"
            }`}
          >
            {`${first_name} ${last_name}`}
          </p>
          <span className="text-[10px] text-gray-400 flex-shrink-0">
            {formatDateMDY(latest_message_date)}
          </span>
        </div>

        {/* Latest Message */}
        <div className="flex items-center gap-2">
          {isUnread && (
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
          )}
          <p
            className={`text-xs line-clamp-1 truncate ${
              isUnread ? "font-semibold text-red-600" : "text-gray-500"
            }`}
          >
            {latest_message}
          </p>
        </div>
      </div>
    </div>
  );
}
