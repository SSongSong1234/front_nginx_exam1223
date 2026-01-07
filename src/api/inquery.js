import http from "./http";

/**
 * ⚠️ 주의: 현재 백엔드 스펙이 inquery / inqueries / inquiry 등으로 흔들릴 수 있어요.
 * 너가 받은 표 기준으로 "inquery" 를 그대로 사용합니다.
 */

export async function listInqueries(user_id) {
  const { data } = await http.get("/inquery/list", { params: { user_id } });
  return data;
}

export async function getInqueryDetail(inq_id, user_id) {
  const { data } = await http.get(`/inquery/${inq_id}`, { params: { user_id } });
  return data;
}

/**
 * 문의 작성 (multipart)
 * payload 예:
 * {
 *  user_id, nickname, phone, title, category, content,
 *  images: File[] (선택)
 * }
 */
export async function writeInquery(payload) {
  const fd = new FormData();

  // text fields
  fd.append("user_id", payload.user_id);
  if (payload.nickname) fd.append("nickname", payload.nickname);
  if (payload.phone) fd.append("phone", payload.phone);
  if (payload.title) fd.append("title", payload.title);
  if (payload.category) fd.append("category", payload.category);
  if (payload.content) fd.append("content", payload.content);

  // files
  const images = payload.images || [];
  images.forEach((file) => fd.append("images", file));

  const { data } = await http.post("/inquery/write", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
