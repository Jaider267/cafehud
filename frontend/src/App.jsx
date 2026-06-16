import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

let hasBootstrappedApp = false;

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializing = useAuthStore((state) => state.initializing);
  const initTheme = useThemeStore((state) => state.initTheme);

  // #region debug-point D:app-render
  fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"D",location:"src/App.jsx:17",msg:"[DEBUG] App render",data:{initializing,isAuthenticated},ts:Date.now()})}).catch(()=>{});
  // #endregion

  useEffect(() => {
    if (hasBootstrappedApp) {
      return;
    }

    hasBootstrappedApp = true;

    // #region debug-point D:app-initialize-effect
    fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"blank-screen-router",runId:"pre-fix",hypothesisId:"D",location:"src/App.jsx:21",msg:"[DEBUG] App initialize effect",data:{},ts:Date.now()})}).catch(()=>{});
    // #endregion
    initTheme();
    initialize();
  }, [initTheme, initialize]);

  if (initializing) {
    return <div className="min-h-screen flex items-center justify-center">Cargando sesión...</div>;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cobrar"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
