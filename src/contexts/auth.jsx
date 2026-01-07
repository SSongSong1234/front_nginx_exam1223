import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import * as usersApi from "../api/users";

const AuthContext = createContext(null);

const STORAGE_KEY = "user";

// ✅ 프론트 단독 테스트용(백엔드 role 미구현일 때 관리자 UI 확인)
// - 배포 전에는 꼭 삭제하거나, 백엔드에서 role을 내려주도록 맞추는 게 정석!
const DEV_ADMIN_IDS = ["king"];

/**
 * ✅ 로컬 저장 구조(기존 코드 호환)
 * {
 *   user_id, username, role, plan, nickname, name, phone, joinedAt, ...
 * }
 */
function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  if (!user) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [booting, setBooting] = useState(true);

  // ✅ 앱 시작 시: 저장된 user_id가 있으면 getInfo로 한번 새로고침(선택)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const stored = readStoredUser();
        if (!stored?.user_id && !stored?.username) return;

        const userId = stored.user_id || stored.username;

        // 백엔드가 /users/me 제공하면 최신 정보로 갱신
        const info = await usersApi.me(userId);

        // info 스펙이 아직 확정이 아닐 수 있어서 최대한 안전하게 매핑
        const next = {
          ...stored,
          user_id: userId,
          username: userId,
          name: info?.name ?? info?.username ?? stored?.name,
          nickname: info?.nickname ?? info?.name ?? stored?.nickname,
          phone: info?.phone ?? stored?.phone,
          role: info?.role ?? stored?.role ?? (DEV_ADMIN_IDS.includes(userId) ? "ADMIN" : "USER"),
          plan: info?.plan ?? stored?.plan ?? "FREE",
          joinedAt: info?.joinedAt ?? stored?.joinedAt,
        };

        if (!alive) return;
        setUser(next);
        writeStoredUser(next);
      } catch {
        // getInfo 실패해도 앱은 계속 동작
      } finally {
        if (alive) setBooting(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const login = async ({ user_id, pwd }) => {
    // 1) 로그인 (/auth/login)
    const res = await authApi.login({ user_id, pwd });

    // 백엔드가 {result:true}만 준다면 이 체크만으로 충분
    if (res?.result === false) {
      throw new Error(res?.message || "로그인 실패");
    }

    // 2) 내 정보 조회(가능하면) (/users/me)
    let info = null;
    try {
      info = await usersApi.me(user_id);
    } catch {
      // 스펙 미구현이면 무시
    }

    const next = {
      user_id,
      username: user_id, // ✅ 기존 Navbar/RequireAuth 호환
      name: info?.name ?? null,
      nickname: info?.nickname ?? info?.name ?? null,
      phone: info?.phone ?? null,
      role: info?.role ?? (DEV_ADMIN_IDS.includes(user_id) ? "ADMIN" : "USER"),
      plan: info?.plan ?? "FREE",
      joinedAt: info?.joinedAt ?? null,
    };

    setUser(next);
    writeStoredUser(next);
    return next;
  };

  const logout = async () => {
    try {
      const userId = user?.user_id || user?.username;
      if (userId) await authApi.logout(userId);
    } catch {
      // 로그아웃 API 실패해도 프론트는 로그아웃 처리
    } finally {
      setUser(null);
      writeStoredUser(null);
    }
  };

  const refreshMe = async () => {
    const userId = user?.user_id || user?.username;
    if (!userId) return null;

    const info = await usersApi.me(userId);
    const next = {
      ...user,
      user_id: userId,
      username: userId,
      name: info?.name ?? user?.name,
      nickname: info?.nickname ?? info?.name ?? user?.nickname,
      phone: info?.phone ?? user?.phone,
      role: info?.role ?? user?.role,
      plan: info?.plan ?? user?.plan,
      joinedAt: info?.joinedAt ?? user?.joinedAt,
    };

    setUser(next);
    writeStoredUser(next);
    return next;
  };

  const value = useMemo(
    () => ({
      user,
      isLogin: !!user,
      isAdmin: user?.role === "ADMIN",
      booting,
      login,
      logout,
      refreshMe,
      setUser: (next) => {
        setUser(next);
        writeStoredUser(next);
      },
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
