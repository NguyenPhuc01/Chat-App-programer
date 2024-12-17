import { useEffect } from "react";
import { ChatContainer } from "../components/ChatContainer";
import { NoChatSelected } from "../components/NoChatSelected";
import { SidebarChat } from "../components/SidebarChat";
import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
  const { selectedUser, subscribeToMessage, unsubscribeFromMessage } =
    useChatStore();
  useEffect(() => {
    console.log("subbbbbbb");

    subscribeToMessage();
    return () => unsubscribeFromMessage();
  }, [subscribeToMessage, unsubscribeFromMessage]);
  return (
    <div className="h-full bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className=" bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden ">
            <SidebarChat />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
