import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../api/auth";
import "./FindId.css";

export default function FindId() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSearch = name.trim() !== "" && phone.trim() !== "";

  const handleSearch = async () => {
    setError("");

    if (!canSearch) {
      setError("이름과 휴대폰 번호를 모두 입력해 주세요.");
      return;
    }

    const digits = phone.replaceAll("-", "");
    if (digits.length < 10) {
      setError("휴대폰 번호를 올바르게 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 스펙: POST /api/auth/find-id { phone }
      // - 현재 UI는 name도 입력 받지만, 스펙에는 phone만 있음 → phone만 전달
      const res = await authApi.findId({ phone: digits });

      // 문서 예시: { result: "user_id" }
      const foundId = res?.result;

      if (!foundId) {
        setError(res?.message || "일치하는 회원정보가 없습니다.");
        return;
      }

      navigate("/findid2", {
        state: {
          userId: foundId,
          // joinedAt은 스펙에 없음 → FindId2에서 기본값 사용
        },
      });
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "아이디 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findPage">
      <section className="findCard">
        <h1 className="findTitle">아이디 찾기</h1>
        <p className="findSub">등록된 정보로 아이디를 찾으실 수 있습니다.</p>

        {error && <div className="alert error">{error}</div>}

        <div className="field">
          <label className="label">이름</label>
          <input
            className="input"
            placeholder="이름을 입력해 주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <p className="hint">* 가입 시 입력한 휴대폰 번호와 동일해야 합니다.</p>

        <button
          type="button"
          className={`sendBtn ${canSearch && !loading ? "on" : "off"}`}
          onClick={handleSearch}
          disabled={!canSearch || loading}
        >
          {loading ? "조회 중..." : "아이디 조회"}
        </button>

        <div className="bottomLinks">
          <button type="button" className="linkBtn" onClick={() => navigate("/login")}
            disabled={loading}
          >
            로그인
          </button>
          <span className="sep">|</span>
          <button type="button" className="linkBtn" onClick={() => navigate("/findpw")}
            disabled={loading}
          >
            비밀번호 찾기
          </button>
        </div>
      </section>
    </div>
  );
}
