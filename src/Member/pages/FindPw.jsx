import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../api/auth";
import "./FindPw.css";

export default function FindPw() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const canSend = userId.trim() !== "" && phone.trim() !== "";

  const handleSend = async () => {
    setMsg("");
    setError("");

    if (!canSend) {
      setError("아이디와 휴대폰 번호를 모두 입력해 주세요.");
      return;
    }

    const digits = phone.replaceAll("-", "");
    if (digits.length < 10) {
      setError("휴대폰 번호를 올바르게 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 스펙: POST /api/auth/password/reset-request
      // body: { user_id, phone }
      const res = await authApi.passwordResetRequest({ user_id: userId.trim(), phone: digits });

      if (res?.result === false) {
        throw new Error(res?.message || "일치하는 회원정보가 없습니다.");
      }

      setMsg("인증번호가 전송되었습니다.");

      // ✅ 인증번호 입력 페이지로 이동
      navigate("/findpw2", { state: { phone: digits, user_id: userId.trim() } });
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "인증번호 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findPwPage">
      <section className="findPwCard">
        <h1 className="title">비밀번호 찾기</h1>
        <p className="sub">비밀번호 재설정을 위해 본인 인증이 필요합니다.</p>

        {error && <div className="alert error">{error}</div>}
        {msg && <div className="alert success">{msg}</div>}

        <div className="field">
          <label className="label">아이디</label>
          <input
            className="input"
            placeholder="아이디를 입력해 주세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="label">휴대폰 번호</label>
          <input
            className="input"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </div>

        <p className="hint">* 입력하신 휴대폰 번호로 인증번호가 전송됩니다.</p>

        <button
          type="button"
          className={`sendBtn ${canSend && !loading ? "on" : "off"}`}
          onClick={handleSend}
          disabled={!canSend || loading}
        >
          {loading ? "전송 중..." : "인증번호 전송"}
        </button>

        <button type="button" className="backLink" onClick={() => navigate("/login")} disabled={loading}>
          로그인으로 돌아가기
        </button>
      </section>
    </div>
  );
}
