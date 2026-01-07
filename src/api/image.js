import http from "./http";

export async function aiCorrect({ user_id, img_file }) {
  const fd = new FormData();
  fd.append("user_id", user_id);
  fd.append("img_file", img_file);

  const { data } = await http.post("/image/ai", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function applyCorrect(payload) {
  // payload: { user_id, img_file, mask_info, smoothing_level, tone_level, ... }
  const fd = new FormData();
  fd.append("user_id", payload.user_id);
  if (payload.img_file) fd.append("img_file", payload.img_file);
  if (payload.mask_info) fd.append("mask_info", JSON.stringify(payload.mask_info));

  // 백엔드 스펙이 'smooting-level' 같이 하이픈이면
  // FormData key도 동일하게 맞춰야 해요.
  if (payload["smooting-level"] != null) fd.append("smooting-level", String(payload["smooting-level"]));
  if (payload["tone-level"] != null) fd.append("tone-level", String(payload["tone-level"]));

  const { data } = await http.post("/image/correct", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
