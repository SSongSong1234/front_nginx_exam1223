// src/Member/pages/legal/LegalDetail.jsx
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./LegalDetail.css";
import { LEGAL_DOCS } from "./legalDocs";

export default function LegalDetail() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const doc = useMemo(() => LEGAL_DOCS[docId], [docId]);

  if (!doc) {
    return (
      <main className="ldPage">
        <div className="ldWrap">
          <h1>문서를 찾을 수 없어요</h1>
          <button className="ldBtn" onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
      </main>
    );
  }

  const goBack = () => {
    const from = location.state?.from;
    navigate(from || -1);
  };

  return (
    <main className="ldPage">
      <div className="ldWrap">
        <div className="ldHeader">
          <h1 className="ldTitle">{doc.title}</h1>
          <div className="ldMeta">최종 업데이트: {doc.updatedAt}</div>
        </div>

        {/* 요약 박스 */}
        <div className="ldSummary">
          {doc.summary?.map((t, i) => (
            <div key={i} className="ldSumItem">• {t}</div>
          ))}
        </div>

        {/* 본문(스크롤 박스) */}
        <div className="ldBodyBox">
          {doc.body?.map((sec, idx) => (
            <section key={idx} className="ldSec">
              <h2 className="ldH2">{sec.h}</h2>
              {sec.p?.map((line, i) => (
                <p key={i} className="ldP">{line}</p>
              ))}
              {sec.hint && <p className="ldHint">{sec.hint}</p>}
            </section>
          ))}
        </div>

        <div className="ldActions">
          <button className="ldBtn ghost" onClick={goBack}>이전</button>
          <button className="ldBtn primary" onClick={goBack}>확인</button>
        </div>
      </div>
    </main>
  );
}
