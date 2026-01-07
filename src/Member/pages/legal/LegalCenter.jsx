// src/Member/pages/legal/LegalCenter.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LegalCenter.css";
import { LEGAL_DOCS } from "./legalDocs";

export default function LegalCenter() {
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      { key: "serviceTerms", label: "이용약관" },
      { key: "privacyCollect", label: "개인정보처리방침" },
      { key: "aiConsent", label: "AI 데이터 처리" },
      { key: "thirdParty", label: "제3자 제공" },
    ],
    []
  );

  const [active, setActive] = useState("serviceTerms");
  const doc = LEGAL_DOCS[active];

  return (
    <main className="lcPage">
      <div className="lcWrap">
        <div className="lcTop">
          <h1 className="lcTitle">법적 고지</h1>
          <div className="lcSub">WED:IT 서비스 이용 관련 문서를 확인할 수 있습니다.</div>
        </div>

        <div className="lcTabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`lcTab ${active === t.key ? "active" : ""}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="lcBar">
          <div className="lcBarLeft">
            <b>{doc?.title}</b>
            <span className="lcMeta">({doc?.updatedAt})</span>
          </div>
          <button className="lcMini" onClick={() => navigate(`/legal/${active}`, { state: { from: "/legal" } })}>
            상세보기
          </button>
        </div>

        <div className="lcBody">
          {doc?.body?.map((sec, idx) => (
            <section key={idx} className="lcSec">
              <h2 className="lcH2">{sec.h}</h2>
              {sec.p?.map((line, i) => (
                <p key={i} className="lcP">{line}</p>
              ))}
              {sec.hint && <p className="lcHint">{sec.hint}</p>}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
