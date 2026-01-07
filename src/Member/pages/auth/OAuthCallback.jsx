import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8081"; // ✅ 백엔드 주소(배포면 도메인으로)

export default function OAuthCallback() {
  const nav = useNavigate();
  const { provider } = useParams(); // naver/google/kakao
  const { search } = useLocation();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      const state = params.get("state"); // 네이버에서 주로 사용

      if (!code) {
        nav("/login", { replace: true });
        return;
      }

      try {
        // ✅ 백엔드에 code 넘기고 우리 서비스 JWT/user 받기
        // 백엔드는: code → token교환 → 사용자정보 → 회원가입/로그인 → JWT 발급
        const res = await axios.get(`${API_BASE}/oauth/${provider}/callback`, {
          params: { code, state },
          withCredentials: true, // 쿠키 방식이면 필요
        });

        // 백엔드가 { user: {...}, token: "JWT" } 형태로 준다고 가정
        const { user, token } = res.data;

        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        nav("/", { replace: true });
      } catch (e) {
        console.error(e);
        nav("/login", { replace: true });
      }
    };

    run();
  }, [provider, search, nav]);

  return (
    <div style={{ padding: 40 }}>
      로그인 처리중입니다...
    </div>
  );
}
