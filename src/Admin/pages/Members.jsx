import { useState } from "react";
import AdminPage from "../components/AdminPage";
import PanelHeader from "../components/PanelHeader";
import Pagination from "../components/Pagination";

export default function Members() {
  const [page, setPage] = useState(1);

  const onLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AdminPage
      title="전체 회원 관리"
      right={<button className="adminLogout" onClick={onLogout}>로그아웃</button>}
    >
      <PanelHeader>
        <div className="panelHeaderRow">
          <input className="input" placeholder="이름, 이메일 또는 전화번호 검색" />
          <select className="select"><option>전체 등급</option></select>
          <select className="select"><option>전체 상태</option></select>

          <div style={{ marginLeft: "auto", display:"flex", gap:10 }}>
            <button className="btnGhost">엑셀 다운로드</button>
            <button className="adminLogout">+ 회원 등록</button>
          </div>
        </div>
      </PanelHeader>

      <section className="panel">
        {/* 테이블/리스트는 너가 기존 Members 테이블 넣으면 됨 */}
        <div style={{ color:"#6b7280", fontWeight:700 }}>여기에 회원 테이블 렌더링</div>

        <Pagination page={page} totalPages={3} onChange={setPage} />
      </section>
    </AdminPage>
  );
}
