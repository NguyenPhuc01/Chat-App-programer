import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageSkeleton } from "./skeletons/MessageSkeleton";

export const ChatContainer = () => {
  const { messages, getMessages, isMessageLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser?._id);
    }
  }, [selectedUser?._id, getMessages]);

  if (isMessageLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <p>message</p>
      <MessageInput />
    </div>
  );
};
