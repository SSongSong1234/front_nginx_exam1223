import http from "./http";

/**
 * ✅ 실무형 결제 흐름(권장)
 * 1) 주문 생성: POST /payments/orders
 * 2) 결제 요청(선택): PG에 넘길 값 받기 (redirect url 등)
 * 3) 결제 확정(검증): POST /payments/confirm  (서버가 PG에 검증)
 *
 * ※ 엔드포인트는 너 백엔드에 맞게 바꾸면 됨.
 */

export async function createOrder(payload) {
  // payload: { planCode, amount, buyer, payMethod }
  const { data } = await http.post("/payments/orders", payload);
  return data;
}

export async function confirmPayment(payload) {
  // payload: { orderId, paymentKey, amount } (또는 pg사 토큰)
  const { data } = await http.post("/payments/confirm", payload);
  return data;
}

export async function fetchOrder(orderId) {
  const { data } = await http.get(`/payments/orders/${orderId}`);
  return data;
}
