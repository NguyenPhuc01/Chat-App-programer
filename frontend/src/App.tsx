import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";
import DefaultLayout from "./layout/DefaultLayout";
import { useEffect } from "react";
import ChatPage from "./pages/ChatPage";
const App = () => {
  const { authUser, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  // const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // if (!authUser && isCheckingAuth) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader className="size-10 animate-spin" />
  //     </div>
  //   );
  // }
  // useEffect(() => {
  //   console.log("🚀 ~ useEffect ~ !authUser:", !authUser);
  //   if (!authUser) {
  //     navigate("/login");
  //   } else {
  //     console.log("xxx");
  //     if (location.pathname === "/login") {
  //       navigate("/");
  //     }
  //   }
  // }, [authUser, location.pathname, navigate]);
  return (
    <div data-theme={theme}>
      <DefaultLayout>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </DefaultLayout>
      <Toaster />
    </div>
  );
};

export default App;
