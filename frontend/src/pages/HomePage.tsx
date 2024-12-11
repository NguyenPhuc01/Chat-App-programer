import { ChatContainer } from "../components/ChatContainer";
import { NoChatSelected } from "../components/NoChatSelected";
import { SidebarChat } from "../components/SidebarChat";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  // useEffect(() => {
  //   console.log("subbbbbbb");

  //   subscribeToMessage();
  //   return () => unsubscribeFromMessage();
  // }, [subscribeToMessage, unsubscribeFromMessage]);
  return <div className="h-screen bg-base-200">HomePage</div>;
};

export default HomePage;
