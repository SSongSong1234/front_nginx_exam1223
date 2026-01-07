import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

import OverFlowHidden from "../components/OverFlowHidden";
import beforeImg from "../assets/before.png";
import afterImg from "../assets/after.png";
import mainImg from "../assets/main.png";

import { useAuth } from "../../contexts/auth";

export default function Main() {
  const nav = useNavigate();
  const { isLogin } = useAuth();

  // 상단 스크롤 진행바 + TOP
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  // 보정모드(패널) + 슬라이더(미리보기용)
  const [modeOpen, setModeOpen] = useState(false);
  const [tone, setTone] = useState(100);   // 70~130 (밝기)
  const [sharp, setSharp] = useState(100); // 80~150 (대비)
  const [smooth, setSmooth] = useState(0); // 0~6 (블러 px)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const y = window.scrollY;
      const p = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
      setProgress(p);
      setShowTop(y > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const afterFilter = useMemo(() => {
    // “보정모드” 미리보기용 (실제 보정 로직은 백/AI에서 하겠지만 UX는 이렇게 보여주는 게 실무적)
    const b = (tone / 100).toFixed(2);
    const c = (sharp / 100).toFixed(2);
    const blur = `${smooth}px`;
    return `brightness(${b}) contrast(${c}) blur(${blur})`;
  }, [tone, sharp, smooth]);

  return (
    <div className="mainPage">
      {/* 상단 스크롤 진행바 */}
      <div className="scrollProgress" style={{ width: `${progress}%` }} />

      {/* HERO */}
      <section className="hero">
        <div className="heroGrid">
          {/* LEFT */}
          <div className="heroText">
            <div className="pillDot">
              <span className="pillDotPoint" />
              자연스러움에 집중한 AI 피부 보정
            </div>

            <h1 className="heroTitle">
              WED:IT <br />
              보정의 새로운 차원 <br />
              완벽을 재정의 하다
            </h1>

            <button
              className="btnPrimaryHero"
              type="button"
              onClick={() => (isLogin ? nav("/mypage") : nav("/login"))}
            >
              무료로 체험하기
            </button>

            <p className="heroSub">
              과도한 블러/필터 대신 피부결을 살리고 <br />
              잡티·톤·윤곽·채광을 자동 보정합니다.
            </p>
          </div>

          {/* RIGHT */}
          <div className="heroVisual">
            <div className={`heroCard ${modeOpen ? "open" : ""}`}>
              <div className="heroCardHead">
                <div className="heroCardTitle">Before / After</div>

                <button
                  className="heroMiniBtn"
                  type="button"
                  onClick={() => setModeOpen((v) => !v)}
                  aria-expanded={modeOpen}
                >
                  {modeOpen ? "보정모드 열림" : "드래그 비교"}
                </button>
              </div>

              {/* 보정모드 패널(실무형 UX: 펼침/접힘) */}
              <div className={`modePanel ${modeOpen ? "open" : ""}`}>
                <div className="modeRow">
                  <div className="modeLabel">
                    톤 <span className="modeValue">{tone}%</span>
                  </div>
                  <input
                    className="modeRange"
                    type="range"
                    min="70"
                    max="130"
                    value={tone}
                    onChange={(e) => setTone(Number(e.target.value))}
                  />
                </div>

                <div className="modeRow">
                  <div className="modeLabel">
                    샤픈 <span className="modeValue">{sharp}%</span>
                  </div>
                  <input
                    className="modeRange"
                    type="range"
                    min="80"
                    max="150"
                    value={sharp}
                    onChange={(e) => setSharp(Number(e.target.value))}
                  />
                </div>

                <div className="modeRow">
                  <div className="modeLabel">
                    스무딩 <span className="modeValue">{smooth}</span>
                  </div>
                  <input
                    className="modeRange"
                    type="range"
                    min="0"
                    max="6"
                    value={smooth}
                    onChange={(e) => setSmooth(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="compareArea">
                <OverFlowHidden
                  beforeSrc={beforeImg}
                  afterSrc={afterImg}
                  height={260}
                  beforeLabel="BEFORE"
                  afterLabel="AFTER"
                  afterFilter={modeOpen ? afterFilter : ""} // 보정모드 켰을 때만 미리보기 반영
                />
              </div>

              <div className="heroCaption">샘플 데모(실제 서비스는 업로드 사진 기반)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 리드 문구(히어로 밖) */}
      <section className="lead">
        <div className="wrap1100">
          <div className="leadSmall">Not a filter, Just 보정</div>
          <div className="leadTitle">
            필터가 아닌, <span className="leadEm">“Correction”</span>
          </div>
          <div className="leadDesc">자연스러움과 속도, 그리고 신뢰를 중심으로</div>
        </div>
      </section>

      {/* 중간 3 섹션 */}
      <section className="midSection">
        <div className="midGrid">
          <div className="midImage">
            <img src={mainImg} alt="메인사진1" />
          </div>
          <div className="midText">
            <h2>피부 결 정돈 & 자연스러운 톤 보정</h2>
            <p>
              과한 필터 대신 피부결을 살리고, 자연스럽게 톤을 정돈합니다.
              <br />
              필요한 부분만 더 섬세하게 재보정할 수 있어요.
            </p>
          </div>
        </div>
      </section>

      <section className="midSection">
        <div className="midGrid reverse">
          <div className="midImage">
            <img src={mainImg} alt="메인사진2" />
          </div>
          <div className="midText">
            <h2>원하는 부분만 선택해서 미세 조정</h2>
            <p>
              얼굴/피부 영역을 선택해 스무딩, 톤을 원하는 만큼 조절합니다.
              <br />
              결과를 “자연스럽게” 만드는 게 핵심 목표예요.
            </p>
          </div>
        </div>
      </section>

      <section className="midSection">
        <div className="midGrid">
          <div className="midImage">
            <img src={mainImg} alt="메인사진3" />
          </div>
          <div className="midText">
            <h2>보정 결과 저장 & 다운로드</h2>
            <p>
              보정 결과를 앨범에 저장하고, 필요할 때 다시 열어 재보정할 수 있습니다.
              <br />
              다운로드까지 한 흐름으로 이어져요.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="ctaInner">
          <h2>지금 바로 경험해보세요</h2>
          <p>업로드 → AI 보정 → 미세 조정 → 저장까지</p>

          <button
            className="btnPrimaryCtaWhite"
            type="button"
            onClick={() => (isLogin ? nav("/mypage") : nav("/login"))}
          >
            보정하기
          </button>
        </div>
      </section>

      {showTop && (
        <button className="toTop" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑
        </button>
      )}
    </div>
  );
}