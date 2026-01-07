import http from "./http";

/**
 * ✅ AUTH 도메인 
 * - BaseURL은 http.js에서 /api 로 잡혀있으므로
 *   여기서는 /auth/... 만 적으면 됨.
 */

// 로그인
export async function login({ user_id, pwd }) {
  const { data } = await http.post("/auth/login", { user_id, pwd });
  return data;
}

// 아이디 중복 체크 (GET은 params 권장)
export async function checkId(user_id) {
  const { data } = await http.get("/auth/checkId", { params: { user_id } });
  return data;
}

// 회원가입
export async function join({ user_id, pwd, name, phone }) {
  const payload = { user_id, pwd, name, phone };
  const { data } = await http.post("/auth/join", payload);
  return data;
}

// 소셜 회원가입
export async function socialJoin({ user_id, name }) {
  const { data } = await http.post("/auth/social-join", { user_id, name });
  return data;
}





// 휴대폰 전송 임시 개발용 더미데이터!!
// 개발 중 임시 mock
export async function phoneSendCode({ phone }) {
  await new Promise((r) => setTimeout(r, 500));
  return { result: true };
}

export async function phoneVerify({ phone, code }) {
  await new Promise((r) => setTimeout(r, 400));
  return { result: code === "1234" }; // 1234만 통과 참고할것!! 현선스!
}






// 검증해봐야되서 일단 아래 코드 블럭처리해놈

// // 전화번호 인증 요청 (인증코드 발송)
// export async function phoneSendCode({ phone }) {
//   const { data } = await http.post("/auth/phone/send-code", { phone });
//   return data;
// }

// // 전화번호 인증 (보통 { phone, code }를 기대)
// // - 문서에는 phone만 적혀있지만, code도 함께 보내도 Spring은 보통 무시/허용됨
// export async function phoneVerify({ phone, code }) {
//   const { data } = await http.post("/auth/phone/verify", { phone, code });
//   return data;
// }








// 아이디 찾기
export async function findId({ phone }) {
  const { data } = await http.post("/auth/find-id", { phone });
  return data;
}

// 비밀번호 재설정 요청(보통 인증번호 발송 트리거)
export async function passwordResetRequest({ user_id, phone }) {
  const { data } = await http.post("/auth/password/reset-request", { user_id, phone });
  return data;
}

// 비밀번호 재설정/변경
export async function passwordReset({ user_id, pwd, newPwd }) {
  const { data } = await http.patch("/auth/password/reset", { user_id, pwd, newPwd });
  return data;
}

// 로그아웃 (GET은 params 권장)
export async function logout(user_id) {
  const { data } = await http.get("/auth/logout", { params: { user_id } });
  return data;
}
