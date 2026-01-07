import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../../api/auth";
import { useAuth } from "../../../contexts/auth";
import "./ChangePassword.css";

export default function PasswordChange() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = user?.user_id || user?.username;
  const canSave = !!(userId && currentPw.trim() && newPw.trim() && newPw2.trim() && !loading);

  const onSubmit = async () => {
    setError("");

    if (!userId) {
      setError("로그인이 필요합니다.");
      nav("/login", { replace: true });
      return;
    }
    if (newPw.length < 8) {
      setError("새 비밀번호는 8자 이상으로 입력해 주세요.");
      return;
    }
    if (newPw !== newPw2) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 스펙: PATCH /api/auth/password/reset
      // body: { user_id, pwd, newPwd }
      const res = await authApi.passwordReset({ user_id: userId, pwd: currentPw, newPwd: newPw });

      if (res?.result === false) {
        throw new Error(res?.message || "비밀번호 변경에 실패했습니다.");
      }

      nav("/account/password/success", { replace: true });
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pwPage">
      <div className="pwInner">
        <h1 className="pwTitle">비밀번호 변경하기</h1>
        <p className="pwSub">안전한 계정보호를 위해 주기적으로 비밀번호를 변경해주세요.</p>

        {error && <div className="pwError">{error}</div>}

        <div className="pwForm">
          <div className="pwField">
            <label className="pwLabel">현재 비밀번호</label>
            <input
              className="pwInput"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="현재 비밀번호 입력"
              disabled={loading}
            />
          </div>

          <div className="pwField">
            <label className="pwLabel">새 비밀번호</label>
            <input
              className="pwInput"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호 입력"
              disabled={loading}
            />
          </div>

          <div className="pwField">
            <label className="pwLabel">새 비밀번호 확인</label>
            <input
              className="pwInput"
              type="password"
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value)}
              placeholder="새 비밀번호 다시 입력"
              disabled={loading}
            />
          </div>

          <div className="pwBtnRow">
            <button className="pwBtn" type="button" onClick={() => nav(-1)} disabled={loading}>
              취소
            </button>
            <button className="pwBtn pwBtnDark" type="button" onClick={onSubmit} disabled={!canSave}>
              {loading ? "저장 중..." : "변경 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
