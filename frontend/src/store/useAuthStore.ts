import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { IDataSignup, IUser, IDataLogin } from "./auth.type";
import { io } from "socket.io-client";
interface AuthState {
  authUser: IUser | null;
  isSigningUp: boolean;
  isLoggingIng: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: any;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  signup: (data: IDataSignup) => Promise<void>;
  login: (data: IDataLogin) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const res = JSON.parse(localStorage.getItem("userData") || "");
      set({ authUser: res });
      get().connectSocket();
    } catch (error) {
      console.log("🚀 ~ checkAuth: ~ error:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data: IDataSignup) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: IDataLogin) => {
    set({ isLoggingIng: true });
    try {
      const res = await axiosInstance.post("auth/login", data);
      localStorage.setItem("userData", JSON.stringify(res.data));
      set({ authUser: res.data });
      toast.success("Login successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      localStorage.clear();
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("auth/update_profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userId) => {
      set({ onlineUsers: userId });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
