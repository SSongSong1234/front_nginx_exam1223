import AdminPage from "../components/AdminPage";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const nav = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  const stats = [
    { label: "일일 가입자 수", value: "128명", chip: "+12.5%", chipType: "ok" },
    { label: "일일 API 사용량", value: "4,205", sub: "calls", chip: "+5.2%", chipType: "info" },
    { label: "미처리 문의 내역", value: "12건", chip: "주의", chipType: "warn" },
    { label: "오늘 결제 금액", value: "₩850,000" },
  ];

  // ✅ 주간 가입자 추이(라인 차트: recharts 유지)
  const weekly = useMemo(() => ([
    { day: "월", v: 20 },
    { day: "화", v: 45 },
    { day: "수", v: 30 },
    { day: "목", v: 70 },
    { day: "금", v: 55 },
    { day: "토", v: 80 },
    { day: "일", v: 90 },
  ]), []);

  // ✅ Chart.js 막대그래프(이미지 처리 현황) - 더미데이터만 바꾸면 바로 반영
  const barLabels = useMemo(() => ["01.01", "01.02", "01.03", "01.04", "오늘", "01.06", "01.07"], []);
  const barValues  = useMemo(() => [58, 52, 76, 82, 60, 55, 48], []);

  const barData = useMemo(() => ({
    labels: barLabels,
    datasets: [
      {
        label: "이미지 처리 건수",
        data: barValues,
        borderWidth: 1,
        borderRadius: 6,
        /* 색은 너 취향대로 바꿔도 됨 */
        backgroundColor: ["#fca5a5", "#fdba74", "#fcd34d", "#a7f3d0", "#93c5fd", "#c4b5fd", "#e5e7eb"],
      },
    ],
  }), [barLabels, barValues]);

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eef0f2" },
        ticks: { font: { size: 11 } },
      },
    },
  }), []);

  const inquiries = [
    { user: "김민수", title: "결제가 중복으로 되었어요", status: "미처리" },
    { user: "이영희", title: "API 키 발급 문의드립니다", status: "완료" },
    { user: "박지성", title: "이미지 생성이 안됩니다", status: "진행중" },
  ];
  const payments = [
    { plan: "Pro Plan", date: "2025.12.19", amount: "₩29,000" },
    { plan: "Basic Plan", date: "2025.12.19", amount: "₩9,900" },
    { plan: "Pro Plan", date: "2025.12.18", amount: "₩29,000" },
  ];

  const badge = (type) => {
    if (type === "ok") return "badge ok";
    if (type === "warn") return "badge warn";
    if (type === "info") return "badge"; // 기본
    return "badge";
  };

  const inquiryBadge = (s) => {
    if (s === "미처리") return "badge danger";
    if (s === "진행중") return "badge warn";
    return "badge ok";
  };

  return (
    <AdminPage
      title="대시보드 개요"
      right={<button className="adminLogout" onClick={onLogout}>로그아웃</button>}
    >
      {/* ✅ 상단 카드 4개 */}
      <section className="dashGrid">
        {stats.map((x) => (
          <div key={x.label} className="panel dashCard">
            <div className="dashLabel">{x.label}</div>
            <div className="dashValueRow">
              <div className="dashValue">
                {x.value} {x.sub && <span className="dashSub">{x.sub}</span>}
              </div>
              {x.chip && <span className={badge(x.chipType)}>{x.chip}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* ✅ 차트 2개 */}
      <section className="dashCharts">
        {/* ✅ 막대 그래프(Chart.js) */}
        <div className="panel">
          <div className="panelTitle">이미지 처리 현황</div>
          <div style={{ height: 240 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* ✅ 라인 차트(recharts 유지) */}
        <div className="panel">
          <div className="panelTitle">주간 가입자 추이</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="v" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ✅ 최근 문의 + 최근 결제 (버튼 추가) */}
      <section className="dashBottom">
        <div className="panel">
          <div className="panelHeaderRow" style={{ justifyContent: "space-between" }}>
            <div className="panelTitle" style={{ marginBottom: 0 }}>최근 문의 내역</div>
            <button className="btnGhost" onClick={() => nav("/admin/inquiries")}>
              문의 관리로 가기
            </button>
          </div>

          <div style={{ height: 10 }} />

          <table className="table">
            <thead>
              <tr>
                <th>사용자</th>
                <th>제목</th>
                <th style={{ width: 90 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((x, i) => (
                <tr key={i}>
                  <td>{x.user}</td>
                  <td style={{ fontWeight: 800 }}>{x.title}</td>
                  <td><span className={inquiryBadge(x.status)}>{x.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panelHeaderRow" style={{ justifyContent: "space-between" }}>
            <div className="panelTitle" style={{ marginBottom: 0 }}>최근 결제 내역</div>
            <button className="btnGhost" onClick={() => nav("/admin/payments")}>
              결제 관리로 가기
            </button>
          </div>

          <div style={{ height: 10 }} />

          <table className="table">
            <thead>
              <tr>
                <th>플랜</th>
                <th>날짜</th>
                <th style={{ textAlign: "right" }}>금액</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((x, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 800 }}>{x.plan}</td>
                  <td>{x.date}</td>
                  <td style={{ textAlign: "right", fontWeight: 900 }}>{x.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminPage>
  );
}
