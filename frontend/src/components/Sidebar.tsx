import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const Sidebar = () => {
  const {
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getListConversation,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showInputSearch, setShowInputSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    getListConversation();
  }, [getListConversation]);

  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? users.filter((user: any) => onlineUsers.includes(user._id))
      : users;
  }, [showOnlineOnly, users, onlineUsers]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (e.key === "Enter") {
      // TODO: Search user based on keyword
      console.log("Search user based on keyword", keyword);
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        {showInputSearch ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Add your search logic here
              console.log("Searching for:", keyword);
            }}
            className="relative"
          >
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm "
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                setKeyword("");
                setShowInputSearch(false);
              }}
            >
              <X className="size-4 text-gray-400 hover:text-gray-600" />
            </button>
          </form>
        ) : (
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Contacts</span>
            </div>
            <Search
              className="size-5 cursor-pointer"
              onClick={() => {
                setShowInputSearch(true);
              }}
            />
          </div>
        )}

        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers &&
          filteredUsers.length > 0 &&
          filteredUsers.map((user: any) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user?.profilePic || "/avatar.png"}
                  alt={user?.fullName}
                  className="size-12 object-cover rounded-full max-w-none"
                />
                {onlineUsers?.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user?.fullName}</div>

                <div className="text-sm text-zinc-400 overflow-hidden whitespace-nowrap text-ellipsis">
                  {user.lastMessage.text}
                </div>
              </div>
            </button>
          ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
