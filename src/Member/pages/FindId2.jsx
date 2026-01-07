import { useLocation, useNavigate } from "react-router-dom";
import "./FindId2.css";

export default function FindId2() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FindId에서 넘겨준 데이터 받기
  const userId = location.state?.userId || "gildong1234";
  const joinedAt = location.state?.joinedAt || "2023. 10. 24";

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      alert("아이디가 복사되었습니다!");
    } catch {
      alert("복사에 실패했습니다. 아이디를 직접 선택해 복사해 주세요.");
    }
  };

  return (
    <>
      <div className="findDonePage">
        <section className="findDoneCard">
          <div className="checkCircle">✓</div>

          <h1 className="doneTitle">아이디 찾기 완료</h1>
          <p className="doneSub">회원님의 정보와 일치하는 아이디입니다.</p>

          <div className="idBox">
            <span className="idText">{userId}</span>
            <button type="button" className="copyBtn" onClick={copyId}>
              복사
            </button>
          </div>

          <p className="joinDate">가입일: {joinedAt}</p>

          <button className="primaryBtn" type="button" onClick={() => navigate("/login")}>
            로그인하러 가기
          </button>

          <button className="ghostBtn" type="button" onClick={() => navigate("/findpw")}>
            비밀번호 찾기
          </button>
        </section>
      </div>
    </>
  );
}
