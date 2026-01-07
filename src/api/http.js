import axios from "axios";

/**
 * ✅ API baseURL 전략
 * - (권장) 개발: Vite proxy 사용 → baseURL "/api"
 * - 배포: VITE_API_BASE_URL="https://api.xxx.com" 처럼 직접 지정 가능
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // ✅ 세션/쿠키 기반이면 필요 (백엔드 CORS 설정도 필요)
});

// ✅ 에러 메시지 표준화(초보자용: 화면에 뿌리기 쉬움)
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const serverMsg =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      err?.response?.data?.error ||
      null;

    err.friendlyMessage = serverMsg || err.message || "요청에 실패했습니다.";
    return Promise.reject(err);
  }
);

export default http;
