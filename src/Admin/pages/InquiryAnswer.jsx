import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./InquiryAnswer.css";

export default function InquiryAnswer() {
  const nav = useNavigate();
  const { id } = useParams();

  // ✅ 더미 데이터 (나중에 API로 교체)
  const inquiry = useMemo(() => {
    return {
      id,
      nickname: "김수호",
      userId: "sooho7",
      phone: "010-1234-5678",
      category: "결제/환불",
      title: "결제 관련해서 문의 드려요.",
      content:
        "베이직 플랜으로 결제했는데, 금액이 두번 결제 됐어요.\n확인 부탁드립니다.",
      fileName: "첨부이미지.png",
    };
  }, [id]);

  const [answer, setAnswer] = useState("");

  const onLogout = () => {
    // ✅ 프로젝트에서 쓰는 관리자 로그인 키에 맞춰 수정 가능
    // 예: localStorage.removeItem("admin");
    localStorage.removeItem("user"); // 혹시 user로 관리자도 저장해놨다면
    localStorage.removeItem("admin"); // admin 키를 쓰는 경우 대비
    nav("/login", { replace: true });
  };

  const onSubmit = () => {
    // ✅ TODO: POST /api/admin/inquiries/{id}/answer
    // body: { answer }
    alert("답변 완료(더미)");
    nav("/admin/inquiries");
  };

  return (
    <div className="adminPage">
      {/* ✅ 상단 흰 헤더(공통 admin.css 사용) */}
      <header className="pageTopbar">
        <div className="pageTopbarInner">
          <h1 className="pageTitle">고객 문의 답변</h1>
          <div className="pageActions">
            <button className="adminLogout" type="button" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="pageBody">
        <div className="pageContainer">
          {/* ✅ 페이지 타이틀/설명 */}
          <div className="admAnsHead">
            <h2 className="admAnsTitle">문의 답변</h2>
            <p className="admAnsSub">
              서비스 이용 중 궁금한 점이나 제안 사항을 남겨주세요. 빠르게 확인 후 답변드릴게요.
            </p>
          </div>

          {/* ✅ 좌/우 2컬럼 */}
          <div className="admAnsGrid">
            {/* 왼쪽: 문의 내용 */}
            <section className="admAnsBox admAnsLeft">
              <div className="admAnsBoxTitle">문의 내용</div>

              <div className="admAnsInfoRow">
                <div className="admAnsLabel">닉네임</div>
                <div className="admAnsValue">{inquiry.nickname}</div>

                <div className="admAnsLabel">아이디</div>
                <div className="admAnsValue">{inquiry.userId}</div>
              </div>

              <div className="admAnsInfoRow">
                <div className="admAnsLabel">연락처</div>
                <div className="admAnsValue">{inquiry.phone}</div>

                <div className="admAnsLabel">문의 유형</div>
                <div className="admAnsValue">{inquiry.category}</div>
              </div>

              <div className="admAnsBlock">
                <div className="admAnsLabel">제목</div>
                <div className="admAnsValue">{inquiry.title}</div>
              </div>

              <div className="admAnsBlock">
                <div className="admAnsLabel">내용</div>
                <div className="admAnsContentBox">
                  {inquiry.content.split("\n").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>

              <div className="admAnsFileRow">
                <div className="admAnsLabel">첨부파일</div>
                <div className="admAnsValue">{inquiry.fileName || "-"}</div>
              </div>
            </section>

            {/* 오른쪽: 답변하기 */}
            <section className="admAnsBox admAnsRight">
              <div className="admAnsBoxTitle">답변하기</div>

              <textarea
                className="admAnsTextarea"
                placeholder="답변 내용을 적어주세요."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <div className="admAnsActions">
                <button
                  type="button"
                  className="admAnsBtn admAnsBtnGhost"
                  onClick={() => nav(-1)}
                >
                  보류
                </button>
                <button
                  type="button"
                  className="admAnsBtn admAnsBtnPrimary"
                  onClick={onSubmit}
                  disabled={!answer.trim()}
                >
                  답변완료
                </button>
              </div>
            </section>
          </div>

          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  );
}
