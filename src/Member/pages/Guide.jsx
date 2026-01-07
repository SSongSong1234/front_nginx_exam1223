import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Guide.css";

// ✅ 너가 넣을 이미지 (경로만 맞추면 됨)
import guide1 from "../assets/guide1.png";
import guide2 from "../assets/guide2.png";
import guide3 from "../assets/guide3.png";
import guide4 from "../assets/guide4.png";

// (선택) 기존 프로젝트에서 로그인 여부에 따라 CTA 이동
// import { useAuth } from "../../contexts/auth";

export default function Guide() {
  const nav = useNavigate();
  // const { isLogin } = useAuth();

  const steps = useMemo(
    () => [
      {
        no: "01",
        title: "이미지 업로드",
        desc: "원본 사진을 업로드하면 AI가 자동으로 분석을 시작합니다.",
        img: guide1,
        alt: "이미지 업로드 예시",
      },
      {
        no: "02",
        title: "AI 자동 보정",
        desc: "WED:IT의 AI가 피부 결·톤·조명을 자연스럽게 보정해 완성도를 높입니다.",
        img: guide2,
        alt: "AI 자동 보정 예시",
      },
      {
        no: "03",
        title: "디테일 미세 조정",
        desc: "슬라이더로 원하는 영역만 골라 강도를 조절해 나만의 결과로 다듬습니다.",
        img: guide3,
        alt: "디테일 미세 조정 예시",
      },
      {
        no: "04",
        title: "저장 및 다운로드",
        desc: "완성된 결과물을 저장하고 앨범에서 언제든 다운로드할 수 있습니다.",
        img: guide4,
        alt: "저장 및 다운로드 예시",
      },
    ],
    []
  );

  // ✅ 스크롤 등장 애니메이션(실무에서 자주 쓰는 IntersectionObserver)
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onStart = () => {
    // ✅ 로그인 붙이면 이렇게:
    // nav(isLogin ? "/mypage" : "/login");
    nav("/login");
  };

  return (
    <main className="guidePage">
      {/* 상단 헤더 영역 */}
      <header className="guideHero">
        <div className="guideHeroInner" data-reveal>
          <p className="guideEyebrow">AI 웨딩 사진 보정 · 프라이버시 중심</p>
          <h1 className="guideTitle">가장 완벽한 웨딩의 순간</h1>
          <p className="guideSub">
            AI와 함께하는 4단계 프리미엄 리터칭 가이드
          </p>
        </div>
      </header>

      {/* 타임라인 */}
      <section className="guideTimeline">
        <div className="guideContainer">
          <div className="timelineGrid">
            {steps.map((s, idx) => (
              <article
                key={s.no}
                className={`stepRow ${idx % 2 === 1 ? "reverse" : ""}`}
              >
                {/* 텍스트 */}
                <div className="stepText" data-reveal>
                  <div className="stepNo">{s.no}</div>
                  <h2 className="stepTitle">{s.title}</h2>
                  <p className="stepDesc">{s.desc}</p>
                </div>

                {/* 이미지 카드 */}
                <div className="stepMedia" data-reveal>
                  <div className="imgCard">
                    {/* ✅ 여기 img src를 너 이미지로 교체 */}
                    <img src={s.img} alt={s.alt} />
                  </div>
                </div>

                {/* 중앙 점선/마커용(레이아웃 잡는 용도) */}
                <div className="centerMarker" aria-hidden="true">
                  <span className="dot" />
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="guideCta" data-reveal>
            <p className="ctaText">지금 바로 시작해보세요</p>
            <button className="ctaBtn" type="button" onClick={onStart}>
              무료로 경험하기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
