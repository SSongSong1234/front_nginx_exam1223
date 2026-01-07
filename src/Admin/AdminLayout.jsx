import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./admin.css";

/**
 * ✅ Admin 공통 Shell
 * - 사이드바 + 메인 영역만 담당
 * - 페이지별 헤더(제목/로그아웃)는 각 페이지에서 AdminPage로 처리
 */
export default function AdminLayout() {
  return (
    <div className="adminShell">
      <AdminSidebar />

      <div className="adminMain">
        <main className="adminContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
