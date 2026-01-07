import { NavLink } from "react-router-dom";

/**
 * ✅ 실무식: 메뉴 설정을 배열로 한 번에 관리
 * - label: 사이드바에 보이는 텍스트(짧게)
 * - desc : 페이지 상단 제목(길게) → 페이지 파일에서 사용할 예정
 */
const MENUS = [
  { to: "/admin/dashboard", label: "대시보드", pageTitle: "대시보드 개요" },
  { to: "/admin/members", label: "회원 관리", pageTitle: "전체 회원 관리" },
  { to: "/admin/payments", label: "결제 관리", pageTitle: "결제 내역 및 매출 관리" },
  { to: "/admin/logs", label: "시스템 로그", pageTitle: "API 및 시스템 로그" },
  { to: "/admin/api-keys", label: "API 관리", pageTitle: "API 키 관리" },
  { to: "/admin/inquiries", label: "문의 관리", pageTitle: "고객 문의 및 이슈 관리" },
  { to: "/admin/settings", label: "설정", pageTitle: "설정" },
];

export default function AdminSidebar() {
  return (
    <aside className="adminSidebar">
      <div className="adminBrand">WED:IT Admin</div>

      <nav className="adminNav">
        {MENUS.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) => (isActive ? "adminLink active" : "adminLink")}
          >
            {m.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
