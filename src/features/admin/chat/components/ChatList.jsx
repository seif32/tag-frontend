import { formatDateMDY } from "@/utils/dateUtils";

function ChatList({ chats, selectedChatId, onChatClick }) {
  console.log("ChatList", chats);
  return (
    <div className="flex h-full">
      <div className=" flex-1 border-r-0.2  border-gray">
        <h1 className="px-2">Chats</h1>
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
    </div>
  );
}

export default ChatList;

function ChatCard({
  id,
  onChatClick,
  first_name,
  last_name,
  seen_by_admin,
  updated_at,
  selectedChatId,
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
            <p
              className={`text-xs text-muted-foreground ${
                !seen_by_admin && "font-semibold"
              }`}
            >
              {!seen_by_admin ? "New Message" : "Seen by you"}
            </p>
            {!seen_by_admin && (
              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
            )}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground">
        <p>{formatDateMDY(updated_at)}</p>
      </div>
    </div>
  );
}
