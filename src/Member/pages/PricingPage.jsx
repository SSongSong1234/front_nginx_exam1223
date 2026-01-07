import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PricingPage.css";

const KRW = (n) => n.toLocaleString("ko-KR");

const PLANS = [
  {
    id: "FREE",
    name: "FREE",
    tag: "체험용",
    priceMonthly: 0,
    unit: "월",
    desc: "가볍게 기능을 경험해보세요.",
    bullets: ["Before / After 비교", "기본 보정소스 출력", "워터마크 포함", "상업적 사용 제한"],
    cta: "무료로 시작하기",
    tone: "neutral",
  },
  {
    id: "BASIC",
    name: "BASIC",
    tag: "개인 크리에이터",
    priceMonthly: 9900,
    unit: "월",
    desc: "개인 작업에 딱 맞는 사용량.",
    bullets: ["월 50장 제공", "자연스러운 피부·톤 Correction", "고해상도 출력", "Before / After 비교"],
    cta: "베이직 시작하기",
    tone: "dark",
  },
  {
    id: "PRO",
    name: "PRO",
    tag: "전문가 · 웨딩/스튜디오",
    badge: "추천",
    priceMonthly: 29900,
    unit: "월",
    desc: "대량 보정, 빠르고 안정적으로.",
    bullets: ["월 300장 제공", "고해상도 출력", "대량 업로드(배치)", "상업적 사용 가능"],
    cta: "프로 시작하기",
    tone: "dark",
  },
  {
    id: "ENTERPRISE",
    name: "ENTERPRISE",
    tag: "기업 · 커스텀",
    priceMonthly: null,
    unit: "월",
    desc: "팀·기업용, 맞춤 구성으로.",
    bullets: ["결제/정산 관리", "API 연동", "SLA / 전담 지원", "맞춤 요금제"],
    cta: "도입 문의하기",
    tone: "neutral",
  },
];

const COMPARE_ROWS = [
  { label: "보정 제공량", FREE: "5장/월", BASIC: "50장/월", PRO: "300장/월", STUDIO: "Custom" },
  { label: "고해상도 출력", FREE: "—", BASIC: "✓", PRO: "✓", STUDIO: "✓" },
  { label: "워터마크 제거", FREE: "—", BASIC: "✓", PRO: "✓", STUDIO: "✓" },
  { label: "Before/After 비교", FREE: "✓", BASIC: "✓", PRO: "✓", STUDIO: "✓" },
  { label: "상업적 사용", FREE: "제한", BASIC: "가능", PRO: "가능", STUDIO: "가능" },
  { label: "API 연동", FREE: "—", BASIC: "—", PRO: "—", STUDIO: "✓" },
];

const FAQS = [
  {
    q: "사용하지 않은 제공량은 이월되나요?",
    a: "아니요. 제공량은 매 결제 주기(월/연) 기준으로 갱신됩니다. 필요 시 상위 플랜으로 업그레이드를 추천드려요.",
  },
  {
    q: "웨딩 사진도 상업적으로 사용 가능한가요?",
    a: "BASIC 이상에서 상업적 사용이 가능합니다. FREE는 체험 목적(개인 사용)으로만 권장됩니다.",
  },
  {
    q: "중간에 플랜 변경이 가능한가요?",
    a: "가능합니다. 결제 주기/플랜 변경 정책은 운영 방식에 맞춰 백엔드에서 정산 로직으로 처리하게 됩니다.",
  },
  {
    q: "연간 결제는 어떻게 할인이 되나요?",
    a: "연간 결제 선택 시 월간 금액 기준 20% 할인된 금액으로 표시/결제되도록 구성했습니다.",
  },
];

export default function PricingPage() {
  const nav = useNavigate();
  const [billing, setBilling] = useState("MONTHLY");
  const [openFaq, setOpenFaq] = useState(null);

  const isYearly = billing === "YEARLY";

  const computedPlans = useMemo(() => {
    return PLANS.map((p) => {
      if (p.priceMonthly == null) return { ...p, priceShown: null };
      const monthly = p.priceMonthly;
      const priceShown = isYearly ? Math.round(monthly * 0.8) : monthly;
      return { ...p, priceShown };
    });
  }, [isYearly]);

  const goCompare = () => document.getElementById("pp-compare")?.scrollIntoView({ behavior: "smooth" });
  const goPlans = () => document.getElementById("pp-plans")?.scrollIntoView({ behavior: "smooth" });

  const goCheckout = (planId) => {
    nav(`/checkout?plan=${encodeURIComponent(planId)}&billing=${encodeURIComponent(billing)}`);
  };

  const onCtaClick = (planId) => {
    if (planId === "ENTERPRISE") return nav("/inquiries/new");
    goCheckout(planId);
  };

  return (
    <div className="pricingPage">
      {/* HERO */}
      <section className="ppHero">
        <div className="ppContainer ppHeroGrid">
          <div className="ppHeroLeft">
            <div className="ppPill">
              <span className="ppDot" />
              필터가 아닌, <b>Correction</b> — 투명한 요금제
            </div>

            <h1 className="ppTitle">
              WED:IT 플랜<br />
              필요한 만큼만, 완벽하게
            </h1>

            <p className="ppSub">
              과도한 필터가 아닌 자연스러운 보정(Correction).<br />
              Before/After 비교로 결과를 확인하고, 사용량에 맞춰 합리적으로 선택하세요.
            </p>

            <div className="ppHeroBtns">
              <button className="ppBtnPrimary" type="button" onClick={goPlans}>
                플랜 선택하기
              </button>
              <button className="ppBtnGhost" type="button" onClick={goCompare}>
                기능 비교 보기
              </button>
            </div>
          </div>

          <aside className="ppHeroCard">
            <div className="ppHeroCardHead">
              <div>
                <div className="ppHeroCardTitle">결제 주기</div>
                <div className="ppHeroCardDesc">
                  연간 결제 시 <b>20% 할인</b> 적용
                </div>
              </div>

              <div className="ppSegment" role="tablist" aria-label="billing">
                <button
                  type="button"
                  className={`ppSegBtn ${billing === "MONTHLY" ? "isActive" : ""}`}
                  onClick={() => setBilling("MONTHLY")}
                >
                  월간
                </button>
                <button
                  type="button"
                  className={`ppSegBtn ${billing === "YEARLY" ? "isActive" : ""}`}
                  onClick={() => setBilling("YEARLY")}
                >
                  연간
                </button>
              </div>
            </div>

            <div className="ppHeroCardBody">
              <div className="ppHeroMiniTitle">
                모든 플랜 공통 <span className="ppMuted">상업적 사용(유료 플랜)</span> · Before/After · 고해상도
              </div>

              <div className="ppMiniGrid">
                <div className="ppMiniBox">
                  <div className="ppMiniTop">자연스러운 보정</div>
                  <div className="ppMiniBottom">톤/피부/결 개선 중심</div>
                </div>
                <div className="ppMiniBox">
                  <div className="ppMiniTop">결과 확인</div>
                  <div className="ppMiniBottom">슬라이더로 Before/After</div>
                </div>
              </div>

              <div className="ppHeroNote">
                * FREE는 워터마크가 포함되며, 상업적 사용이 제한될 수 있습니다.<br />
                * Studio 플랜은 사용자/기업에 따라 맞춤 제공됩니다.
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* PLANS (여백 크게) */}
      <section id="pp-plans" className="ppSection ppSection--loose">
        <div className="ppContainer ppSectionInner">
          <div className="ppSectionHead">
            <h2>플랜 선택</h2>
            <p>당신의 사용량에 맞게 고르세요. 유료 플랜은 워터마크 제거 및 상업적 사용이 가능합니다.</p>
          </div>

          <div className="ppPlanGrid">
            {computedPlans.map((p) => (
              <article key={p.id} className={`ppPlanCard ${p.badge ? "isRecommend" : ""}`}>
                <div className="ppPlanTop">
                  <div className="ppPlanTag">{p.tag}</div>
                  {p.badge && <div className="ppBadge">{p.badge}</div>}
                </div>

                <div className="ppPlanNameRow">
                  <div className="ppPlanName">{p.name}</div>
                  {p.id !== "FREE" && p.id !== "ENTERPRISE" && <span className="ppCrown">♛</span>}
                </div>

                <div className="ppPriceRow">
                  {p.priceMonthly == null ? (
                    <>
                      <div className="ppPriceAsk">문의</div>
                      <div className="ppPer">/ {p.unit}</div>
                    </>
                  ) : (
                    <>
                      <div className="ppPrice">₩{KRW(p.priceShown)}</div>
                      <div className="ppPer">/ {p.unit}</div>
                    </>
                  )}
                </div>

                <div className="ppPlanDesc">{p.desc}</div>

                <ul className="ppBulletList">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="ppBullet">
                      <span className="ppCheck">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`ppPlanCta ${p.tone === "dark" ? "isDark" : ""}`}
                  type="button"
                  onClick={() => onCtaClick(p.id)}
                >
                  {p.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE (여백 중간) */}
      <section id="pp-compare" className="ppSection ppSection--mid">
        <div className="ppContainer ppSectionInner">
          <div className="ppSectionHead">
            <h2>기능 비교</h2>
            <p>필요한 기능을 플랜별로 한눈에 확인해보세요.</p>
          </div>

          <div className="ppTableWrap">
            <table className="ppTable">
              <thead>
                <tr>
                  <th className="ppThLeft">기능</th>
                  <th>FREE</th>
                  <th>BASIC</th>
                  <th>PRO</th>
                  <th>STUDIO</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr key={r.label}>
                    <td className="ppTdLeft">{r.label}</td>
                    <td>{r.FREE}</td>
                    <td>{r.BASIC}</td>
                    <td>{r.PRO}</td>
                    <td>{r.STUDIO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ (여백 크게) */}
      <section className="ppSection ppSection--loose">
        <div className="ppContainer ppSectionInner">
          <div className="ppSectionHead">
            <h2>FAQ</h2>
            <p>결제/사용 관련해서 많이 묻는 질문만 모았습니다.</p>
          </div>

          <div className="ppFaq">
            {FAQS.map((f, idx) => {
              const opened = openFaq === idx;
              return (
                <div key={idx} className={`ppFaqItem ${opened ? "isOpen" : ""}`}>
                  <button
                    type="button"
                    className="ppFaqQ"
                    onClick={() => setOpenFaq(opened ? null : idx)}
                    aria-expanded={opened}
                  >
                    <span>{f.q}</span>
                    <span className="ppFaqIcon">{opened ? "▴" : "▾"}</span>
                  </button>
                  {opened && <div className="ppFaqA">{f.a}</div>}
                </div>
              );
            })}
          </div>

          <div className="ppBottomCta">
            <div className="ppBottomLeft">
              <div className="ppBottomTitle">필터가 아닌, correction</div>
              <div className="ppBottomDesc">지금 WED:IT로 자연스러운 보정 경험을 시작하세요.</div>
            </div>
            <div className="ppBottomBtns">
              <button className="ppBtnGhost" type="button" onClick={goCompare}>
                비교표 보기
              </button>
              <button className="ppBtnPrimary" type="button" onClick={() => onCtaClick("FREE")}>
                무료로 시작하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
