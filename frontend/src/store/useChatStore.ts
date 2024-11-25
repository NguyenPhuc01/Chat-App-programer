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
  unread?: boolean;
  lastMessage: Message;
}
interface ChatStore {
  messages: Message[];
  users: User[];
  resultSearchUser: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  // getUsers: () => Promise<void>;
  getListConversation: () => Promise<void>;
  searchFullnameUser: (keyword: string) => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (data: any) => Promise<void>;
  // getLastMessage: (data: any) => Promise<void>;
  subscribeToMessage: () => void;
  unsubscribeFromMessage: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
}
export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  resultSearchUser: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,
  // getUsers: async () => {
  //   set({ isUsersLoading: true });
  //   try {
  //     const response = await axiosInstance.get("message/user");
  //     set({ users: response.data });
  //   } catch (error: any) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isUsersLoading: false });
  //   }
  // },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`message/${userId}`);

      set({ messages: res.data });
      const updatedUsers = get().users.map((user) =>
        user._id === userId
          ? {
              ...user,
              lastMessage: res.data[res.data.length - 1], // Cập nhật lastMessage.text
            }
          : user
      );
      set({ users: updatedUsers });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData: any) => {
    const { selectedUser, messages } = get();
    try {
      // Gửi tin nhắn đến server
      const res = await axiosInstance.post(
        `message/send/${selectedUser?._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });

      const updatedUsers = get()
        .users.map((user) =>
          user._id === selectedUser?._id
            ? {
                ...user,
                lastMessage: {
                  ...(user.lastMessage || {}),
                  text: messageData.text,
                }, // Cập nhật lastMessage.text
              }
            : user
        )
        .slice();

      const userIndex = updatedUsers.findIndex(
        (user) => user._id === selectedUser?._id
      );
      if (userIndex !== -1) {
        const [selectedUserObj] = updatedUsers.splice(userIndex, 1);
        updatedUsers.unshift(selectedUserObj);
      }

      // Cập nhật trạng thái với danh sách người dùng đã thay đổi
      set({ users: updatedUsers });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessage: () => {
    const selectedUser = get().selectedUser;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: Message) => {
      if (selectedUser?._id === newMessage.senderId) {
        const updatedUsers = get()
          .users.map((user) =>
            user._id === newMessage.senderId
              ? { ...user, lastMessage: newMessage, unread: false }
              : user
          )
          .slice();
        // const userIndex = updatedUsers.findIndex(
        //   (user) => user._id === selectedUser?._id
        // );
        // if (userIndex !== -1) {
        //   const [selectedUserObj] = updatedUsers.splice(userIndex, 1);
        //   updatedUsers.unshift(selectedUserObj);
        // }

        // Cập nhật trạng thái
        set({
          users: updatedUsers,
          messages: [...get().messages, newMessage],
        });
        set({ messages: [...get().messages, newMessage] });
      } else {
        const updatedUsers = get()
          .users.map((user) => {
            if (user._id === newMessage.senderId) {
              return { ...user, lastMessage: newMessage, unread: true };
            } else {
              return user;
            }
          })
          .slice();
        const userIndex = updatedUsers.findIndex(
          (user) => user._id === newMessage.senderId
        );
        if (userIndex !== -1) {
          const [selectedUserObj] = updatedUsers.splice(userIndex, 1);
          updatedUsers.unshift(selectedUserObj);
        }
        set({
          users: updatedUsers,
        });
      }
    });
  },
  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  // getLastMessage: async (data) => {
  //   const listUserId: any[] = [];
  //   data.forEach((element: any) => {
  //     if (element._id) {
  //       listUserId.push(element._id);
  //     }
  //   });
  //   try {
  //     const res = await axiosInstance.post(`message/getLastMessage`, {
  //       userIds: listUserId,
  //     });

  //   } catch (error) {
  //     console.log("🚀 ~ useChatStore ~ error:", error);
  //   }
  // },
  getListConversation: async () => {
    try {
      const userId = useAuthStore.getState().authUser?._id;
      const res = await axiosInstance.get(`message/conversation/${userId}`);
      set({ users: res.data });
    } catch (error) {
      console.log("🚀 ~ getListConversation: ~ error:", error);
    }
  },
  searchFullnameUser: async (keyword: string) => {
    try {
      const res = await axiosInstance.get(`message/searchUser/${keyword}`);
      console.log("🚀 ~ searchFullnameUser: ~ res:", res);
      if (res.status === 200) {
        set({ resultSearchUser: res.data.users });
      }
    } catch (error) {
      console.log("🚀 ~ getListConversation: ~ error:", error);
    }
  },
  setSelectedUser: (selectedUser: any) => {
    set({ selectedUser: selectedUser });
    const updatedUsers = get().users.map((user) => {
      if (user._id === selectedUser._id) {
        return { ...user, unread: false };
      } else {
        return user;
      }
    });
    set({
      users: updatedUsers,
    });
  },
}));
