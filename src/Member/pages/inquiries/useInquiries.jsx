import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth.jsx";
import * as inqApi from "../../../api/inquery";

/**
 * ✅ 문의 데이터: 백엔드 연동 버전
 * - 목록: GET /api/inquery/list?user_id=
 * - 작성: POST /api/inquery/write (multipart)
 */
export default function useInquiries() {
  const { user } = useAuth();
  const userId = user?.user_id || user?.username;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await inqApi.listInqueries(userId);

      // 백엔드 응답이 {result:true, list:[...]} / 혹은 [... ] 등 다양한 형태일 수 있어서 안전 처리
      const list = Array.isArray(data) ? data : (data?.list || data?.items || []);
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      const res = await inqApi.writeInquery({ ...payload, user_id: userId });
      await load(); // 작성 후 목록 갱신
      return res;
    },
    [userId, load]
  );

  return { items, loading, reload: load, create };
}
