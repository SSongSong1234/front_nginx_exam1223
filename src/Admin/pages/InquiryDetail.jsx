import { useParams, useNavigate } from "react-router-dom";
import "../admin.css";

export default function InquiryDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  return (
    <div className="adminPage">
      <header className="pageTopbar">
        <div className="pageTopbarInner">
          <h1 className="pageTitle">문의 상세</h1>
          <div className="pageActions">
            <button className="btnGhost" type="button" onClick={() => nav(-1)}>뒤로</button>
          </div>
        </div>
      </header>

      <div className="pageBody">
        <div className="pageContainer">
          <div className="panel">
            <div style={{ fontWeight: 900, marginBottom: 10 }}>문의 ID: {id}</div>
            <button
              className="adminLogout"
              type="button"
              onClick={() => nav(`/admin/inquiries/${id}/answer`)}
            >
              답변하러 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
