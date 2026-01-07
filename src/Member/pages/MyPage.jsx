import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import arrowImg from "../assets/arrow.png";
import { useAuth } from "../../contexts/auth.jsx";

export default function MyPage() {
  const navigate = useNavigate();
  const { user, refreshMe } = useAuth();
  const [loading, setLoading] = useState(false);

  // ✅ 필요하면 페이지 진입 시 최신 정보 한번 갱신
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refreshMe();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 화면 표시용(백엔드 응답 스펙이 아직 불확실해서 안전하게)
  const view = useMemo(() => {
    const base = {
      username: user?.username || user?.user_id || "-",
      plan: user?.plan || "FREE",
      nickname: user?.nickname || user?.name || "-",
      phoneMasked: user?.phone
        ? String(user.phone).replace(/(\d{3})\d{4}(\d{4})/, "$1-****-$2")
        : "-",
      joinedAt: user?.joinedAt || "-",
      pwUpdatedAt: user?.pwUpdatedAt || "-",
    };
    return base;
  }, [user]);

  return (
    <div className="myPage">
      <div className="myHead">
        <button className="myBack" onClick={() => navigate(-1)} type="button">
          <img className="myBackImg" src={arrowImg} alt="" />
        </button>
        <h1 className="myTitle">계정정보</h1>
      </div>

      <section className="myCard">
        <h2 className="myCardTitle">프로필 {loading ? "(불러오는 중...)" : ""}</h2>

        <div className="myTable">
          <div className="myTr">
            <div className="myTh">ID</div>
            <div className="myTd">{view.username}</div>
            <div className="myAction" />
          </div>

          <div className="myTr">
            <div className="myTh">등급</div>
            <div className="myTd">{view.plan}</div>
            <div className="myAction" />
          </div>

          <div className="myTr">
            <div className="myTh">닉네임</div>
            <div className="myTd">{view.nickname}</div>
            <div className="myAction">
              <button className="myBtn" onClick={() => navigate("/account/nickname")} type="button">
                변경 &gt;
              </button>
            </div>
          </div>

          <div className="myTr">
            <div className="myTh">휴대폰</div>
            <div className="myTd">{view.phoneMasked}</div>
            <div className="myAction" />
          </div>

          <div className="myTr">
            <div className="myTh">가입일</div>
            <div className="myTd">{view.joinedAt}</div>
            <div className="myAction" />
          </div>

          <div className="myTr">
            <div className="myTh">비밀번호 변경</div>
            <div className="myTd">{view.pwUpdatedAt}</div>
            <div className="myAction">
              <button className="myBtn" onClick={() => navigate("/account/password")} type="button">
                변경 &gt;
              </button>
            </div>
          </div>

          <div className="myTr">
            <div className="myTh">회원탈퇴</div>
            <div className="myTd">서비스 이용을 중단합니다</div>
            <div className="myAction">
              <button className="myBtn danger" onClick={() => navigate("/account/withdraw")} type="button">
                진행 &gt;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
