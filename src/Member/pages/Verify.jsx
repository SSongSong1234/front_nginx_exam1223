import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./Verify.css";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FindId에서 넘겨준 phone이 있으면 표시용으로 사용
  // 예: navigate("/verify", { state: { phone: "01012345678", next: "/result" } })
  const rawPhone = location.state?.phone || "01012345678";
  const nextPath = location.state?.next || "/login"; // 인증 성공 후 이동할 곳(원하면 변경)

  const maskedPhone = useMemo(() => {
    const d = String(rawPhone).replaceAll("-", "");
    if (d.length < 10) return rawPhone;
    // 010****5678 형태
    return `${d.slice(0, 3)}****${d.slice(-4)}`;
  }, [rawPhone]);

  // ✅ OTP 입력/타이머
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(179); // 2:59
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // ✅ 타이머 감소
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeText = useMemo(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [seconds]);

  const canConfirm = code.trim().length >= 4 && seconds > 0 && !loading;

  // ✅ 가짜 검증(연습용) : 1234면 성공
  const fakeVerifyApi = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code.trim() === "1234") resolve(true);
        else reject(new Error("인증번호가 올바르지 않습니다."));
      }, 800);
    });

  const handleConfirm = async () => {
    setError("");
    setMsg("");

    if (seconds === 0) {
      setError("인증 시간이 만료되었습니다. 인증번호를 재전송 해주세요.");
      return;
    }
    if (code.trim().length < 4) {
      setError("인증번호를 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 붙이면 여기만 fetch로 교체
      await fakeVerifyApi();

      setMsg("인증이 완료되었습니다!");
      // ✅ 성공 시 다음 페이지로
      navigate(nextPath, { replace: true });
    } catch (e) {
      setError(e.message || "인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // 재전송(예시)
    setMsg("인증번호를 다시 전송했습니다. (예시)");
    setError("");
    setSeconds(179);
  };

  return (
    <>
      <div className="verifyPage">
        <section className="verifyCard">
          <h1 className="verifyTitle">인증번호 입력</h1>
          <p className="verifySub">
            {maskedPhone}로 발송된 인증번호를 입력해 주세요.
          </p>

          {/* 메시지 */}
          {error && <div className="alert error">{error}</div>}
          {msg && <div className="alert success">{msg}</div>}

          {/* 입력 */}
          <div className="field">
            <label className="label">인증번호</label>

            <div className="otpRow">
              <input
                className="otpInput"
                placeholder="인증번호 입력"
                value={code}
                onChange={(e) => {
                  // 숫자만 입력되게
                  const onlyNum = e.target.value.replaceAll(/\D/g, "");
                  setCode(onlyNum.slice(0, 6)); // 최대 6자리
                }}
                disabled={loading}
              />
              <span className={`timer ${seconds === 0 ? "expired" : ""}`}>
                {timeText}
              </span>
            </div>

            <div className="helpRow">
              <span className="helpText">인증번호가 오지 않나요?</span>
              <button type="button" className="textBtn" onClick={handleResend} disabled={loading}>
                인증번호 재전송
              </button>
            </div>
          </div>

          {/* 안내 박스 */}
          <div className="infoBox">
            <p>- 3분 이내에 인증번호를 입력해 주세요.</p>
            <p>- 통신사 사정에 따라 전송이 지연될 수 있습니다.</p>
          </div>

          <button
            type="button"
            className={`confirmBtn ${canConfirm ? "on" : "off"}`}
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            {loading ? "확인 중..." : "확인"}
          </button>

          <button type="button" className="backBtn" onClick={() => navigate(-1)} disabled={loading}>
            이전 단계로
          </button>

          {/* 테스트용(원하면 삭제) */}
          <p className="devHint">
            테스트: 인증번호 <b>1234</b> 입력하면 성공
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
