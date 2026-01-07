import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as authApi from "../../api/auth";
import "./FindPw3.css";

export default function FindPw3() {
  const navigate = useNavigate();
  const location = useLocation();

  // FindPw2에서 넘겨준 user_id
  const userId = location.state?.user_id || "";

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const isValidPw = useMemo(() => {
    const hasLength = pw.length >= 8;
    const hasNum = /[0-9]/.test(pw);
    const hasLetter = /[a-zA-Z]/.test(pw);
    return hasLength && hasNum && hasLetter;
  }, [pw]);

  const canSave = pw !== "" && pw2 !== "" && pw === pw2 && isValidPw && !loading;

  const handleSave = async () => {
    setError("");
    setMsg("");

    if (!userId) {
      setError("유저 정보가 없습니다. 비밀번호 찾기를 처음부터 다시 진행해 주세요.");
      return;
    }

    if (!isValidPw) {
      setError("비밀번호는 8자 이상 + 영문/숫자 포함으로 설정해 주세요.");
      return;
    }
    if (pw !== pw2) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 스펙: PATCH /api/auth/password/reset
      // 문서에는 { user_id, pwd, newPwd } 형태
      // - '비밀번호 찾기' 플로우에서는 기존 pwd가 없을 수 있어 빈 문자열로 전송
      const res = await authApi.passwordReset({ user_id: userId, pwd: "", newPwd: pw });

      if (res?.result === false) {
        throw new Error(res?.message || "비밀번호 변경에 실패했습니다.");
      }

      setMsg("비밀번호가 변경되었습니다!");
      setTimeout(() => navigate("/login", { replace: true, state: { reset: true } }), 400);
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "변경 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pw3Page">
      <section className="pw3Card">
        <h1 className="pw3Title">비밀번호 변경하기</h1>
        <p className="pw3Sub">새로운 비밀번호를 입력해 주세요.</p>

        {error && <div className="alert error">{error}</div>}
        {msg && <div className="alert success">{msg}</div>}

        <div className="field">
          <label className="label">새 비밀번호</label>
          <input
            className="inputBox"
            type="password"
            placeholder="새 비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={loading}
          />
          <p className={`rule ${isValidPw ? "ok" : ""}`}>
            {isValidPw ? "✓ 8자 이상 + 영문/숫자 포함" : "• 8자 이상 + 영문/숫자 포함"}
          </p>
        </div>

        <div className="field">
          <label className="label">새 비밀번호 확인</label>
          <input
            className="inputBox"
            type="password"
            placeholder="새 비밀번호 다시 입력"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            disabled={loading}
          />
          {pw2.length > 0 && pw !== pw2 && <p className="rule bad">비밀번호가 일치하지 않습니다.</p>}
        </div>

        <div className="infoBox2">
          <p>• 다른 사이트에서 사용하지 않는 안전한 비밀번호로 변경해 주시기 바랍니다.</p>
        </div>

        <div className="btnRow">
          <button type="button" className="cancelBtn" onClick={() => navigate("/login")} disabled={loading}>
            취소
          </button>
          <button type="button" className={`saveBtn ${canSave ? "on" : "off"}`} onClick={handleSave} disabled={!canSave}>
            {loading ? "저장 중..." : "변경 저장"}
          </button>
        </div>
      </section>
    </div>
  );
}
