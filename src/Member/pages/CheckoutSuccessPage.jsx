import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutSuccessPage.css";
import { formatKRW } from "../../utils/money";

export default function CheckoutSuccessPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  const planName = state?.planName || "Basic";
  const amount = state?.amount ?? 9900;
  const paidAt = state?.paidAt ? new Date(state.paidAt) : new Date();
  const orderId = state?.orderId || "-";

  const dateStr = `${paidAt.getFullYear()}.${String(paidAt.getMonth() + 1).padStart(2, "0")}.${String(
    paidAt.getDate()
  ).padStart(2, "0")} ${String(paidAt.getHours()).padStart(2, "0")}:${String(paidAt.getMinutes()).padStart(2, "0")}`;

  return (
    <main className="successPage">
      <div className="successWrap">
        <div className="successIcon" aria-hidden="true">✓</div>

        <h1 className="successTitle">결제가 완료되었습니다!</h1>
        <p className="successSub">WED:IT 서비스를 이용해 주셔서 감사합니다.</p>

        <div className="receiptCard">
          <div className="receiptRow">
            <span>상품명</span>
            <strong>{planName}</strong>
          </div>
          <div className="receiptRow">
            <span>결제 일시</span>
            <strong>{dateStr}</strong>
          </div>
          <div className="receiptRow">
            <span>결제 금액</span>
            <strong>{formatKRW(amount)}원</strong>
          </div>
          <div className="receiptRow">
            <span>주문번호</span>
            <strong>{orderId}</strong>
          </div>
        </div>

        <button className="successBtn" type="button" onClick={() => nav("/mypage")}>
          사진 업로드하러 가기
        </button>

        <button className="ghostBtn" type="button" onClick={() => nav("/")}>
          홈으로 이동
        </button>
      </div>
    </main>
  );
}
