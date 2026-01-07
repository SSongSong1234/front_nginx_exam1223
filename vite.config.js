import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// ✅ React JSX 제대로 인식시키는 설정
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // 개발용 백엔드 주소 (없으면 기본 localhost:8081)
  const API_TARGET = env.VITE_API_TARGET || "http://localhost:8081";

  return {
    plugins: [react()],
    esbuild: {
      loader: "jsx",
      include: [
        /src\/.*\.jsx?$/, // ✅ src 내부 모든 js, jsx 파일
        /src\\.*\.jsx?$/, // ✅ 윈도우 경로 호환
      ],
    },
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
