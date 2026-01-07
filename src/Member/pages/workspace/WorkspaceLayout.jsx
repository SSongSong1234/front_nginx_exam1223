import { Outlet } from "react-router-dom";
import WorkspaceNavbar from "../../components/WorkspaceNavbar";
import "./WorkspaceLayout.css";

/**
 * ✅ MainLayout(Navbar/Footer)와 분리된 작업 페이지 레이아웃
 * - className prefix: weditWs__
 */
export default function WorkspaceLayout() {
  return (
    <div className="weditWs">
      <WorkspaceNavbar subtitle="AI 피부 보정 · 작업 페이지" />
      <main className="weditWs__main">
        <Outlet />
      </main>
    </div>
  );
}
