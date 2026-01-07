import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Terms.css";
import { LEGAL_DOCS } from "./legal/legalDocs";

export default function Terms() {
  const navigate = useNavigate();

  const items = useMemo(
    () => [
      LEGAL_DOCS.serviceTerms,
      LEGAL_DOCS.privacyCollect,
      LEGAL_DOCS.aiConsent,
      LEGAL_DOCS.marketing,
      // thirdParty는 “실제 제공이 있을 때만” 넣는 걸 추천
      // LEGAL_DOCS.thirdParty,
    ],
    []
  );

  const [checked, setChecked] = useState(() =>
    Object.fromEntries(items.map((d) => [d.id, false]))
  );

  const allChecked = items.every((d) => checked[d.id] === true);
  const requiredOk = items.filter((d) => d.required).every((d) => checked[d.id] === true);

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(items.map((d) => [d.id, next])));
  };

  const toggleOne = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openDetail = (docId) => {
    navigate(`/legal/${docId}`, { state: { from: "/terms" } });
  };

  const goNext = () => {
    if (!requiredOk) {
      alert("필수 약관에 모두 동의해 주세요.");
      return;
    }
    // ✅ 다음 단계: 회원가입 폼으로 이동
    navigate("/terms2");
  };

  return (
    <main className="termsPage">
      <div className="termsBox">
        <h1 className="termsTitle">서비스 이용 약관</h1>
        <p className="termsSub">원활한 WED:IT 이용을 위해 약관에 동의해 주세요.</p>

        <div className="termsAll">
          <label className="chkRow">
            <input type="checkbox" checked={allChecked} onChange={toggleAll} />
            <span>약관 전체 동의</span>
          </label>
        </div>

        <div className="termsList">
          {items.map((d) => (
            <div key={d.id} className="termsItem">
              <label className="chkRow">
                <input
                  type="checkbox"
                  checked={checked[d.id]}
                  onChange={() => toggleOne(d.id)}
                />
                <span className="reqTag">{d.required ? "[필수]" : "[선택]"}</span>
                <span className="docTitle">{d.title}</span>
              </label>

              <button type="button" className="viewBtn" onClick={() => openDetail(d.id)}>
                보기 ›
              </button>
            </div>
          ))}
        </div>

        <div className="termsActions">
          <button type="button" className="btn ghost" onClick={() => navigate("/login")}>
            취소
          </button>
          <button type="button" className={`btn primary ${requiredOk ? "" : "disabled"}`} onClick={goNext}>
            동의하고 시작하기
          </button>
        </div>
      </div>
    </main>
  );
}
