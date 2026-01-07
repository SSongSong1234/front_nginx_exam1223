import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as authApi from "../../api/auth";
import "./FindPw2.css";

export default function FindPw2() {
  const navigate = useNavigate();
  const location = useLocation();

  // FindPw에서 넘겨준 phone / user_id
  const rawPhone = location.state?.phone || "01012345678";
  const userId = location.state?.user_id || "";

  const maskedPhone = useMemo(() => {
    const d = String(rawPhone).replaceAll("-", "");
    if (d.length < 10) return rawPhone;
    return `${d.slice(0, 3)}****${d.slice(-4)}`;
  }, [rawPhone]);

  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(179); // 02:59
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // 타이머
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

      // ✅ 백엔드 스펙: POST /api/auth/phone/verify
      // 문서에는 phone만 적혀있지만, 실무적으로는 code가 필요 → 함께 보냄
      const res = await authApi.phoneVerify({ phone: String(rawPhone).replaceAll("-", ""), code: code.trim() });

      if (res?.result === false) {
        throw new Error(res?.message || "인증번호가 올바르지 않습니다.");
      }

      // 인증 성공 → 비밀번호 변경 페이지로 이동
      navigate("/findpw3", { state: { user_id: userId } });
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMsg("");
    try {
      setLoading(true);

      // 1) 가장 확실: reset-request를 다시 호출(백이 이때 코드 발송)
      if (userId) {
        await authApi.passwordResetRequest({ user_id: userId, phone: String(rawPhone).replaceAll("-", "") });
      } else {
        // 2) 또는 send-code만 지원하는 경우
        await authApi.phoneSendCode({ phone: String(rawPhone).replaceAll("-", "") });
      }

      setMsg("인증번호를 다시 전송했습니다.");
      setSeconds(179);
      setCode("");
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "재전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pw2Page">
      <section className="pw2Card">
        <h1 className="pw2Title">인증번호 입력</h1>
        <p className="pw2Sub">{maskedPhone}로 발송된 인증번호를 입력해 주세요.</p>

        {error && <div className="alert error">{error}</div>}
        {msg && <div className="alert success">{msg}</div>}

        <div className="field">
          <label className="label">인증번호</label>

          <div className="otpRow">
            <input
              className="otpInput"
              placeholder="인증번호"
              value={code}
              onChange={(e) => {
                const onlyNum = e.target.value.replaceAll(/\D/g, "");
                setCode(onlyNum.slice(0, 6));
              }}
              disabled={loading}
            />
            <span className={`timer ${seconds === 0 ? "expired" : ""}`}>{timeText}</span>
          </div>

          <div className="helpRow">
            <span className="helpText">인증번호가 오지 않나요?</span>
            <button type="button" className="textBtn" onClick={handleResend} disabled={loading}>
              인증번호 재전송
            </button>
          </div>
        </div>

        <div className="infoBox">
          <p>• 3분 이내에 인증번호를 입력해 주세요.</p>
          <p>• 통신사 사정에 따라 전송이 지연될 수 있습니다.</p>
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
      </section>
    </div>
  );
}
