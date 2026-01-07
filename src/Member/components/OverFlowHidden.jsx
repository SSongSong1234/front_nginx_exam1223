import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Before/After Drag Compare (실무형)
 * - pointer events (마우스/터치 모두)
 * - 라벨/핸들 커스텀을 CSS로 제어 (evp* 클래스)
 * - afterFilter로 "보정모드" 슬라이더 결과를 미리보기로 반영 가능
 */
export default function OverFlowHidden({
  beforeSrc,
  afterSrc,
  height = 260,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  afterFilter = "",
}) {
  const wrapRef = useRef(null);
  const [pct, setPct] = useState(50); // 0~100

  const clamp = (v) => Math.max(0, Math.min(100, v));

  const setFromClientX = (clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(clamp(next));
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    wrapRef.current?.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (e.buttons === 0) return; // 드래그 중 아닐 때 무시
    setFromClientX(e.clientX);
  };

  // 키보드 접근성(좌/우로 이동)
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPct((p) => clamp(p - 3));
    if (e.key === "ArrowRight") setPct((p) => clamp(p + 3));
  };

  const beforeClip = useMemo(() => {
    // BEFORE 이미지가 왼쪽만 보이게 clip
    // inset(top right bottom left)
    // right를 늘릴수록 BEFORE가 더 많이 보임
    const right = 100 - pct;
    return `inset(0 ${right}% 0 0)`;
  }, [pct]);

  return (
    <div
      ref={wrapRef}
      className="evpWrap"
      style={{ height }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      role="application"
      aria-label="before after 비교 슬라이더"
    >
      <img className="evpImg evpAfter" alt="after" draggable="false" src={afterSrc} style={{ filter: afterFilter }} />
      <img
        className="evpImg evpBefore"
        alt="before"
        draggable="false"
        src={beforeSrc}
        style={{ clipPath: beforeClip }}
      />

      <div className="evpLabel left">{beforeLabel}</div>
      <div className="evpLabel right">{afterLabel}</div>

      <div
        className="evpSlider"
        style={{ transform: `translateX(${pct}%)` }}
        aria-hidden="true"
      >
        <div className="evpLine" />
        <div className="evpKnob" tabIndex={0} onKeyDown={onKeyDown} title="드래그로 이동">
          ⇄
        </div>
      </div>
    </div>
  );
}
