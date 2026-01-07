import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth.jsx";
import "./WorkspaceNavbar.css";

/**
 * ✅ 작업(Workspace) 전용 Navbar
 * - 기존 Member/components/Navbar와 완전히 분리
 * - className prefix: weditWsNav__ (충돌 방지)
 */
export default function WorkspaceNavbar({ subtitle = "AI 피부 보정 · 작업 페이지" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/workspace/album")) return "album";
    if (location.pathname.startsWith("/workspace/correction")) return "correction";
    return "";
  }, [location.pathname]);

  const go = (path) => navigate(path);

  const onLogout = async () => {
    await logout();
    navigate("/login", { state: { reset: true } });
  };

  return (
    <header className="weditWsNav">
      <div className="weditWsNav__inner">
        <button
          type="button"
          className="weditWsNav__brand"
          onClick={() => go("/workspace/correction")}
        >
          <span className="weditWsNav__logoDot" aria-hidden="true" />
          <div className="weditWsNav__brandText">
            <div className="weditWsNav__title">WED:IT</div>
            <div className="weditWsNav__subtitle">{subtitle}</div>
          </div>
        </button>

        <div className="weditWsNav__actions">
          <button
            type="button"
            className={`weditWsNav__btn ${activeKey === "correction" ? "isActive" : ""}`}
            onClick={() => go("/workspace/correction")}
          >
            보정
          </button>

          <button
            type="button"
            className={`weditWsNav__btn ${activeKey === "album" ? "isActive" : ""}`}
            onClick={() => go("/workspace/album")}
          >
            내 앨범
          </button>

          <button type="button" className="weditWsNav__btn" onClick={() => go("/pricing")}>
            플랜
          </button>

          <button
            type="button"
            className="weditWsNav__btn weditWsNav__btn--danger"
            onClick={onLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
