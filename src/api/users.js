import http from "./http";

/**
 * ✅ USERS 도메인 (백엔드 '아래 표' 기준)
 * - /api/users/*
 */

// 내 정보 조회
// 문서에는 GET인데 body처럼 적혀있어 혼동 가능 → 실무적으로는 query params로 보냄
export async function me(user_id) {
  const { data } = await http.get("/users/me", { params: { user_id } });
  return data;
}

// 내 이름/닉네임 수정
export async function updateName({ user_id, name }) {
  const { data } = await http.patch("/users/update-name", { user_id, name });
  return data;
}

// 회원탈퇴
export async function exit({ user_id, pwd }) {
  const { data } = await http.patch("/users/exit", { user_id, pwd });
  return data;
}

/**
 * ✅ (호환용 별칭)
 * - 기존 코드에서 getInfo 라는 이름을 쓰던 부분을 깨지지 않게 유지
 */
export const getInfo = me;
