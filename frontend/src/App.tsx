import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import DefaultLayout from "./layout/DefaultLayout";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("🚀 ~ App ~ location:", location);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (!authUser && isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ !authUser:", !authUser);
    if (!authUser) {
      navigate("/login");
    } else {
      console.log("xxx");
      if (location.pathname === "/login") {
        navigate("/");
      }
    }
  }, [authUser, location.pathname, navigate]);
  return (
    <div data-theme={theme}>
      {authUser ? (
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </DefaultLayout>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" replace /> : <SignUpPage />}
          />
        </Routes>
      )}

      <Toaster />
    </div>
  );
};

export default App;
