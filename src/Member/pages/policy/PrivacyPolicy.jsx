import { useEffect, useMemo, useState } from "react";
import "./PrivacyPolicy.css";

// ✅ 컴포넌트 밖에 두면 ESLint 경고(의존성 변경)도 사라지고 깔끔함
const META = {
  serviceName: "WED:IT",
  effectiveDate: "2026. 01. 01.",
  email: "privacy@wedit.com",
  phone: "1588-0000",
  dpoName: "홍길동",
  companyName: "WED:IT",
};

export default function PrivacyPolicy() {
  const sections = useMemo(
    () => [
      {
        id: "s1",
        title: "1. 개인정보의 처리 목적",
        content: (
          <>
            <p>
              {META.serviceName}은(는) 다음 목적을 위해 개인정보를 처리합니다.
              처리한 개인정보는 아래 목적 이외의 용도로 이용되지 않으며, 이용 목적이
              변경되는 경우 관련 법령에 따라 별도 동의 등 필요한 조치를 이행합니다.
            </p>
            <ul>
              <li>회원가입 및 본인 식별·인증, 서비스 제공 및 이용관리</li>
              <li>AI 사진 보정 서비스 제공(업로드/결과물 제공/이력 관리)</li>
              <li>결제/정산/환불 처리(유료 요금제 이용 시)</li>
              <li>고객 문의 접수 및 답변, 분쟁 대응, 공지사항 전달</li>
              <li>서비스 안정성 확보, 부정 이용 방지, 로그 분석</li>
            </ul>
          </>
        ),
      },
      {
        id: "s2",
        title: "2. 처리하는 개인정보 항목",
        content: (
          <>
            <p className="ppHint">
              * {META.serviceName}은(는) 서비스 제공에 필요한 최소한의 정보만 처리합니다.
            </p>

            <div className="ppTableWrap">
              <table className="ppTable">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>처리 항목(예시)</th>
                    <th>처리 목적</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>회원가입/로그인</td>
                    <td>아이디, 비밀번호, 이메일(또는 연락처)</td>
                    <td>회원 식별·인증, 서비스 제공</td>
                  </tr>
                  <tr>
                    <td>AI 사진 보정</td>
                    <td>업로드 이미지/사진, 보정 요청 옵션, 결과물 파일</td>
                    <td>보정 처리 및 결과 제공</td>
                  </tr>
                  <tr>
                    <td>고객 문의</td>
                    <td>이름(또는 닉네임), 이메일, 문의유형, 제목, 내용</td>
                    <td>문의 접수/답변 및 고객지원</td>
                  </tr>
                  <tr>
                    <td>결제(해당 시)</td>
                    <td>
                      결제 승인/거래 식별 정보(승인번호, 거래ID 등), 결제수단(카드/카카오페이/토스페이)
                      <br />
                      <span style={{ color: "#6b7280", fontSize: 12 }}>
                        * 카드번호 전체/CVC 등 민감정보는 저장하지 않으며, 결제는 PG를 통해 처리됩니다.
                      </span>
                    </td>
                    <td>요금 결제, 정산, 환불 처리</td>
                  </tr>
                  <tr>
                    <td>서비스 이용기록</td>
                    <td>접속 로그, IP, 기기/브라우저 정보, 쿠키</td>
                    <td>보안, 부정이용 방지, 통계</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="ppHint">
              * 주민등록번호/계좌번호/카드번호 전체 등 민감한 정보는 입력하지 않도록 안내합니다.
            </p>
          </>
        ),
      },
      {
        id: "s3",
        title: "3. 개인정보의 처리 및 보유 기간",
        content: (
          <>
            <p>
              {META.serviceName}은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul>
              <li>회원정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보관이 필요한 경우 해당 기간)</li>
              <li>문의 내역: 문의 처리 완료 후 내부 정책에 따른 기간(예: 1년) 또는 법령상 보관기간</li>
              <li>결제/정산 기록(해당 시): 전자상거래/세법 등 관련 법령에 따른 기간</li>
              <li>
                업로드 이미지/결과물: 결과 제공 후 <b>7일</b> 보관 후 자동 삭제
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "s4",
        title: "4. 개인정보의 파기 절차 및 방법",
        content: (
          <>
            <p>
              개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다.
            </p>
            <ul>
              <li>파기 절차: 목적 달성/기간 경과 → 내부 검토 → 파기</li>
              <li>파기 방법: 전자적 파일은 복구 불가능한 방식으로 삭제, 종이는 분쇄 또는 소각</li>
            </ul>
          </>
        ),
      },
      {
        id: "s5",
        title: "5. 개인정보의 제3자 제공",
        content: (
          <>
            <p>
              {META.serviceName}은(는) 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령에 근거하거나 사전 동의를 받은 경우에 한하여 제공할 수 있습니다.
            </p>
          </>
        ),
      },
      {
        id: "s6",
        title: "6. 개인정보 처리업무의 위탁",
        content: (
          <>
            <p>
              {META.serviceName}은(는) 원활한 서비스 제공을 위해 일부 업무를 외부에 위탁할 수 있으며,
              위탁계약 시 개인정보 보호 관련 법령을 준수하도록 관리·감독합니다.
            </p>
            <div className="ppTableWrap">
              <table className="ppTable">
                <thead>
                  <tr>
                    <th>수탁자</th>
                    <th>위탁업무 내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>네이버클라우드플랫폼(NCP)</td>
                    <td>서비스 인프라 운영 및 데이터 보관</td>
                  </tr>
                  <tr>
                    <td>결제대행사(PG)</td>
                    <td>카드/카카오페이/토스페이 결제 처리 및 환불 지원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        id: "s7",
        title: "7. 정보주체의 권리·의무 및 행사방법",
        content: (
          <>
            <ul>
              <li>개인정보 열람 요구</li>
              <li>정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </>
        ),
      },
      {
        id: "s8",
        title: "8. 개인정보의 안전성 확보조치",
        content: (
          <ul>
            <li>관리적 조치: 내부 관리계획 수립·시행, 정기 교육</li>
            <li>기술적 조치: 접근권한 관리, 중요정보 암호화, 접근기록 보관</li>
            <li>물리적 조치: 서버/저장매체 접근통제</li>
          </ul>
        ),
      },
      {
        id: "s9",
        title: "9. 개인정보 보호책임자 및 고충처리",
        content: (
          <div className="ppContact">
            <div><b>개인정보 보호책임자</b> : {META.dpoName}</div>
            <div><b>이메일</b> : {META.email}</div>
            <div><b>연락처</b> : {META.phone}</div>
          </div>
        ),
      },
      {
        id: "s10",
        title: "10. 처리방침 변경에 관한 사항",
        content: (
          <p>
            내용이 추가/삭제/수정될 수 있으며, 변경 시 본 페이지를 통해 고지합니다.
          </p>
        ),
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + 140;
      let current = sections[0].id;

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.offsetTop <= y) current = s.id;
      }
      setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [sections]);

  const moveTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="ppPage">
      <div className="ppContainers">
        <header className="ppHeader2">
          <h1>개인정보처리방침</h1>
          <div className="ppDate">시행일자 : {META.effectiveDate}</div>
        </header>

        <div className="ppLayout">
          <aside className="ppSide">
            <div className="ppSideTitle">목차</div>
            <nav className="ppToc">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ppTocItem ${activeId === s.id ? "active" : ""}`}
                  onClick={() => moveTo(s.id)}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          <section className="ppContent">
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="ppSection2">
                <h2 className="ppH2">{s.title}</h2>
                <div className="ppBody">{s.content}</div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
