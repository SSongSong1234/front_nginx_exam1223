import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Terms2.css";

import { join } from "../../api/auth"; // ✅ 너가 만든 join
import { phoneSendCode, phoneVerify } from "../../api/auth"; // ✅ 너가 만든 phoneSendCode/phoneVerify
import { checkId } from "../../api/auth"; // ✅ 너가 만든 checkId

const onlyDigits = (s) => (s || "").replace(/\D/g, "");

/** 아이디 조건: 영문/숫자 4~16 */
const isValidUserId = (id) => /^[a-zA-Z0-9]{4,16}$/.test(id);

/** 비밀번호 조건: 특문1 + 영소문자1 + 숫자1 (길이 8+) */
const isValidPassword = (pw) => {
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return pw.length >= 8 && hasLower && hasNumber && hasSpecial;
};

/** 휴대폰: 숫자 10~11자리 */
const isValidPhone = (phone) => {
  const p = onlyDigits(phone);
  return p.length >= 10 && p.length <= 11;
};

const formatMMSS = (sec) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export default function Terms2() {
  const navigate = useNavigate();

  // ===== 입력값 =====
  const [userId, setUserId] = useState("");
  const [name, setName] = useState(""); // 닉네임/이름
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  // ===== 보기 토글 =====
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // ===== 아이디 중복체크 상태 =====
  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const [idChecking, setIdChecking] = useState(false);

  // ===== 휴대폰 인증 상태 =====
  const [sent, setSent] = useState(false); // 인증번호 전송됨?
  const [verified, setVerified] = useState(false); // 인증완료?
  const [sending, setSending] = useState(false); // 전송 중
  const [verifying, setVerifying] = useState(false); // 인증 중
  const [timerSec, setTimerSec] = useState(0); // 남은 시간 (초) => 5분 = 300

  // ===== 메시지 =====
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ===== 타이머 =====
  useEffect(() => {
    if (timerSec <= 0) return;
    const t = setInterval(() => setTimerSec((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timerSec]);

  // ✅ userId 바뀌면 중복체크 무효화
  useEffect(() => {
    setIdChecked(false);
    setIdAvailable(false);
  }, [userId]);

  // ✅ phone 바뀌면 인증 무효화 + 타이머/코드 초기화
  useEffect(() => {
    setSent(false);
    setVerified(false);
    setTimerSec(0);
    setCode("");
  }, [phone]);

  // =========================
  // 1) 아이디 중복체크
  // =========================
  const handleCheckId = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const trimmed = userId.trim();
    if (!isValidUserId(trimmed)) {
      setErrorMsg("아이디는 영문/숫자 4~16자로 입력해 주세요.");
      return;
    }

    try {
      setIdChecking(true);
      // ✅ 백 응답이 {result:true}면 "사용 가능" 같은 형태라 가정
      const res = await checkId({ user_id: trimmed });

      // 서버마다 의미가 다를 수 있어서 안전하게 처리:
      // - result === true : 사용 가능
      // - result === false: 중복
      const ok = res?.result === true;

      setIdChecked(true);
      setIdAvailable(ok);

      if (ok) setSuccessMsg("사용 가능한 아이디입니다.");
      else setErrorMsg("이미 사용 중인 아이디입니다.");
    } catch (e) {
      setIdChecked(false);
      setIdAvailable(false);
      setErrorMsg(e?.message || "아이디 중복 확인에 실패했습니다.");
    } finally {
      setIdChecking(false);
    }
  };

  // =========================
  // 2) 인증번호 전송
  // =========================
  const handleSendCode = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!isValidPhone(phone)) {
      setErrorMsg("휴대폰 번호가 정확히 입력됐는지 확인해주세요.");
      return;
    }

    try {
      setSending(true);

      const res = await phoneSendCode({ phone: onlyDigits(phone) });
      if (res?.result !== true) throw new Error(res?.message || "인증번호 전송에 실패했습니다.");

      setSent(true);
      setVerified(false);
      setCode("");

      // ✅ 5:00 타이머 시작
      setTimerSec(300);

      setSuccessMsg("인증번호가 전송되었습니다. 5분 안에 입력해 주세요.");
    } catch (e) {
      setErrorMsg(e?.message || "인증번호 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  // =========================
  // 3) 재전송 (문구 클릭)
  // =========================
  const handleResend = async () => {
    // 요구사항: 재전송 문구는 항상 보이게
    // 실무에선 스팸 방지로 제한을 두지만, 여기선 요청대로 바로 재전송 가능하게 함
    await handleSendCode();
  };

  // =========================
  // 4) 인증완료(검증)
  // =========================
  const handleVerify = async () => {
  setErrorMsg("");
  setSuccessMsg("");

  if (!sent) {
    setErrorMsg("먼저 인증번호를 전송해 주세요.");
    return;
  }
  if (timerSec <= 0) {
    setErrorMsg("인증 시간이 만료되었습니다. 재전송 후 다시 시도해 주세요.");
    return;
  }
  if (onlyDigits(code).length < 4) {
    setErrorMsg("인증번호를 정확히 입력해 주세요.");
    return;
  }

  try {
    setVerifying(true);

    const res = await phoneVerify({
      phone: onlyDigits(phone),
      code: onlyDigits(code),
    });

    if (res?.result !== true) {
      setVerified(false);
      throw new Error(res?.message || "인증번호가 일치하지 않습니다.");
    }

    // ✅ 성공 처리(여기서만!)
    setVerified(true);

    // ✅ 타이머 멈추기 (둘 중 하나만 택1)
    // stopTimer?.();      // stopTimer 함수가 있으면 이거
    setTimerSec(0);       // stopTimer 없으면 이거로 충분

    setSuccessMsg("휴대폰 인증이 완료되었습니다 ✅");
  } catch (e) {
    setVerified(false);
    setErrorMsg(e?.message || "인증에 실패했어요.");
  } finally {
    setVerifying(false);
  }
};

  // =========================
  // 5) 회원가입 버튼 활성화 조건(6개)
  // =========================
  const condIdRule = isValidUserId(userId.trim());
  const condIdDup = idChecked && idAvailable;                 
  const condPwSame = pw.length > 0 && pw === pw2;             
  const condPwRule = isValidPassword(pw);                    
  const condName = name.trim().length > 0;                    
  const condPhoneVerified = verified;                         

  const canSubmit = useMemo(() => {
    return (
      condIdRule &&
      condIdDup &&
      condPwSame &&
      condPwRule &&
      condName &&
      condPhoneVerified
    );
  }, [condIdRule, condIdDup, condPwSame, condPwRule, condName, condPhoneVerified]);

  // =========================
  // submit
  // =========================
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!canSubmit) return;

    try {
      setLoading(true);

      const res = await join({
        user_id: userId.trim(),
        pwd: pw,
        name: name.trim(),
        phone: onlyDigits(phone),
      });

      if (res?.result !== true) throw new Error(res?.message || "회원가입에 실패했습니다.");

      setSuccessMsg("회원가입이 완료되었습니다!");
      navigate("/terms3", { state: { user: userId.trim() } });
    } catch (e2) {
      setErrorMsg(e2?.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="joinPage">
      <div className="joinWrap">
        <h1 className="joinTitle">회원가입</h1>
        <p className="joinSub">회원가입 진행을 위해 정보를 입력해주세요</p>

        {errorMsg && <div className="alert error">{errorMsg}</div>}
        {successMsg && <div className="alert success">{successMsg}</div>}

        <form className="joinForm" onSubmit={handleSubmit}>
          {/* ================= 아이디 ================= */}
          <div className="field">
            <label className="label">
              <span className="icon" aria-hidden="true">👤</span>
              아이디
            </label>

            <div className="inputRow">
              <input
                className="input"
                type="text"
                placeholder="영문/숫자 4~16자"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
              <button
                type="button"
                className="miniBtn"
                onClick={handleCheckId}
                disabled={loading || idChecking}
              >
                {idChecking ? "확인중..." : "중복확인"}
              </button>
            </div>

            {!condIdRule && userId.length > 0 && (
              <p className="hint error">아이디는 영문/숫자 4~16자로 입력해 주세요.</p>
            )}
            {idChecked && idAvailable && <p className="hint success">사용 가능한 아이디입니다.</p>}
            {idChecked && !idAvailable && <p className="hint error">이미 사용 중인 아이디입니다.</p>}
          </div>

          {/* ================= 이름/닉네임 ================= */}
          <div className="field">
            <label className="label">
              <span className="icon" aria-hidden="true">👤</span>
              닉네임
            </label>
            <input
              className="input"
              type="text"
              placeholder="닉네임을 입력해 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            {name.trim().length === 0 && (
              <p className="hint">닉네임을 입력해 주세요.</p>
            )}
          </div>

          {/* ================= 비밀번호 ================= */}
          <div className="field">
            <label className="label">
              <span className="icon" aria-hidden="true">🔒</span>
              비밀번호
            </label>
            <div className="inputRow">
              <input
                className="input"
                type={showPw1 ? "text" : "password"}
                placeholder="특문/영소문자/숫자 포함 8자+"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="miniBtn"
                onClick={() => setShowPw1((v) => !v)}
                disabled={loading}
              >
                {showPw1 ? "숨기기" : "보기"}
              </button>
            </div>

            {pw.length > 0 && !condPwRule && (
              <p className="hint error">비밀번호는 특문 1개 + 영소문자 + 숫자를 포함해 8자 이상이어야 합니다.</p>
            )}
          </div>

          {/* ================= 비밀번호 확인 ================= */}
          <div className="field">
            <label className="label">
              <span className="icon" aria-hidden="true">🔒</span>
              비밀번호 확인
            </label>
            <div className="inputRow">
              <input
                className="input"
                type={showPw2 ? "text" : "password"}
                placeholder="비밀번호를 다시 입력해 주세요"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="miniBtn"
                onClick={() => setShowPw2((v) => !v)}
                disabled={loading}
              >
                {showPw2 ? "숨기기" : "보기"}
              </button>
            </div>

            {pw2.length > 0 && !condPwSame && (
              <p className="hint error">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {/* ================= 휴대폰 인증 ================= */}
          <div className="field">
            <label className="label">
              <span className="icon" aria-hidden="true">📞</span>
              휴대폰 번호 인증
            </label>

            {/* phone input */}
            <div className="inputRow">
              <input
                className="input"
                type="tel"
                placeholder="휴대폰 번호 입력"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                inputMode="numeric"
              />

              {/* ✅ 버튼 자리: 전송 전엔 버튼 / 전송 후엔 빨간 타이머(버튼 사라짐) */}
              {!sent ? (
                <button
                  type="button"
                  className="miniBtn"
                  onClick={handleSendCode}
                  disabled={loading || sending}
                >
                  {sending ? "전송중..." : "인증번호 전송"}
                </button>
              ) : (
                <div className="timerText" aria-live="polite">
                  {timerSec > 0 ? formatMMSS(timerSec) : "00:00"}
                </div>
              )}
            </div>

            {/* 휴대폰 입력 검증 문구 */}
            {phone.length > 0 && !isValidPhone(phone) && (
              <p className="hint error">휴대폰 번호가 정확히 입력됐는지 확인해주세요.</p>
            )}

            {/* 전송 후: 인증번호 입력 + (바깥) 인증완료 버튼 + 재전송 문구 */}
            {sent && (
              <div className="smsArea">
                <div className="smsRow">
                  <input
                    className="input smsInput"
                    type="text"
                    placeholder="인증번호 입력"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={loading || verified}
                    inputMode="numeric"
                  />

                  {/* ✅ input 바깥쪽 버튼 */}
                  <button
                    type="button"
                    className={`smsVerifyBtn ${verified ? "ok" : ""}`}
                    onClick={handleVerify}
                    disabled={loading || verifying || verified}
                  >
                    {verified ? "인증완료" : verifying ? "확인중..." : "인증완료"}
                  </button>
                </div>

                <div className="smsHintRow">
                  <button
                    type="button"
                    className="resendTextBtn"
                    onClick={handleResend}
                    disabled={loading || sending}
                  >
                    재전송
                  </button>

                  {verified && <span className="smsOk">인증 완료</span>}
                  {!verified && timerSec <= 0 && (
                    <span className="smsExpired">시간이 만료되었습니다. 재전송 후 다시 시도하세요.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= 회원가입 ================= */}
          <button
            className={`submitBtn ${canSubmit && !loading ? "on" : "off"}`}
            disabled={!canSubmit || loading}
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>

          <button
            type="button"
            className="backBtn"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            이전으로
          </button>
        </form>
      </div>
    </div>
  );
}
