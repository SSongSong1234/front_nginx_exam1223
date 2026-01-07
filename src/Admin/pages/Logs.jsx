import { useState } from "react";
import AdminPage from "../components/AdminPage";
import PanelHeader from "../components/PanelHeader";
import Pagination from "../components/Pagination";

export default function Logs() {
  const [page, setPage] = useState(1);

  const onLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ✅ 예시 로그 데이터
  const rows = [
    { t:"2025-12-19 14:23:01", id:"tx_8293102a", ep:"/api/v1/ai/generate", m:"POST", s:500, l:"4,520ms", msg:"Python Server Timeout (Connection Refused)" },
    { t:"2025-12-19 14:22:58", id:"tx_8293099b", ep:"/api/v1/auth/login", m:"POST", s:200, l:"45ms", msg:"Login Success" },
    { t:"2025-12-19 14:21:12", id:"tx_8293088c", ep:"/api/v1/ai/face-swap", m:"POST", s:200, l:"2,100ms", msg:"Process Complete" },
    { t:"2025-12-19 14:15:45", id:"tx_8293055d", ep:"/api/v1/upload", m:"POST", s:413, l:"120ms", msg:"Payload Too Large (image > 10MB)" },
    { t:"2025-12-19 14:10:01", id:"tx_8293011e", ep:"/api/v1/payment/verify", m:"GET",  s:200, l:"230ms", msg:"Verification Success" },
  ];

  const badgeClass = (code) => (code >= 500 ? "danger" : code >= 400 ? "warn" : "ok");

  return (
    <AdminPage
      title="API 및 시스템 로그"
      right={<button className="adminLogout" onClick={onLogout}>로그아웃</button>}
    >
      {/* ✅ 위 흰색 필터 바 */}
      <PanelHeader>
        <div className="panelHeaderRow">
          <input className="input" placeholder="ID 검색 (Transaction, User)" />
          <input className="input" placeholder="2025.12.19 - 2025.12.19" />
          <select className="select"><option>전체 상태</option><option>200</option><option>413</option><option>500</option></select>
          <select className="select"><option>전체 API</option><option>AI</option><option>AUTH</option><option>PAY</option></select>
          <button className="searchBtn">검색</button>
        </div>
      </PanelHeader>

      {/* ✅ 테이블 카드 */}
      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th style={{width:180}}>타임스탬프</th>
              <th style={{width:140}}>Transaction ID</th>
              <th>API Endpoint</th>
              <th style={{width:90}}>Method</th>
              <th style={{width:90}}>상태</th>
              <th style={{width:110}}>Latency</th>
              <th>메시지</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.t}</td>
                <td>{r.id}</td>
                <td style={{fontWeight:900}}>{r.ep}</td>
                <td>{r.m}</td>
                <td><span className={`badge ${badgeClass(r.s)}`}>{r.s}</span></td>
                <td style={{fontWeight:900, color: r.s >= 400 ? "#b91c1c" : "#111"}}>{r.l}</td>
                <td style={{color: r.s >= 500 ? "#b91c1c" : r.s >= 400 ? "#c2410c" : "#6b7280", fontWeight: r.s >= 400 ? 900 : 600}}>
                  {r.msg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ 7번째 사진 느낌의 마무리 */}
        <Pagination page={page} totalPages={3} onChange={setPage} />
      </section>
    </AdminPage>
  );
}
