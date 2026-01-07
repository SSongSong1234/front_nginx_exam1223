import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as usersApi from "../../../api/users";
import { useAuth } from "../../../contexts/auth";
import "./Withdraw.css";

export default function Withdraw() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  const reasons = useMemo(
    () => [
      "서비스 이용이 불편해요",
      "원하는 기능이 없어요",
      "결제/요금이 부담돼요",
      "품질이 만족스럽지 않아요",
      "기타",
    ],
    []
  );

  const [reason, setReason] = useState("");
  const [memo, setMemo] = useState("");
  const [pw, setPw] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canWithdraw = pw.trim() && agree && !loading;

  const onWithdraw = async () => {
    setError("");

    const userId = user?.user_id || user?.username;
    if (!userId) {
      setError("로그인이 필요합니다.");
      nav("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 스펙: PATCH /api/users/exit { user_id, pwd }
      const res = await usersApi.exit({ user_id: userId, pwd: pw });
      if (res?.result === false) {
        throw new Error(res?.message || "회원탈퇴에 실패했습니다.");
      }

      // (선택) reason/memo를 백에 보내고 싶으면 exit 스펙에 추가 요청 필요
      console.log("withdraw reason/memo", { reason, memo });

      await logout();
      alert("회원탈퇴 처리되었습니다.");
      nav("/login", { replace: true, state: { reset: true } });
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "회원탈퇴에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wdPage">
      <section className="wdShell">
        <h1 className="wdTitle">회원탈퇴</h1>
        <p className="wdSub">탈퇴 전 아래 내용을 확인해주세요. 탈퇴는 되돌릴 수 없습니다.</p>

        <div className="wdLine" />

        <div className="wdBody">
          {error && <div className="wdError">{error}</div>}

          <div className="wdNotice">
            <div className="wdNoticeHead">
              <span className="wdNoticeIcon" aria-hidden="true">!</span>
              <div>
                <div className="wdNoticeTitle">탈퇴 시 처리 안내</div>
                <div className="wdNoticeDesc">
                  계정 및 서비스 이용 권한이 즉시 해제됩니다. 일부 데이터는 정책에 따라 일정 기간 보관될 수 있어요.
                </div>
              </div>
            </div>

            <div className="wdNoticeList">
              <ul>
                <li>보정 이력/프로젝트는 정책에 따라 삭제 또는 보관됩니다.</li>
                <li>유료 플랜이 활성화되어 있다면, 탈퇴 전 구독 해지를 권장합니다.</li>
                <li>탈퇴 후 동일 이메일 재가입은 가능하지만, 이전 데이터 복구는 불가합니다.</li>
              </ul>
              <div className="wdNoticeTag">(서비스 운영·정산 목적)</div>
            </div>
          </div>

          <div className="wdForm">
            <div className="wdInner">
              <div className="wdField">
                <div className="wdLabel">탈퇴 사유 (선택)</div>
                <select className="wdSelect" value={reason} onChange={(e) => setReason(e.target.value)} disabled={loading}>
                  <option value="">선택 안 함</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="wdField">
                <div className="wdLabel">추가 의견 (선택)</div>
                <textarea
                  className="wdTextarea"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="의견을 남겨주시면 서비스 개선에 도움이 됩니다."
                  disabled={loading}
                />
              </div>

              <div className="wdField">
                <div className="wdLabel">비밀번호 확인</div>
                <input
                  className="wdInput"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="현재 비밀번호 입력"
                  disabled={loading}
                />
              </div>

              <label className="wdAgreeRow">
                <input
                  className="wdCheckbox"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  disabled={loading}
                />
                <span className="wdAgreeText">안내 사항을 확인했으며, 탈퇴 시 데이터 복구가 불가함에 동의합니다.</span>
              </label>

              <div className="wdBtnRow">
                <button className="wdBtn" type="button" onClick={() => nav(-1)} disabled={loading}>
                  취소
                </button>
                <button className="wdBtn wdBtnRed" type="button" onClick={onWithdraw} disabled={!canWithdraw}>
                  {loading ? "처리 중..." : "회원탈퇴"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
