import { Input } from "@/components/ui/input";
import useChat from "@/hooks/useChat";
import LoadingState from "@/ui/LoadingState";
import { formatDateMDY } from "@/utils/dateUtils";
import { useNavigate } from "react-router";

function ChatList({
  chats,
  selectedChatId,
  onChatClick,
  setSearchInput,
  searchInput,
}) {
  return (
    <div className="flex flex-col gap-4  h-screen border-r-0.2 ">
      <ListHeader setSearchInput={setSearchInput} searchInput={searchInput} />
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
    <div className="px-3 flex gap-2 flex-col">
      <div className="flex justify-between">
        <h1 className="px-2 font-bold text-lg">Chats</h1>
        <span className="w-6 h-6 rounded-full bg-red-500 grid place-items-center text-xs text-white ">
          {unseenCount}
        </span>
      </div>
      <Input
        className={"h-8 rounded-2xl"}
        placeholder="Search by name ..."
        value={searchInput}
        onChange={(e) => {
          navigate("/admin/chat");
          setSearchInput(e.target.value);
        }}
      />
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
  user_id,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 hover:bg-gray-100 cursor-pointer p-2 ${
        selectedChatId == id && "bg-gray-200"
      }`}
      onClick={() => onChatClick(id)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-12 h-12 rounded-full bg-gray-200 ${
            !seen_by_admin && "bg-gray-400"
          } ${selectedChatId == id && "bg-gray-300"}`}
        ></div>
        <div>
          <p
            className={`text-xs ${!seen_by_admin && "font-bold"}`}
          >{`${first_name} ${last_name}`}</p>

          <div className="flex items-center gap-2 ">
            {!seen_by_admin && (
              <div
                className={`w-2 h-2 rounded-full  ${
                  !seen_by_admin ? "bg-red-500" : "bg-muted-foreground"
                }`}
              ></div>
            )}
            <p
              className={`text-xs line-clamp-1 truncate w-40  ${
                !seen_by_admin
                  ? "font-semibold  text-red-500"
                  : "text-muted-foreground "
              }`}
            >
              {latest_message}
            </p>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground">
        <p>{formatDateMDY(latest_message_date)}</p>
      </div>
    </div>
  );
}
