import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { calcVat, formatKRW } from "../../utils/money";
import { createOrder } from "../../api/payment";

const PAY_METHODS = [
  { key: "CARD", label: "신용/체크카드" },
  { key: "KAKAOPAY", label: "카카오페이" },
  { key: "TOSSPAY", label: "토스페이" },
];

function onlyDigits(v) {
  return (v || "").replace(/\D/g, "");
}

function formatCardNumber(v) {
  const d = onlyDigits(v).slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 - ");
}

function formatMMYY(v) {
  const d = onlyDigits(v).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
}

export default function CheckoutPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // ✅ 요금제: pricing에서 state로 전달 or 기본 BASIC
  const plan = state?.plan || { code: "BASIC", name: "Basic", price: 9900 };
  const amount = Number(plan.price || 0);

  const vat = useMemo(() => calcVat(amount, 0.1), [amount]);
  const total = useMemo(() => amount, [amount]); // (스샷처럼 총액=표시가격으로 유지. 필요하면 amount+vat로 바꿔)

  const [payMethod, setPayMethod] = useState("CARD");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ 카드 폼
  const [cardNo, setCardNo] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [installment, setInstallment] = useState("일시불");

  const canPay =
    agree &&
    !submitting &&
    (payMethod !== "CARD" ||
      (onlyDigits(cardNo).length === 16 && onlyDigits(exp).length === 4 && onlyDigits(cvc).length >= 3 && onlyDigits(pwd2).length === 2));

  const onSubmit = async () => {
    setError("");
    if (!agree) return setError("구매 조건 및 결제 진행에 동의해 주세요.");
    if (!canPay) return setError("결제 정보를 확인해 주세요.");

    try {
      setSubmitting(true);

      // ✅ 실무: 서버에 '주문 생성'
      const orderPayload = {
        planCode: plan.code,
        amount: total,
        payMethod,
        buyer: {
          // 로그인 붙이면 여기 user 정보 넣어
          name: "홍길동",
        },
        // 카드결제일 경우, 실무에서는 프론트에서 카드정보를 서버로 직접 보내지 않는 경우가 많음(PG SDK 사용)
        cardPreview:
          payMethod === "CARD"
            ? {
                last4: onlyDigits(cardNo).slice(-4),
                installment,
              }
            : null,
      };

      const res = await createOrder(orderPayload);

      /**
       * ✅ 백에서 받는 값 예시(원하는 형태로 맞추기)
       * res: { result:true, orderId:"...", planName:"Basic", approvedAt:"...", amount:9900 }
       */

      if (res?.result !== true) throw new Error("주문 생성에 실패했습니다.");

      // ✅ 지금은 토큰X 라고 했으니까, 결제 완료 화면으로 이동(데모/프로토타입)
      nav("/checkout/success", {
        replace: true,
        state: {
          planName: res.planName || plan.name || plan.code,
          amount: res.amount ?? total,
          paidAt: res.approvedAt || new Date().toISOString(),
          orderId: res.orderId || res.order_id,
        },
      });
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "결제 요청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="checkoutPage">
      <div className="checkoutContainer">
        <h1 className="checkoutTitle">결제하기</h1>

        <div className="checkoutGrid">
          {/* 좌측: 결제수단/입력 */}
          <section className="payCard">
            <div className="payCardHead">결제 수단</div>

            <div className="payTabs" role="tablist" aria-label="결제수단">
              {PAY_METHODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`payTab ${payMethod === m.key ? "isActive" : ""}`}
                  onClick={() => setPayMethod(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {payMethod === "CARD" ? (
              <div className="payForm">
                <label className="field">
                  <span className="label">카드 번호</span>
                  <div className="inputRow">
                    <input
                      className="input"
                      value={cardNo}
                      onChange={(e) => setCardNo(formatCardNumber(e.target.value))}
                      placeholder="0000 - 0000 - 0000 - 0000"
                      inputMode="numeric"
                    />
                    <span className="cardIcon" aria-hidden="true">💳</span>
                  </div>
                </label>

                <div className="grid2">
                  <label className="field">
                    <span className="label">유효기간 (MM/YY)</span>
                    <input
                      className="input"
                      value={exp}
                      onChange={(e) => setExp(formatMMYY(e.target.value))}
                      placeholder="MM / YY"
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field">
                    <span className="label">CVC (뒷면 3자리)</span>
                    <input
                      className="input"
                      value={cvc}
                      onChange={(e) => setCvc(onlyDigits(e.target.value).slice(0, 3))}
                      placeholder="●●●"
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <label className="field">
                  <span className="label">카드 비밀번호 앞 2자리</span>
                  <input
                    className="input"
                    value={pwd2}
                    onChange={(e) => setPwd2(onlyDigits(e.target.value).slice(0, 2))}
                    placeholder="●●"
                    inputMode="numeric"
                  />
                </label>

                <label className="field">
                  <span className="label">할부 기간</span>
                  <select className="select" value={installment} onChange={(e) => setInstallment(e.target.value)}>
                    <option>일시불</option>
                    <option>2개월</option>
                    <option>3개월</option>
                    <option>6개월</option>
                    <option>12개월</option>
                  </select>
                </label>
              </div>
            ) : (
              <div className="payAlt">
                <div className="payAltTitle">{payMethod === "KAKAOPAY" ? "카카오페이" : "토스페이"}로 결제를 진행합니다.</div>
                <p className="payAltDesc">
                  실무에서는 “결제하기” 클릭 시 백엔드가 PG 결제창(리다이렉트/팝업)을 열 수 있는 값을 내려주고,
                  결제 완료 후 서버에서 검증(confirm)합니다.
                </p>
              </div>
            )}
          </section>

          {/* 우측: 주문내역 */}
          <aside className="orderCard">
            <div className="orderHead">주문 내역</div>

            <div className="orderRow">
              <div className="orderLeft">
                <div className="orderPlan">{plan.name || plan.code}</div>
              </div>
              <div className="orderRight">{formatKRW(amount)}원</div>
            </div>

            <div className="orderDivider" />

            <div className="orderMeta">
              <div className="metaRow">
                <span>상품 금액</span>
                <span>{formatKRW(amount - vat)}원</span>
              </div>
              <div className="metaRow">
                <span>부가세 (VAT 10%)</span>
                <span>+ {formatKRW(vat)}원</span>
              </div>
            </div>

            <div className="orderTotal">
              <span>최종 결제 금액</span>
              <strong>{formatKRW(total)}원</strong>
            </div>

            <label className="agreeRow">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>구매 조건 및 결제 진행에 동의합니다.</span>
            </label>

            {error && <div className="payError">{error}</div>}

            <button className="payBtn" type="button" onClick={onSubmit} disabled={!canPay}>
              {submitting ? "결제 요청 중..." : "결제하기"}
            </button>

            <button className="cancelBtn" type="button" onClick={() => nav(-1)} disabled={submitting}>
              취소
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
