import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

export default function UserMenu({ username = "hong123", plan = "BASIC", onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const isPro = plan === "PRO";

  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="userMenuWrap" ref={wrapRef}>
      <button
        type="button"
        className="userBadge"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={`crown ${isPro ? "pro" : "basic"}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M3 7l4.5 5L12 6l4.5 6L21 7v12H3V7zm2 10h14v-6.2l-2.7 3.1L12 8.7 7.7 13.9 5 10.8V17z"
            />
          </svg>
        </span>

        <span className={`planTag ${isPro ? "pro" : "basic"}`}>{plan}</span>
        <span className="username">{username}</span>
        <span className={`chev ${open ? "up" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="dropdown" role="menu">
          <button type="button" className="ddItem" role="menuitem" onClick={() => go("/mypage")}>
            내 정보
          </button>
          <button type="button" className="ddItem" role="menuitem" onClick={() => go("/workspace/album")}>
            내 앨범
          </button>

          <div className="ddDivider" />

          <button
            type="button"
            className="ddItem logout"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
