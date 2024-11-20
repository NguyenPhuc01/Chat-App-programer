import { create } from "zustand";
interface ThemeStore {
  theme: string; // Giá trị của theme là chuỗi
  setTheme: (theme: string) => void; // Hàm setTheme nhận một tham số kiểu string
}
export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme: any) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
