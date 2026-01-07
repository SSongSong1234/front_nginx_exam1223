import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useAuth } from "../../contexts/auth.jsx";

// ✅ 왕관 이미지 import (경로 맞춰!)
import crownBasic from "../assets/crown_basic.png";
import crownPro from "../assets/crown_pro.png";
import crownEnt from "../assets/crown_enterprise.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const boxRef = useRef(null);
  const { user, isLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onDown = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ✅ 4단계 플랜
  const plan = (user?.plan || "FREE").toUpperCase(); // FREE/BASIC/PRO/ENTERPRISE
  const planKey = plan.toLowerCase();               // css용: free/basic/pro/enterprise
  const hasCrown = plan !== "FREE";

  // ✅ 등급별 왕관 이미지 선택
  const crownSrc =
    plan === "BASIC" ? crownBasic :
    plan === "PRO" ? crownPro :
    plan === "ENTERPRISE" ? crownEnt :
    null;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login", { state: { reset: true } });
  };

  const handleMemberInquiry = () => {
    if (!isLogin) {
      alert("로그인한 회원만 문의를 이용할 수 있어요!");
      navigate("/login", { state: { reset: true, from: "/inquiries" } });
      return;
    }
    navigate("/inquiries");
  };

  return (
    <header className="navHeader">
      <div className="navInner">
        <div className="brand" onClick={() => navigate("/login", { state: { reset: true } })}>
          <span className="brandText">WED</span>
          <span className="brandDot">:</span>
          <span className="brandText">IT</span>
        </div>

        <nav className="menu">
          <NavLink to="/guide" className={({ isActive }) => (isActive ? "active" : "")}>가이드</NavLink>
          <NavLink to="/pricing" className={({ isActive }) => (isActive ? "active" : "")}>요금제</NavLink>

          <button
            type="button"
            className={`menuBtn ${location.pathname.startsWith("/inquiries") ? "active" : ""}`}
            onClick={handleMemberInquiry}
          >
            문의
          </button>
        </nav>

        <div className="navActions">
          {!isLogin ? (
            <>
              <button className="navBtn ghost" onClick={() => navigate("/login", { state: { reset: true } })}>
                로그인
              </button>
              <button className="navBtn primary" onClick={() => navigate("/terms")}>
                회원가입
              </button>
            </>
          ) : (
            <div className="profileBox" ref={boxRef}>
              <button type="button" className="profileBtn" onClick={() => setOpen((v) => !v)}>
                {/* ✅ FREE는 왕관 없음 / 나머지는 등급별 왕관 이미지 */}
                {hasCrown && crownSrc && (
                  <img className={`crownImg ${planKey}`} src={crownSrc} alt="" aria-hidden="true" />
                )}

                <span className={`planBadge ${planKey}`}>{plan}</span>
                <span className="userName">{user?.username || "user"}</span>

                <span className={`chev ${open ? "up" : ""}`} aria-hidden="true">▾</span>
              </button>

              <div className={`dropdown ${open ? "open" : ""}`}>
                <button type="button" className="dropItem" onClick={() => { setOpen(false); navigate("/mypage"); }}>
                  내 정보
                </button>
                <button type="button" className="dropItem" onClick={() => { setOpen(false); navigate("/workspace/album"); }}>
                  내 앨범
                </button>
                <button type="button" className="dropItem" onClick={() => { setOpen(false); navigate("/inquiries"); }}>
                  내 문의내역
                </button>

                <div className="dropLine" />

                <button type="button" className="dropLogout" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
