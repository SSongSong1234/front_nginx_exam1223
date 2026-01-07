import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WorkspaceLibraryCorrection.css";

/**
 * ✅ 라이브러리:보정 페이지 (UI 전용)
 * - 내 앨범 모달에서 선택한 이미지를 받아와서 표시
 * - 보정 로직/슬라이더는 백엔드(API) 연동 예정이라 현재는 비활성(placeholder)
 * - 저장 버튼: 로컬 다운로드
 * - className prefix: weditLib__
 */

function guessExtFromUrl(url) {
  if (!url || typeof url !== "string") return "png";
  if (url.startsWith("data:image/jpeg")) return "jpg";
  if (url.startsWith("data:image/png")) return "png";
  if (url.startsWith("data:image/webp")) return "webp";
  const m = url.match(/\.(png|jpg|jpeg|webp)(\?|#|$)/i);
  if (!m) return "png";
  const ext = m[1].toLowerCase();
  return ext === "jpeg" ? "jpg" : ext;
}

async function downloadFromUrl(url, filename = "wedit_image") {
  if (!url) return;

  // data URL이면 바로 다운로드
  if (typeof url === "string" && url.startsWith("data:")) {
    const ext = guessExtFromUrl(url);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  // 외부 URL은 CORS 때문에 download 속성이 안 먹을 수 있어 fetch->blob 시도
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const ext = guessExtFromUrl(url);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    // 최후 fallback: 새 탭 열기
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function WorkspaceLibraryCorrection() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const imageUrl = state.imageUrl;
  const title = state.title || "라이브러리 보정";

  const canUse = useMemo(() => !!imageUrl, [imageUrl]);

  return (
    <section className="weditLib">
      <div className="weditLib__head">
        <div>
          <div className="weditLib__title">라이브러리: 보정</div>
          <div className="weditLib__sub">
            백엔드(API) 연동 예정 · 지금은 UI/동선 확인용입니다.
          </div>
        </div>

        <div className="weditLib__headActions">
          <button type="button" className="weditLib__ghost" onClick={() => navigate("/workspace/album")}>
            내 앨범
          </button>
          <button type="button" className="weditLib__ghost" onClick={() => navigate("/workspace/correction")}>
            AI 보정
          </button>
        </div>
      </div>

      <div className="weditLib__grid">
        <div className="weditLib__preview">
          {!canUse ? (
            <div className="weditLib__empty">
              <div className="weditLib__emptyTitle">선택된 이미지가 없습니다.</div>
              <div className="weditLib__emptySub">내 앨범에서 이미지를 선택해 주세요.</div>
              <button type="button" className="weditLib__primary" onClick={() => navigate("/workspace/album")}>
                내 앨범으로 이동
              </button>
            </div>
          ) : (
            <div className="weditLib__previewCard">
              <div className="weditLib__previewTop">
                <div className="weditLib__previewName" title={title}>
                  {title}
                </div>
                <div className="weditLib__pill">Library</div>
              </div>
              <div className="weditLib__previewImgWrap">
                <img className="weditLib__img" src={imageUrl} alt={title} />
              </div>
            </div>
          )}
        </div>

        <aside className={`weditLib__panel ${!canUse ? "isDisabled" : ""}`}>
          <div className="weditLib__panelTitle">보정 옵션</div>
          <div className="weditLib__panelSub">※ 이 페이지는 백엔드 연동 전이라 옵션이 비활성화되어 있습니다.</div>

          <div className="weditLib__group">
            <div className="weditLib__row">
              <span>밝기</span>
              <input type="range" min="0" max="100" defaultValue="50" disabled />
            </div>
            <div className="weditLib__row">
              <span>채도</span>
              <input type="range" min="0" max="100" defaultValue="50" disabled />
            </div>
            <div className="weditLib__row">
              <span>선명도</span>
              <input type="range" min="0" max="100" defaultValue="50" disabled />
            </div>
            <div className="weditLib__row">
              <span>피부 톤</span>
              <input type="range" min="0" max="100" defaultValue="50" disabled />
            </div>
          </div>

          <div className="weditLib__panelFooter">
            <button
              type="button"
              className="weditLib__primary"
              onClick={() => downloadFromUrl(imageUrl, title)}
              disabled={!canUse}
            >
              저장 (다운로드)
            </button>
            <button type="button" className="weditLib__ghost" onClick={() => navigate(-1)}>
              뒤로
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
