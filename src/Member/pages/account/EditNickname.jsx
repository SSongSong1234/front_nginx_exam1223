import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as usersApi from "../../../api/users";
import { useAuth } from "../../../contexts/auth";
import "./EditNickname.css";

export default function EditNickname() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNickname(user?.nickname || user?.name || user?.username || "");
  }, [user]);

  const onSave = async () => {
    setError("");

    const userId = user?.user_id || user?.username;
    if (!userId) {
      nav("/login", { replace: true, state: { reset: true } });
      return;
    }

    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ 백엔드 스펙: PATCH /api/users/update-name
      // body: { user_id, name }
      const res = await usersApi.updateName({ user_id: userId, name: nickname.trim() });

      if (res?.result === false) {
        throw new Error(res?.message || "닉네임 변경에 실패했습니다.");
      }

      const nextUser = { ...user, nickname: nickname.trim(), name: nickname.trim() };
      setUser(nextUser);

      alert("닉네임이 변경되었습니다.");
      nav("/mypage");
    } catch (e) {
      setError(e?.friendlyMessage || e?.message || "닉네임 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nickPage">
      <div className="nickInner">
        <h1 className="nickTitle">닉네임 변경</h1>
        <p className="nickSub">닉네임을 변경하면 화면에 표시되는 이름이 바뀝니다.</p>

        {error && <div className="nickError">{error}</div>}

        <div className="nickForm">
          <label className="nickLabel">닉네임</label>
          <input
            className="nickInput"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            disabled={loading}
          />

          <div className="nickBtnRow">
            <button className="nickBtn" type="button" onClick={() => nav(-1)} disabled={loading}>
              취소
            </button>
            <button className="nickBtn nickBtnDark" type="button" onClick={onSave} disabled={loading}>
              {loading ? "저장 중..." : "변경 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
