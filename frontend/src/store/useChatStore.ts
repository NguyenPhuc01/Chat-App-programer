import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface User {
  _id: string;
  fullName: string;
  profilePic?: string;
}
interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (data: any) => Promise<void>;
  subscribeToMessage: () => void;
  unsubscribeFromMessage: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
}
export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("message/user");
      set({ users: response.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`message/${userId}`);
      console.log("🚀 ~ getMessages: ~ res:", res);
      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData: any) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `message/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: Message) => {
      if (selectedUser?._id === newMessage.senderId) {
        set({ messages: [...get().messages, newMessage] });
      }
    });
  },
  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: any) => set({ selectedUser }),
}));
