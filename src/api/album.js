import http from "./http";

export async function listAlbum(user_id) {
  const { data } = await http.get("/album/list", { params: { user_id } });
  return data;
}

/**
 * ✅ 최근 작업 목록(보정 페이지 좌측)
 * - 백엔드에서 제공하는 경우에만 사용
 * - 반환 형식은 백엔드마다 다를 수 있어서, 프론트에서 안전하게 매핑해서 씁니다.
 */
export async function listRecent(user_id, limit = 10) {
  const { data } = await http.get("/album/recent", { params: { user_id, limit } });
  return data;
}

/**
 * ✅ 내 앨범 저장
 * - (권장) 백엔드에서 "원본 + 파라미터"로 재처리하여 저장하거나
 * - 이미 생성된 after_url/after_key 를 받아서 저장할 수 있습니다.
 *
 * payload 예시:
 * {
 *   user_id,
 *   origin_file,        // File (선택)
 *   before_url,         // string (선택)
 *   after_url,          // string (선택)
 *   edit_params,        // object (선택)
 *   title               // string (선택)
 * }
 */
export async function saveToAlbum(payload) {
  const fd = new FormData();
  fd.append("user_id", payload.user_id);
  if (payload.title) fd.append("title", payload.title);
  if (payload.before_url) fd.append("before_url", payload.before_url);
  if (payload.after_url) fd.append("after_url", payload.after_url);
  if (payload.origin_file) fd.append("origin_file", payload.origin_file);
  if (payload.edit_params) fd.append("edit_params", JSON.stringify(payload.edit_params));

  const { data } = await http.post("/album/save", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * ✅ 즐겨찾기 토글(선택)
 */
export async function toggleFavorite({ user_id, album_id, favorite }) {
  const { data } = await http.post("/album/favorite", { user_id, album_id, favorite });
  return data;
}

/**
 * ✅ 앨범 삭제(선택)
 */
export async function deleteAlbum({ user_id, album_id }) {
  const { data } = await http.delete("/album/delete", { params: { user_id, album_id } });
  return data;
}
