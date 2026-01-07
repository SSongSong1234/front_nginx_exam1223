import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/auth.jsx";

export default function RequireAuth() {
  const { isLogin, booting } = useAuth();
  const location = useLocation();

  if (booting) return null; // 필요하면 로딩 UI로 교체
  if (!isLogin) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
