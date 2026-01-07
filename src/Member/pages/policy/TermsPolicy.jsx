import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./TermsPolicy.css";

export default function TermsPolicy() {
  const { pathname } = useLocation();

  // ✅ 탭(실무형: NavLink로 SPA 이동)
  const tabs = useMemo(
    () => [
      { key: "terms", label: "이용약관", to: "/termspolicy" },
    ],[]
  );

  // ✅ 약관 버전
  const versions = useMemo(
    () => [
      { value: "2026-01-01", label: "2026-01-01 (시행)" },
      { value: "2025-12-01", label: "2025-12-01" },
    ],
    []
  );

  const [version, setVersion] = useState(versions[0].value);
  const [showTop, setShowTop] = useState(false);

  // ✅ 스크롤 탑 버튼
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ 이용약관 본문(버전 기반)
  const termsDoc = useMemo(() => {
    const common = {
      serviceName: "WED:IT",
      company: "WED:IT",
      supportEmail: "support@wedit.com",
      storageDays: 7,
      effective: version,
    };

    const body = [
      {
        title: "제1조 (목적)",
        text: `본 약관은 ${common.company}(이하 “회사”)가 제공하는 ${common.serviceName} 서비스(이하 “서비스”)의 이용과 관련하여 회사와 회원 간의 권리·의무 및 책임사항, 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.`,
      },
      {
        title: "제2조 (정의)",
        list: [
          "“서비스”란 회사가 제공하는 AI 기반 사진 보정/생성, 옵션 설정, 결과물 제공, 다운로드, 이용이력 관리 등 관련 제반 기능을 의미합니다.",
          "“회원”이란 본 약관에 동의하고 계정을 생성하여 서비스를 이용하는 자를 의미합니다.",
          "“콘텐츠”란 회원이 업로드한 이미지/사진 및 요청 옵션, 서비스 처리 결과물(보정/생성 이미지)을 의미합니다.",
          "“유료서비스”란 회사가 정한 요금제/결제 조건에 따라 대가를 지급하고 이용하는 서비스(크레딧, 구독 등)를 의미합니다.",
        ],
      },
      {
        title: "제3조 (약관의 효력 및 변경)",
        list: [
          "본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.",
          "회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자, 변경사유, 변경내용을 공지합니다.",
          "회원에게 불리한 변경은 합리적인 기간을 두고 사전 공지하며 필요한 경우 별도 동의를 받을 수 있습니다.",
          "회원이 변경된 약관에 동의하지 않는 경우 이용계약을 해지(회원탈퇴)할 수 있습니다.",
        ],
      },
      {
        title: "제4조 (이용계약의 성립)",
        list: [
          "이용계약은 회원이 약관에 동의하고 가입 신청을 한 후 회사가 이를 승낙함으로써 성립합니다.",
          "회사는 타인 명의 도용, 허위 정보 기재 등 합리적 사유가 있는 경우 승낙을 거절하거나 사후 해지할 수 있습니다.",
        ],
      },
      {
        title: "제5조 (회원정보의 변경 및 관리)",
        list: [
          "회원은 가입정보에 변경이 있는 경우 즉시 수정해야 하며, 미수정으로 발생하는 불이익은 회원 책임입니다.",
          "회원은 계정/비밀번호를 안전하게 관리해야 하며 제3자에게 공유/양도할 수 없습니다.",
        ],
      },
      {
        title: "제6조 (서비스 제공 및 변경/중단)",
        list: [
          "회사는 회원에게 AI 사진 보정 및 관련 기능을 제공합니다.",
          "운영상·기술상 필요에 따라 서비스의 일부/전부를 변경할 수 있으며 사전 공지합니다.",
          "점검, 장애, 트래픽 폭주, 천재지변 등 불가피한 사유가 있는 경우 일시 중단될 수 있습니다.",
        ],
      },
      {
        title: "제7조 (콘텐츠 업로드 및 권리)",
        list: [
          "회원은 업로드 콘텐츠에 대한 적법한 권리(저작권/초상권 등)를 보유하거나 이용허락을 받아야 합니다.",
          "회사는 보정 처리 및 결과 제공을 위해 필요한 범위에서만 콘텐츠를 이용합니다.",
          "권리 침해로 발생한 분쟁/손해는 회원 책임이며, 회사는 법령에 따라 조치할 수 있습니다.",
        ],
      },
      {
        title: "제8조 (보관 및 삭제 정책)",
        list: [
          `업로드 이미지 및 결과물은 결과 제공 후 원칙적으로 ${common.storageDays}일 보관 후 자동 삭제됩니다.`,
          "법령 준수/분쟁 대응/부정 이용 방지 목적의 로그/기록은 필요한 범위에서 별도 보관될 수 있습니다.",
        ],
      },
      {
        title: "제9조 (유료서비스 및 결제)",
        list: [
          "유료서비스의 종류/요금/과금기준은 결제 화면 또는 별도 안내에 따릅니다.",
          "결제는 PG를 통해 처리되며 카드번호 전체/CVC 등 민감정보는 회사 서버에 저장하지 않습니다.",
        ],
      },
      {
        title: "제10조 (환불/취소)",
        list: [
          "환불은 관련 법령 및 회사 환불정책(구매 시 고지)에 따라 처리됩니다.",
          "디지털 콘텐츠 특성상 제공이 개시된 경우(처리 완료/크레딧 사용 등) 환불이 제한될 수 있습니다.",
          "회사 귀책 사유로 중대한 장애가 발생한 경우 합리적 범위에서 보상/환불을 제공할 수 있습니다.",
        ],
      },
      {
        title: "제11조 (금지행위)",
        list: [
          "타인의 권리를 침해하는 콘텐츠 업로드",
          "불법/유해 목적의 이용",
          "비정상 요청/과도한 호출 등 서비스 장애 유발",
          "리버스 엔지니어링, 크롤링, 우회접속 시도",
          "계정 공유/대여/양도 또는 결제수단 부정 사용",
        ],
      },
      {
        title: "제12조 (이용제한 및 해지)",
        list: [
          "회사는 위반행위가 있는 경우 경고/일시정지/영구정지 등 조치를 할 수 있습니다.",
          "회원은 언제든지 회원탈퇴로 이용계약을 해지할 수 있습니다.",
        ],
      },
      {
        title: "제13조 (책임 제한 및 면책)",
        list: [
          "불가항력(천재지변, 통신장애 등)으로 인한 장애는 책임이 제한될 수 있습니다.",
          "AI 결과는 원본 품질/옵션/환경에 따라 차이가 있을 수 있으며, 회사는 품질 향상을 위해 노력합니다.",
          "콘텐츠 적법성 및 권리 확보는 회원 책임입니다.",
        ],
      },
      {
        title: "제14조 (분쟁해결 및 관할)",
        list: [
          "회사와 회원은 분쟁 발생 시 성실히 협의하여 해결하도록 노력합니다.",
          "협의가 어려운 경우 관련 법령에 따른 관할 법원에서 해결합니다.",
        ],
      },
      {
        title: "부칙",
        text: `본 약관은 ${common.effective.replaceAll("-", ". ")}부터 시행합니다.`,
      },
    ];

    return { body };
  }, [version]);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="policyPage">
      <div className="policyWrap">
        {/* ✅ 상단 탭 */}
        <div className="policyTabs">
          {tabs.map((t) => (
            <NavLink
              key={t.key}
              to={t.to}
              className={({ isActive }) =>
                `tabBtn ${isActive ? "active" : ""}`
              }
              aria-current={pathname === t.to ? "page" : undefined}
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        {/* ✅ 제목/버전 */}
        <div className="policyHeader">
          <div>
            <h1 className="policyTitle">서비스 이용약관</h1>
            <p className="policySub">WED:IT 서비스 이용에 필요한 약관을 안내합니다.</p>
          </div>

          <div className="policyTools">
            <select
              className="policySelect"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              {versions.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>

            <button className="policyPrint" type="button" onClick={() => window.print()}>
              인쇄하기
            </button>
          </div>
        </div>

        {/* ✅ 본문 */}
        <div className="policyBody">
          {termsDoc.body.map((sec, idx) => (
            <section key={idx} className="policySection">
              <h2 className="secTitle">{sec.title}</h2>
              {sec.text && <p className="secText">{sec.text}</p>}
              {sec.list && (
                <ol className="secList">
                  {sec.list.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* ✅ 맨위로 */}
      {showTop && (
        <button className="topBtn" type="button" onClick={goTop} aria-label="맨 위로">
          ↑
        </button>
      )}
    </div>
  );
}
