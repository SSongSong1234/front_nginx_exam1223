// (페이지 공통 틀)
/**
 * ✅ AdminPage = "페이지 공통 틀"
 * - 상단 흰 헤더(제목 + 우측 액션/로그아웃) + 하단 border
 * - 가운데 컨테이너(6번째 사진 같은 틀)
 */
export default function AdminPage({ title, right, children }) {
  return (
    <div className="adminPage">
      {/* ✅ 페이지 상단 흰 헤더(제목/로그아웃) */}
      <header className="pageTopbar">
        <div className="pageTopbarInner">
          <h1 className="pageTitle">{title}</h1>
          <div className="pageActions">{right}</div>
        </div>
      </header>

      {/* ✅ 중앙 컨테이너(카드들이 들어갈 영역) */}
      <div className="pageBody">
        <div className="pageContainer">{children}</div>
      </div>
    </div>
  );
}
