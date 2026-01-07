import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inquiries.css";

export default function Inquiries() {
  const nav = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    nav("/login", { replace: true });
  };

  // ✅ 더미 목록 (나중에 API로 대체)
  const allRows = useMemo(
    () => [
      {
        id: 1245,
        category: "결제/환불",
        title: "결제했는데 포인트가 안 들어옵니다 (확인부탁)",
        author: "김철수 (User)",
        createdAt: "2025.12.19 14:20",
        status: "미답변",
      },
      {
        id: 1244,
        category: "기술지원",
        title: "얼굴 합성 시 특정 해상도에서 깨짐 현상 발생",
        author: "박지민 (Ent)",
        createdAt: "2025.12.19 11:05",
        status: "처리중",
      },
      {
        id: 1243,
        category: "계정관리",
        title: "비밀번호 변경 메일이 오지 않아요",
        author: "이영희 (User)",
        createdAt: "2025.12.18 16:30",
        status: "답변완료",
      },
      {
        id: 1242,
        category: "제휴문의",
        title: "기업용 요금제 대량 구매 관련 문의드립니다",
        author: "최담당 (Biz)",
        createdAt: "2025.12.18 14:00",
        status: "미답변",
      },
    ],
    []
  );

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체");
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  const filtered = useMemo(() => {
    return allRows
      .filter((r) => {
        if (onlyUnanswered && r.status !== "미답변") return false;
        if (cat !== "전체" && r.category !== cat) return false;
        if (!q.trim()) return true;
        const s = q.trim().toLowerCase();
        return (
          String(r.id).includes(s) ||
          r.title.toLowerCase().includes(s) ||
          r.author.toLowerCase().includes(s)
        );
      })
      .slice(0, 10);
  }, [allRows, q, cat, onlyUnanswered]);

  // ✅ 상단 카드 수치
  const stats = useMemo(() => {
    const todayNew = 24; // 더미
    const inProgress = allRows.filter((r) => r.status === "처리중").length;
    const avgTime = "1.5시간"; // 더미
    return { todayNew, inProgress, avgTime };
  }, [allRows]);

  const badgeClass = (status) => {
    if (status === "답변완료") return "badge ok";
    if (status === "처리중") return "badge warn";
    return "badge danger"; // 미답변
  };

  const goDetail = (id) => nav(`/admin/inquiries/${id}`);
  const goAnswer = (id) => nav(`/admin/inquiries/${id}/answer`);

  return (
    <div className="adminPage">
      {/* 상단 흰 헤더(공통 admin.css) */}
      <header className="pageTopbar">
        <div className="pageTopbarInner">
          <h1 className="pageTitle">고객 문의 및 이슈 관리</h1>
          <div className="pageActions">
            <button className="adminLogout" type="button" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="pageBody">
        <div className="pageContainer">
          {/* 상단 카드 3개 */}
          <div className="inqStatGrid">
            <div className="inqStatCard">
              <div className="inqStatLabel">신규 문의 (오늘)</div>
              <div className="inqStatValue">{stats.todayNew}건</div>
              <span className="inqDot red" />
            </div>

            <div className="inqStatCard">
              <div className="inqStatLabel">처리 중</div>
              <div className="inqStatValue">{stats.inProgress}건</div>
              <span className="inqDot amber" />
            </div>

            <div className="inqStatCard">
              <div className="inqStatLabel">평균 응답 시간</div>
              <div className="inqStatValue">{stats.avgTime}</div>
            </div>
          </div>

          {/* 검색/필터 패널 */}
          <section className="panel inqFilterPanel">
            <div className="inqFilterStack">
              <input
                className="input inqSearch"
                placeholder="제목, 내용 또는 작성자 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <select
                className="select inqSelect"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                <option value="전체">전체 카테고리</option>
                <option value="결제/환불">결제/환불</option>
                <option value="기술지원">기술지원</option>
                <option value="계정관리">계정관리</option>
                <option value="제휴문의">제휴문의</option>
              </select>

              <select
                className="select inqSelect"
                value={onlyUnanswered ? "미답변만" : "전체"}
                onChange={(e) => setOnlyUnanswered(e.target.value === "미답변만")}
              >
                <option value="전체">전체 보기</option>
                <option value="미답변만">미답변만 보기</option>
              </select>
            </div>
          </section>

          {/* 테이블 패널 */}
          <section className="panel">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>번호</th>
                  <th style={{ width: 120 }}>카테고리</th>
                  <th>제목</th>
                  <th style={{ width: 140 }}>작성자</th>
                  <th style={{ width: 150 }}>등록일시</th>
                  <th style={{ width: 90 }}>상태</th>
                  <th style={{ width: 120 }}>관리</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      <span className="inqCatPill">{r.category}</span>
                    </td>
                    <td className="inqTitleCell">{r.title}</td>
                    <td>{r.author}</td>
                    <td className="inqDate">{r.createdAt}</td>
                    <td>
                      <span className={badgeClass(r.status)}>{r.status}</span>
                    </td>
                    <td>
                      {r.status === "미답변" ? (
                        <button
                          type="button"
                          className="inqBtnPrimary"
                          onClick={() => goAnswer(r.id)}
                        >
                          답변하기
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inqBtnGhost"
                          onClick={() => goDetail(r.id)}
                        >
                          상세보기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="inqEmpty">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 페이지네이션(더미) */}
            <div className="pagination">
              <button className="pageBtn" type="button">
                &lt;
              </button>
              <button className="pageBtn active" type="button">
                1
              </button>
              <button className="pageBtn" type="button">
                2
              </button>
              <button className="pageBtn" type="button">
                3
              </button>
              <button className="pageBtn" type="button">
                &gt;
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
