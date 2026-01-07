import { useState } from "react";
import AdminPage from "../components/AdminPage";
import PanelHeader from "../components/PanelHeader";
import Pagination from "../components/Pagination";

export default function Payments() {
  const [page, setPage] = useState(1);

  const onLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const summary = [
    { label: "이번 달 총 매출", value: "₩12,500,000", chip: "+8.2%", chipType: "ok" },
    { label: "결제 완료 건수", value: "432건", chip: "+12건", chipType: "info" },
    { label: "환불 금액 (환불율 3.2%)", value: "-₩450,000", chipType: "danger" },
  ];

  const rows = [
    { no:"PAY-20251219-001", user:"John Doe", uid:"user_123", plan:"Pro Plan", price:"₩29,000", method:"신용카드", time:"2025.12.19 14:23:01", status:"결제완료" },
    { no:"PAY-20251219-002", user:"김철수", uid:"user_456", plan:"Basic Plan", price:"₩9,900", method:"카카오페이", time:"2025.12.19 13:10:45", status:"결제완료" },
    { no:"PAY-20251218-009", user:"이영희", uid:"user_789", plan:"Pro Plan", price:"₩29,000", method:"신용카드", time:"2025.12.18 09:15:02", status:"환불완료" },
    { no:"PAY-20251219-XXX", user:"박지민", uid:"user_000", plan:"Enterprise", price:"₩150,000", method:"법인카드", time:"2025.12.19 15:00:22", status:"결제실패" },
  ];

  const statusBadge = (s) => {
    if (s === "결제완료") return "badge ok";
    if (s === "환불완료") return "badge warn";
    return "badge danger";
  };

  return (
    <AdminPage
      title="결제 내역 및 매출 관리"
      right={<button className="adminLogout" onClick={onLogout}>로그아웃</button>}
    >
      {/* 요약 카드 */}
      <section className="dashGrid">
        {summary.map((x) => (
          <div className="panel dashCard" key={x.label}>
            <div className="dashLabel">{x.label}</div>
            <div className="dashValueRow">
              <div className="dashValue">{x.value}</div>
              {x.chip && <span className="badge ok">{x.chip}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* 필터 바 */}
      <PanelHeader>
        <div className="panelHeaderRow">
          <input className="input" placeholder="주문번호 또는 사용자명 검색" />
          <input className="input" placeholder="2025.12.01 - 2025.12.19" />
          <select className="select"><option>전체 상태</option><option>결제완료</option><option>환불완료</option><option>결제실패</option></select>
          <button className="btnGhost" style={{ marginLeft: "auto" }}>엑셀 내보내기</button>
        </div>
      </PanelHeader>

      {/* 테이블 */}
      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>사용자</th>
              <th>상품명</th>
              <th>결제 금액</th>
              <th>결제 수단</th>
              <th>일시</th>
              <th style={{ width: 90 }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.no}>
                <td style={{ fontWeight: 900, color: r.no.includes("XXX") ? "#b91c1c" : "#111" }}>{r.no}</td>
                <td>
                  <div style={{ fontWeight: 900 }}>{r.user}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{r.uid}</div>
                </td>
                <td><span className="badge">{r.plan}</span></td>
                <td style={{ fontWeight: 900, color: r.no.includes("XXX") ? "#b91c1c" : "#111" }}>{r.price}</td>
                <td>{r.method}</td>
                <td style={{ color: "#6b7280", fontSize: 12 }}>{r.time}</td>
                <td><span className={statusBadge(r.status)}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} totalPages={3} onChange={setPage} />
      </section>
    </AdminPage>
  );
}
