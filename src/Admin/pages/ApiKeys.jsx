import { useState } from "react";
import AdminPage from "../components/AdminPage";
import PanelHeader from "../components/PanelHeader";
import Pagination from "../components/Pagination";

function UsageBar({ used, limit }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
        <b style={{ color: "#111" }}>{used.toLocaleString()}</b> / {limit.toLocaleString()}
      </div>
      <div style={{ height: 8, background: "#eef2f7", borderRadius: 999 }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: pct >= 100 ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#22c55e",
          }}
        />
      </div>
    </div>
  );
}

export default function ApiKeys() {
  const [page, setPage] = useState(1);

  const onLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const rows = [
    { key:"sk_live_51Mz...a8K2", owner:"박지민", org:"WED:IT Studio", used:8420, limit:10000, plan:"Enterprise", last:"1분 전", status:"활성" },
    { key:"sk_live_29Xy...b9L1", owner:"John Doe", org:"Personal", used:1500, limit:5000, plan:"Pro", last:"2시간 전", status:"활성" },
    { key:"sk_test_09Qz...k0P3", owner:"이영희", org:"Student", used:0, limit:1000, plan:"Basic", last:"30일 전", status:"만료" },
    { key:"sk_live_11Ab...x9X9", owner:"Abuser01", org:"Unknown", used:15420, limit:5000, plan:"Pro", last:"1일 전", status:"정지" },
  ];

  const badge = (s) => {
    if (s === "활성") return "badge ok";
    if (s === "만료") return "badge warn";
    return "badge danger";
  };

  return (
    <AdminPage
      title="API 키 관리"
      right={<button className="adminLogout" onClick={onLogout}>로그아웃</button>}
    >
      <PanelHeader>
        <div className="panelHeaderRow">
          <input className="input" placeholder="API Key 또는 소유자 검색" />
          <select className="select"><option>전체 플랜</option></select>
          <select className="select"><option>활성 상태</option></select>
          <button className="adminLogout" style={{ marginLeft: "auto" }}>+ 키 발급</button>
        </div>
      </PanelHeader>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>API Key</th>
              <th>소유자</th>
              <th style={{ width: 240 }}>이번 달 사용량(Usage)</th>
              <th style={{ width: 120 }}>플랜</th>
              <th style={{ width: 120 }}>최근 사용</th>
              <th style={{ width: 90 }}>상태</th>
              <th style={{ width: 70 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td style={{ fontWeight: 900, color: r.status === "정지" ? "#b91c1c" : "#111" }}>{r.key}</td>
                <td>
                  <div style={{ fontWeight: 900 }}>{r.owner}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>{r.org}</div>
                </td>
                <td><UsageBar used={r.used} limit={r.limit} /></td>
                <td><span className="badge">{r.plan}</span></td>
                <td style={{ color: "#6b7280", fontSize: 12 }}>{r.last}</td>
                <td><span className={badge(r.status)}>{r.status}</span></td>
                <td>⋯</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} totalPages={3} onChange={setPage} />
      </section>
    </AdminPage>
  );
}
