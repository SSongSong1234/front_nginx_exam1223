import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth.jsx";

/**
 * ✅ 관리자 보호 라우트
 */
export default function RequireAdmin() {
  const { isAdmin, booting } = useAuth();

  if (booting) return null;
  if (!isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
}
