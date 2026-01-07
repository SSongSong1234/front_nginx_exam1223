import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInquiries from "./useInquiries";
import "./inquiries.css";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faqItem">
      <button className="faqQ" onClick={() => setOpen((v) => !v)} type="button">
        <span>{q}</span>
        <span className="faqPlus">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="faqA">{a}</div>}
    </div>
  );
}

export default function InquiryBoard() {
  const navigate = useNavigate();
  const { items, loading, reload } = useInquiries();

  // ✅ 로그인 유저(문의 등록 시 작성자 자동 세팅용)
  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  // ✅ “내 문의”만 보여주기 (username 기준)
  const myItems = items;

  const faqs = [
    { q: "보정 결과가 마음에 들지 않아요", a: "마이페이지에서 재보정 요청을 남기거나, 문의하기로 구체적인 요청사항을 보내주세요." },
    { q: "이미지 사용 제한은 어떻게 되나요?", a: "플랜별 월 사용량이 다릅니다. API/요금제 페이지에서 확인 가능합니다." },
    { q: "결제했는데 결과가 안 나와요", a: "결제 내역/주문번호와 함께 문의해주시면 빠르게 확인해드릴게요." },
    { q: "상업적 사용이 가능한가요?", a: "기업용(Enterprise) 플랜에서 별도 계약 후 가능합니다." },
  ];

  return (
    <div className="inqWrap">
      <h1 className="inqTitle">문의게시판</h1>
      <p className="inqDesc">자주 묻는 질문을 확인하고, 내 문의 내역을 관리하세요.</p>

      {/* FAQ */}
      <section className="inqSection">
        <h2 className="secTitle">자주 묻는 질문 (FAQ)</h2>
        <div className="faqBox">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* 내 문의 내역 */}
      <section className="inqSection">
        <h2 className="secTitle">내 문의 내역</h2>
        <div className="inqTools">
          <button type="button" className="inqReload" onClick={reload}>
            새로고침{loading ? "..." : ""}
          </button>
        </div>

        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>문의 유형</th>
                <th>제목</th>
                <th style={{ width: 120 }}>상태</th>
                <th style={{ width: 120 }}>작성일</th>
              </tr>
            </thead>
            <tbody>
              {myItems.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ color: "#6b7280", padding: 18 }}>
                    아직 등록된 문의가 없습니다.
                  </td>
                </tr>
              ) : (
                myItems.map((x) => (
                  <tr key={x.id}>
                    <td><b>{x.category}</b></td>
                    <td style={{ fontWeight: 800 }}>{x.title}</td>
                    <td>
                      <span className={`badge ${x.status === "답변 완료" ? "ok" : "warn"}`}>
                        {x.status}
                      </span>
                    </td>
                    <td>{x.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="btnRowRight">
          <button className="btnDark" onClick={() => navigate("/inquiries/new")} type="button">
            문의하기
          </button>
        </div>
      </section>
    </div>
  );
}
