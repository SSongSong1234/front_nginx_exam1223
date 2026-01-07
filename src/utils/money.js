export function formatKRW(value) {
  const n = Number(value || 0);
  return n.toLocaleString("ko-KR");
}

export function calcVat(amount, rate = 0.1) {
  const a = Number(amount || 0);
  return Math.round(a * rate);
}
