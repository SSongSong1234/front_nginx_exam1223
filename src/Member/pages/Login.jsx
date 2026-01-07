import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socialJoin } from "../../api/auth";
import "./Login.css";

import promoImg from "../assets/img1.png";
import rogoImg1 from "../assets/naver.png";
import rogoImg2 from "../assets/google.png";
import rogoImg3 from "../assets/kakao.png";
import { useAuth } from "../../contexts/auth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLogin, user } = useAuth();

  // ✅ 입력값 상태
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  // ✅ UI 상태
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canLogin = userId.trim() && pw.trim();

  // 소셜로그인쪽? 회원가입 ?
  const [socialLoading, setSocialLoading] = useState(false);
  const [notice, setNotice] = useState("");

const handleSocialJoin = async (provider) => {
  setError("");
  setNotice("");

  try {
    setSocialLoading(true);

    // ✅ 테스트용: provider별 고정 아이디(매번 가입 안되게)
    const payload = {
      user_id: `${provider}_test123`,
      name: "홍길동",
    };

    const res = await socialJoin(payload);

    if (res?.result !== true) {
      throw new Error("소셜 가입에 실패했습니다.");
    }

    // ✅ 성공 안내 + 아이디 자동 입력
    setNotice("소셜 회원가입이 완료되었습니다! 이제 로그인 해주세요.");
    setUserId(payload.user_id);
    setPw(""); // 비번은 비워두는 게 자연스러움
  } catch (e) {
    setError(e.friendlyMessage || e.message || "소셜 가입에 실패했습니다.");
  } finally {
    setSocialLoading(false);
  }
};


  // ✅ Navbar에서 state.reset 전달하면 입력값 초기화
  useEffect(() => {
    if (location?.state?.reset) {
      setUserId("");
      setPw("");
      setError("");
      // state를 한번 쓰고 나면 남아있지 않게(사용자 UX)
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // ✅ 이미 로그인 상태면 바로 이동
  useEffect(() => {
    if (!isLogin) return;
    navigate(user?.role === "ADMIN" ? "/admin" : "/main", { replace: true });
  }, [isLogin, user, navigate]);

  const handleLogin = async () => {
    setError("");

    if (!canLogin) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);
      const me = await login({ user_id: userId.trim(), pwd: pw });

      // ✅ 로그인 성공 후 이동
      navigate(me.role === "ADMIN" ? "/admin" : "/mypage", { replace: true });
    } catch (e) {
      setError(e.friendlyMessage || e.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginWrap">
      {/* 큰 흰 배경 컨테이너 */}
      <div className="loginContainer">
        {/* 왼쪽 영역 */}
        <section className="leftArea">
          <img className="promoImg" src={promoImg} alt="메인로고 사진" />
        </section>

        {/* 오른쪽 로그인 카드 */}
        <section className="rightArea">
          <div className="loginCard">
            <div className="cardHeader">
              <h1 className="cardLogo">WED:IT</h1>
              <p className="cardSub">
                보정의 새로운 차원,<br />
                완벽을 재정의 하다
              </p>
            </div>

            {/* ✅ form은 submit 막고, 버튼 클릭으로만 동작 */}
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {/* 에러 메시지 */}
              {error && <div className="loginError">{error}</div>}
              {notice && <div className="loginNotice">{notice}</div>}
              {/* 아이디 */}
              <div className="field">
                <input
                  className="input"
                  placeholder="아이디를 입력해 주세요"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {/* 비밀번호 */}
              <div className="field">
                <div className="pwRow">
                  <input
                    className="input"
                    type={showPw ? "text" : "password"}
                    placeholder="비밀번호를 입력해 주세요"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    className="pwToggle"
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? "숨기기" : "비밀번호 보기"}
                  </button>
                </div>
              </div>

              <button
                className="loginBtn"
                type="button"
                onClick={handleLogin}
                disabled={!canLogin || loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>

              <div className="subLinks">
                <button type="button" className="linkBtn" onClick={() => navigate("/findid")}>
                  아이디 찾기
                </button>
                <button type="button" className="linkBtn" onClick={() => navigate("/findpw")}>
                  비밀번호 찾기
                </button>
                <button type="button" className="linkBtn" onClick={() => navigate("/terms")}>
                  회원가입
                </button>
              </div>

              {/* 소셜 로그인(현재 UI 유지) */}
              <div className="social">
                <button className="socialBtn" type="button" onClick={()=> handleSocialJoin("naver")} disabled={socialLoading}>
                  <img className="socialIcon" src={rogoImg1} alt="naver" />
                </button>

                <button className="socialBtn" type="button" onClick={()=> handleSocialJoin("google")} disabled={socialLoading}>
                  <span className="googleBox">
                    <img className="googleImg" src={rogoImg2} alt="google" />
                  </span>
                </button>

                <button className="socialBtn" type="button" onClick={()=> handleSocialJoin("kakao")} disabled={socialLoading}>
                  <img className="socialIcon" src={rogoImg3} alt="kakao" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
