import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MenuIcon, Search, Users, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const SidebarChat = () => {
  const {
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getListConversation,
    searchFullnameUser,
    resultSearchUser,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showInputSearch, setShowInputSearch] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    getListConversation();
  }, [getListConversation]);

  const filteredUsers = useMemo(() => {
    if (showInputSearch) {
      return showOnlineOnly
        ? resultSearchUser.filter((user: any) => onlineUsers.includes(user._id))
        : resultSearchUser;
    } else {
      return showOnlineOnly
        ? users.filter((user: any) => onlineUsers.includes(user._id))
        : users;
    }
  }, [showOnlineOnly, users, onlineUsers, resultSearchUser, showInputSearch]);

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <div>
      <aside className="h-full w-16 sm:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="block sm:hidden">
          <div className="drawer">
            <input
              id="my-drawer"
              type="checkbox"
              className="drawer-toggle"
              checked={isDrawerOpen}
              onChange={(e) => setIsDrawerOpen(e.target.checked)}
            />
            <div className="drawer-content mt-2 flex justify-center">
              {/* Page content here */}
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
              >
                <MenuIcon className="size-5" />
              </label>
            </div>
            <div className="drawer-side z-50">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <div>
                  <div className="border-b border-base-300 w-full p-5">
                    {showInputSearch ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          await searchFullnameUser(keyword);
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
                      <>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="size-6" />
                            <span className="font-medium ">Contacts</span>
                          </div>
                          <Search
                            className="size-5 cursor-pointer"
                            onClick={() => {
                              setShowInputSearch(true);
                            }}
                          />
                        </div>
                        <div className="mt-5 flex items-center gap-2">
                          <label className="cursor-pointer flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={showOnlineOnly}
                              onChange={(e) =>
                                setShowOnlineOnly(e.target.checked)
                              }
                              className="checkbox checkbox-sm"
                            />
                            <span className="text-sm">Show online only</span>
                          </label>
                          <span className="text-xs text-zinc-500">
                            ({onlineUsers.length - 1} online)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="overflow-y-auto w-full py-3 ">
                    {filteredUsers &&
                      filteredUsers.length > 0 &&
                      filteredUsers.map((user: any) => (
                        <div
                          className=" flex w-full justify-between items-center"
                          key={user._id}
                        >
                          <button
                            onClick={() => {
                              console.log("🚀 ~ Sidebar ~ user:", user);
                              setSelectedUser(user);
                              setIsDrawerOpen(false);
                            }}
                            className={`w-full p-3  flex items-center gap-3 hover:bg-base-300 transition-colors rounded-lg ${
                              selectedUser?._id === user._id
                                ? "bg-base-300 ring-1 ring-base-300"
                                : ""
                            }
            `}
                          >
                            <div className="relative  mx-0">
                              <img
                                src={user?.profilePic || "/avatar.png"}
                                alt={user?.fullName}
                                className="size-12 object-cover rounded-full max-w-none"
                              />
                              {onlineUsers?.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500  rounded-full ring-2 ring-zinc-900" />
                              )}
                            </div>

                            <div className=" text-left min-w-0">
                              <div className="font-medium truncate">
                                {user?.fullName}
                              </div>

                              <div className="text-sm text-zinc-400 overflow-hidden whitespace-nowrap text-ellipsis">
                                {user?.lastMessage
                                  ? user?.lastMessage.text
                                  : "Chưa có tin nhắn nào"}
                              </div>
                            </div>
                          </button>
                          <div className=" mr-3 w-2.5 h-2.5 rounded-full bg-base-content"></div>
                        </div>
                      ))}

                    {filteredUsers.length === 0 && (
                      <div className="text-center text-zinc-500 py-4">
                        {showInputSearch ? "No users found" : "No online users"}
                      </div>
                    )}
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-base-300 w-full p-5">
            {showInputSearch ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Add your search logic here
                  await searchFullnameUser(keyword);
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
              <>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden sm:block">
                      Contacts
                    </span>
                  </div>
                  <Search
                    className="size-5 cursor-pointer"
                    onClick={() => {
                      setShowInputSearch(true);
                    }}
                  />
                </div>
                <div className="mt-5 hidden sm:flex items-center gap-2">
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
              </>
            )}

            {/* TODO: Online filter toggle */}
          </div>

          <div className="overflow-y-auto w-full py-3">
            {filteredUsers &&
              filteredUsers.length > 0 &&
              filteredUsers.map((user: any) => (
                <div
                  key={user._id}
                  className={`flex w-full justify-between items-center hover:bg-base-300 transition-colors rounded-lg ${
                    selectedUser?._id === user._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full p-3  flex items-center gap-3  
  `}
                  >
                    <div className="relative  mx-0">
                      <img
                        src={user?.profilePic || "/avatar.png"}
                        alt={user?.fullName}
                        className="size-12 object-cover rounded-full max-w-none"
                      />
                      {onlineUsers?.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500  rounded-full ring-2 ring-zinc-900" />
                      )}
                    </div>

                    <div className=" text-left min-w-0">
                      <div className="font-medium truncate">
                        {user?.fullName}
                      </div>

                      <div className="text-sm text-zinc-400 overflow-hidden whitespace-nowrap text-ellipsis">
                        {user?.lastMessage
                          ? user?.lastMessage.text
                          : "Chưa có tin nhắn nào"}
                      </div>
                    </div>
                  </button>
                  {user?.unread && (
                    <div className=" mr-3 w-2.5 h-2.5 rounded-full bg-base-content"></div>
                  )}
                </div>
              ))}

            {filteredUsers.length === 0 && (
              <div className="text-center text-zinc-500 py-4">
                {showInputSearch ? "No users found" : "No online users"}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
