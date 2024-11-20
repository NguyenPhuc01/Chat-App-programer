import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { IDataSignup, IUser, IDataLogin } from "./auth.type";
interface AuthState {
  authUser: IUser | null;
  isSigningUp: boolean;
  isLoggingIng: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: IDataSignup) => Promise<void>;
  login: (data: IDataLogin) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check");
      set({ authUser: res.data });
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
      set({ authUser: res.data });
      toast.success("Login successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
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
}));
