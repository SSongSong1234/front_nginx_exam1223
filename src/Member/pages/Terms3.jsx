import { useLocation, useNavigate } from "react-router-dom";
import "./Terms3.css";

export default function Terms3() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 이전 페이지에서 state로 닉네임/아이디를 넘겨주면 여기서 받아서 사용 가능
  // 예: navigate("/terms3", { state: { user: userId } })
  const user = location.state?.user || "User";

  return (
    <>
    <div className="donePage">
      <section className="doneCard">
        <h1 className="doneTitle">회원가입 완료</h1>
        <p className="doneSub">
          <span className="user">{user}</span>님 환영합니다. 로그인을 원하시면 아래 버튼을 눌러주세요.
        </p>

        <button className="doneBtn" onClick={() => navigate("/login")}>
          로그인 하기
        </button>
      </section>
    </div>
    </>
  );
}
