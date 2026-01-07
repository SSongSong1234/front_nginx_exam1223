import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInquiries from "./useInquiries";
import { useAuth } from "../../../contexts/auth.jsx";
import "./InquiryNew.css";

export default function InquiryNew() {
  const nav = useNavigate();
  const { create } = useInquiries();

  // ✅ 로그인 유저 정보
  const { user } = useAuth();
  const me = useMemo(() => {
    return {
      username: user?.username || user?.user_id || "",
      nickname: user?.nickname || user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    };
  }, [user]);

  // ✅ 폼 상태
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [phone, setPhone] = useState(me.phone || "");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");

  const canSubmit = type.trim() && title.trim() && content.trim() && agree;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agree) {
      setError("동의 체크 후 문의를 보낼 수 있어요.");
      return;
    }
    if (!type || !title.trim() || !content.trim()) {
      setError("문의 유형/제목/내용을 모두 입력해 주세요.");
      return;
    }

    try {
      // ✅ 백엔드 스펙: { user_id, nickname, phone, title, category, content, images[] }
      await create({
        nickname: me.nickname,
        phone,
        title: title.trim(),
        category: type,
        content: content.trim(),
        images: file ? [file] : [],
      });

      nav("/inquiries/success", { replace: true });
    } catch (e) {
      setError(e.friendlyMessage || e.message || "문의 등록에 실패했습니다.");
    }
  };

  return (
    <div className="inqNewPage">
      <div className="inqNewWrap">
        {/* 상단 타이틀 */}
        <div className="inqNewHeader">
          <h1 className="inqNewTitle">문의하기</h1>
          <p className="inqNewSub">
            서비스 이용 중 궁금한 점이나 제안 사항을 남겨주세요. 빠르게 확인 후 답변드릴게요.
          </p>
        </div>

        {error && <div className="inqNewError">{error}</div>}

        {/* 본문: 좌/우 2컬럼 */}
        <div className="inqNewGrid">
          {/* 왼쪽: 폼 */}
          <section className="inqNewLeft">
            <div className="inqNewSectionTitle">문의 내용</div>

            {/* 닉네임/아이디 */}
            <div className="inqNewTopInfo">
              <div className="inqNewInfoBox">
                <div className="inqNewInfoLabel">닉네임</div>
                <div className="inqNewInfoValue">{me.nickname}</div>
              </div>

              <div className="inqNewInfoBox">
                <div className="inqNewInfoLabel">아이디</div>
                <div className="inqNewInfoValue">{me.username}</div>
              </div>
            </div>

            <form className="inqNewForm" onSubmit={onSubmit}>
              {/* 문의 유형 */}
              <div className="inqNewField">
                <label className="inqNewLabel">문의 유형</label>
                <select
                  className="inqNewSelect"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">선택</option>
                  <option value="결제/요금">결제/요금</option>
                  <option value="계정/로그인">계정/로그인</option>
                  <option value="보정/결과물">보정/결과물</option>
                  <option value="오류/버그">오류/버그</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              {/* 제목 */}
              <div className="inqNewField">
                <label className="inqNewLabel">제목</label>
                <input
                  className="inqNewInput"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="문의 제목을 입력해 주세요"
                />
              </div>

              {/* 내용 */}
                          <div className="inqNewField">
              <div className="inqNewLabel">연락처(전화번호)</div>
              <input
                className="inqNewInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
              />
            </div>

<div className="inqNewField">
                <label className="inqNewLabel">내용</label>
                <textarea
                  className="inqNewTextarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="문의 내용을 자세히 적어주세요. (재현 방법/스크린샷 설명 포함하면 더 빨라요)"
                />
                <div className="inqNewHint">
                  * 개인정보(주민번호/계좌/카드번호 등)는 입력하지 마세요.
                </div>
              </div>

              {/* 첨부파일 */}
              <div className="inqNewAttachRow">
                <div className="inqNewAttachLabel">첨부파일</div>

                <div className="inqNewAttachRight">
                  <label className="inqNewFileBtn">
                    파일 선택
                    <input
                      type="file"
                      className="inqNewFileInput"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>

                  <div className="inqNewFileName">
                    {file ? file.name : "선택된 파일 없음"}
                  </div>
                </div>
              </div>
            </form>
          </section>

          {/* 오른쪽: 빠른 안내 */}
          <aside className="inqNewRight">
            <div className="inqNewGuideTitle">빠른 안내</div>

            <div className="inqNewGuideBlock">
              <div className="inqNewGuideH">답변은 이메일로 발송됩니다.</div>
              <div className="inqNewGuideP">
                보정 관련 문의는 원본/출력 해상도, 사용 환경 정보를 함께 적어주면 도움이 돼요.
              </div>
            </div>

            <div className="inqNewGuideLine" />

            <div className="inqNewGuideBlock">
              <div className="inqNewGuideH">운영 시간</div>
              <div className="inqNewGuideP">
                평일 10:00~18:00 (점심 12:00~13:00) / 주말·공휴일 휴무
              </div>
            </div>

            <div className="inqNewGuideLine" />

            <div className="inqNewGuideBlock">
              <div className="inqNewGuideH">권장 첨부</div>
              <div className="inqNewGuideP">
                문제 화면 캡처, 브라우저(Chrome/Edge/Safari), 오류 메시지
              </div>
            </div>

            <div className="inqNewGuideLine" />

            <div className="inqNewGuideBlock">
              <div className="inqNewGuideH">긴급 이슈</div>
              <div className="inqNewGuideP">
                결제 오류/로그인 불가 등은 “결제/계정” 유형으로 작성해 주세요.
              </div>
            </div>
          </aside>
        </div>

        {/* 하단 라인 */}
        <div className="inqNewBottomLine" />

        {/* 하단: 동의 + 버튼 */}
        <div className="inqNewBottomRow">
          <label className="inqNewAgree">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              답변이 완료되면 등록된 연락처로 답변 알림을 전송하는데 동의합니다.
            </span>
          </label>

          <button
            className={`inqNewSubmit ${canSubmit ? "on" : "off"}`}
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            문의 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
