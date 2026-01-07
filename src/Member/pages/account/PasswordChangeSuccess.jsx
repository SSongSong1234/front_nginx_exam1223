import { useNavigate } from "react-router-dom";
import "./PasswordChangeSuccess.css";

export default function PasswordChangeSuccess() {
  const navigate = useNavigate();

  return (
      <main className="pwSuccessWrap">
        <section className="pwSuccessBox">
          <h1 className="pwSuccessTitle">비밀번호 변경 완료</h1>
          <p className="pwSuccessDesc">
            비밀번호 변경이 완료되었습니다. 다시 로그인해 주세요.
          </p>

          <button
            type="button"
            className="pwSuccessBtn"
            onClick={() => navigate("/login")}
          >
            메인페이지로 돌아가기
          </button>
        </section>
      </main>
  );
}
