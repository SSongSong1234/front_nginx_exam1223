import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiCorrect, applyCorrect } from "../../../api/image";
import { listRecent, saveToAlbum } from "../../../api/album";
import { useAuth } from "../../../contexts/auth.jsx";
import "./WorkspaceCorrection.css";

// --- helpers ------------------------------------------------------
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function safeFirstArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}

function extractImageUrl(res) {
  // 백엔드 응답이 다양할 수 있어서 최대한 안전하게 처리
  return (
    res?.url ||
    res?.image_url ||
    res?.after_url ||
    res?.result_url ||
    res?.data?.url ||
    res?.data?.image_url ||
    null
  );
}

function mapRecentItem(item) {
  return {
    id: item?.id ?? item?.album_id ?? item?.work_id ?? String(Math.random()),
    name: item?.name ?? item?.title ?? item?.file_name ?? "(untitled)",
    status: item?.status ?? item?.state ?? "완료",
    beforeUrl: item?.before_url ?? item?.origin_url ?? item?.original_url ?? null,
    afterUrl: item?.after_url ?? item?.result_url ?? item?.corrected_url ?? null,
    originUrl: item?.origin_url ?? item?.original_url ?? item?.before_url ?? null,
    createdAt: item?.createdAt ?? item?.created_at ?? null,
    favorite: !!(item?.favorite ?? item?.is_favorite),
    raw: item,
  };
}

async function urlToFile(url, filename = "image.jpg") {
  const res = await fetch(url, { credentials: "include" });
  const blob = await res.blob();
  const ext = blob.type?.split("/")[1] || "jpg";
  return new File([blob], filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`, {
    type: blob.type || "image/jpeg",
  });
}

function downloadUrl(url, filename = "wedit-result.jpg") {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// -----------------------------------------------------------------

export default function WorkspaceCorrection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.user_id || user?.username;

  const [recent, setRecent] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [originFile, setOriginFile] = useState(null);
  const [beforeUrl, setBeforeUrl] = useState(null);
  const [afterUrl, setAfterUrl] = useState(null);

  const [busy, setBusy] = useState({ upload: false, apply: false, save: false });
  const [message, setMessage] = useState(null);
  const [autoPreview, setAutoPreview] = useState(false);

  const [modal, setModal] = useState({ open: false, url: null });
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  const [tools, setTools] = useState({
    blemishRemove: 35,
    skinKeep: 60,
    tone: 8,
    shade: 4,
    sharp: 20,
    soft: 22,
  });

  const lastAppliedSigRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const mountedRef = useRef(false);

  const canWork = !!beforeUrl;
  const canApply = canWork && !!originFile && !busy.upload && !busy.apply;
  const canSave = !!afterUrl && !busy.save;

  const editParams = useMemo(
    () => ({
      ...tools,
      // 실제 백엔드에서 쓰는 key가 다르면 여기만 바꾸면 됨
      "smooting-level": tools.blemishRemove,
      "tone-level": tools.tone,
    }),
    [tools]
  );

  // ✅ 최근 목록 로드
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      if (!userId) return;
      try {
        const data = await listRecent(userId, 12);
        const items = safeFirstArray(data?.items ?? data?.list ?? data).map(mapRecentItem);
        if (mountedRef.current) setRecent(items);
      } catch {
        // recent API가 없으면 조용히 패스
      }
    })();

    return () => {
      mountedRef.current = false;
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    };
  }, [userId]);

  // ✅ autoPreview: 슬라이더 바뀌면 debounce로 apply
  useEffect(() => {
    if (!autoPreview) return;
    if (!originFile) return;
    if (!beforeUrl) return;
    if (busy.upload || busy.apply) return;

    const sig = `${originFile.name}_${originFile.size}_${tools.blemishRemove}_${tools.tone}`;
    if (lastAppliedSigRef.current === sig) return;

    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      handleApply(sig);
    }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPreview, originFile, beforeUrl, tools.blemishRemove, tools.tone]);

  const resetWork = () => {
    setOriginFile(null);
    setBeforeUrl(null);
    setAfterUrl(null);
    setSelectedId(null);
    setMessage(null);
    lastAppliedSigRef.current = null;
  };

  const onPickFile = async (file) => {
    if (!file) return;
    setMessage(null);
    setSaveMenuOpen(false);

    // UI 반영(원본 미리보기)
    const url = URL.createObjectURL(file);
    setBeforeUrl(url);
    setAfterUrl(null);
    setOriginFile(file);

    // AI 1차 보정
    if (!userId) {
      setMessage("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      setBusy((b) => ({ ...b, upload: true }));
      const res = await aiCorrect({ user_id: userId, img_file: file });
      const outUrl = extractImageUrl(res);
      if (outUrl) setAfterUrl(outUrl);

      // 최근 목록(프론트 임시)
      const temp = {
        id: `local_${Date.now()}`,
        name: file.name,
        status: "완료",
        beforeUrl: url,
        afterUrl: outUrl,
        originUrl: url,
        createdAt: new Date().toISOString(),
        favorite: false,
      };
      setRecent((prev) => [temp, ...prev].slice(0, 12));
      setSelectedId(temp.id);
    } catch (e) {
      setMessage(e?.friendlyMessage || "AI 보정에 실패했습니다.");
    } finally {
      setBusy((b) => ({ ...b, upload: false }));
    }
  };

  const onSelectRecent = async (item) => {
    setSelectedId(item.id);
    setMessage(null);
    setSaveMenuOpen(false);

    setBeforeUrl(item.beforeUrl);
    setAfterUrl(item.afterUrl);

    // ✅ 서버 URL만 있는 경우, 다시 보정/저장을 위해 원본 파일을 복구(가능하면)
    // - 백엔드가 CORS/쿠키 허용해야 fetch 가능
    if (!item.beforeUrl) {
      setOriginFile(null);
      return;
    }

    // 이미 objectURL로 올린 파일이면 originFile 유지
    if (item.beforeUrl?.startsWith("blob:")) return;

    try {
      const file = await urlToFile(item.originUrl || item.beforeUrl, item.name || "image");
      setOriginFile(file);
    } catch {
      setOriginFile(null);
    }
  };

  const handleApply = async (sigFromAuto = null) => {
    if (!canApply) {
      setMessage("이미지를 업로드한 뒤 사용할 수 있어요.");
      return;
    }
    if (!userId) return;

    // 자동 미리보기/수동 공통: 시그니처로 중복 방지
    const sig = sigFromAuto || `${originFile.name}_${originFile.size}_${tools.blemishRemove}_${tools.tone}`;
    if (lastAppliedSigRef.current === sig) return;

    try {
      setBusy((b) => ({ ...b, apply: true }));
      setMessage(null);

      const res = await applyCorrect({
        user_id: userId,
        img_file: originFile,
        "smooting-level": clamp(tools.blemishRemove, 0, 100),
        "tone-level": clamp(tools.tone, 0, 100),
      });

      const outUrl = extractImageUrl(res);
      if (outUrl) setAfterUrl(outUrl);
      lastAppliedSigRef.current = sig;
    } catch (e) {
      setMessage(e?.friendlyMessage || "보정 적용에 실패했습니다.");
    } finally {
      setBusy((b) => ({ ...b, apply: false }));
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!afterUrl) {
      setMessage("저장할 결과 이미지가 없습니다.");
      return;
    }

    try {
      setBusy((b) => ({ ...b, save: true }));
      setMessage(null);
      await saveToAlbum({
        user_id: userId,
        title: originFile?.name || "WED:IT 작업",
        origin_file: originFile || null,
        before_url: beforeUrl,
        after_url: afterUrl,
        edit_params: editParams,
      });

      setMessage("✅ 내 앨범에 저장했습니다.");
      setSaveMenuOpen(false);

      // recent 다시 불러오기(백엔드 지원 시)
      try {
        const data = await listRecent(userId, 12);
        const items = safeFirstArray(data?.items ?? data?.list ?? data).map(mapRecentItem);
        setRecent(items);
      } catch {
        // no-op
      }
    } catch (e) {
      setMessage(e?.friendlyMessage || "저장에 실패했습니다.");
    } finally {
      setBusy((b) => ({ ...b, save: false }));
    }
  };

  const onDownload = () => {
    if (!afterUrl) return;
    downloadUrl(afterUrl, originFile?.name ? `wedit_${originFile.name}` : "wedit_result.jpg");
    setSaveMenuOpen(false);
  };

  const onOpenModal = (url) => {
    if (!url) return;
    setModal({ open: true, url });
  };

  const uiRecent = useMemo(() => recent.slice(0, 12), [recent]);

  return (
    <section className="weditCorr">
      <div className="weditCorr__grid">
        {/* LEFT */}
        <aside className="weditCorr__side">
          <div className="weditCorr__panel">
            <div className="weditCorr__panelTitle">최근 파일</div>
            <div className="weditCorr__recentList">
              {uiRecent.length === 0 ? (
                <div className="weditCorr__empty">최근 작업이 없습니다.</div>
              ) : (
                uiRecent.map((it) => (
                  <button
                    type="button"
                    key={it.id}
                    className={`weditCorr__recentItem ${selectedId === it.id ? "isActive" : ""}`}
                    onClick={() => onSelectRecent(it)}
                    title={it.name}
                  >
                    <div className="weditCorr__recentThumb">
                      {it.afterUrl || it.beforeUrl ? (
                        <img src={it.afterUrl || it.beforeUrl} alt="thumb" />
                      ) : (
                        <div className="weditCorr__thumbFallback" />
                      )}
                    </div>
                    <div className="weditCorr__recentMeta">
                      <div className="weditCorr__recentName">{it.name}</div>
                      <div className="weditCorr__recentStatus">{it.status}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <div className="weditCorr__center">
          <div className="weditCorr__header">
            <div className="weditCorr__hTitle">AI 보정</div>
            <div className="weditCorr__hDesc">
              좌측에서 이미지를 선택하거나 업로드하세요. 우측 슬라이더로 강도를 조절하고 “적용/저장”을
              진행합니다.
            </div>
          </div>

          <div className="weditCorr__stage">
            {!beforeUrl ? (
              <label className="weditCorr__drop">
                <input
                  type="file"
                  accept="image/*"
                  className="weditCorr__file"
                  onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                />
                <div className="weditCorr__dropBox">
                  <div className="weditCorr__dropTitle">클릭해서 불러오기</div>
                  <div className="weditCorr__dropSub">또는 이미지를 드래그앤드롭 해보세요.</div>
                  <div className="weditCorr__dropNote">업로드 후 우측에서 AI 결과를 확인합니다.</div>
                </div>
              </label>
            ) : (
              <div className="weditCorr__compare">
                <div className="weditCorr__imgCard" onClick={() => onOpenModal(beforeUrl)} role="button" tabIndex={0}>
                  <div className="weditCorr__imgLabel">Before</div>
                  <div className="weditCorr__imgWrap">
                    <img src={beforeUrl} alt="before" />
                  </div>
                </div>

                <div className="weditCorr__imgCard" onClick={() => onOpenModal(afterUrl)} role="button" tabIndex={0}>
                  <div className="weditCorr__imgLabel">After</div>
                  <div className="weditCorr__imgWrap">
                    {afterUrl ? <img src={afterUrl} alt="after" /> : <div className="weditCorr__imgSkeleton" />}
                  </div>
                </div>
              </div>
            )}
          </div>

          {message && <div className="weditCorr__message">{message}</div>}
        </div>

        {/* RIGHT */}
        <aside className="weditCorr__right">
          <div className="weditCorr__panel">
            <div className="weditCorr__toolsHead">
              <div className="weditCorr__panelTitle">보정 도구</div>
              <button
                type="button"
                className="weditCorr__applyBtn"
                disabled={!canApply}
                onClick={() => handleApply()}
              >
                {busy.apply ? "적용중..." : "적용"}
              </button>
            </div>

            <div className="weditCorr__toggleRow">
              <label className="weditCorr__toggle">
                <input
                  type="checkbox"
                  checked={autoPreview}
                  onChange={(e) => setAutoPreview(e.target.checked)}
                  disabled={!originFile}
                />
                <span>실시간 미리보기(자동 적용)</span>
              </label>
              <button
                type="button"
                className="weditCorr__ghostBtn"
                onClick={resetWork}
              >
                초기화
              </button>
            </div>

            {!originFile && (
              <div className="weditCorr__hint">이미지 업로드후 이용가능합니다</div>
            )}

            <div className="weditCorr__group">
              <div className="weditCorr__groupTitle">피부 결 / 잡티</div>
              <div className="weditCorr__slider">
                <div className="weditCorr__sliderRow">
                  <span>잡티 제거</span>
                  <b>{tools.blemishRemove}</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tools.blemishRemove}
                  onChange={(e) => setTools((t) => ({ ...t, blemishRemove: Number(e.target.value) }))}
                  disabled={!originFile}
                />
              </div>

              <div className="weditCorr__slider">
                <div className="weditCorr__sliderRow">
                  <span>피부결 유지</span>
                  <b>{tools.skinKeep}</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tools.skinKeep}
                  onChange={(e) => setTools((t) => ({ ...t, skinKeep: Number(e.target.value) }))}
                  disabled={!originFile}
                />
              </div>
            </div>

            <div className="weditCorr__group">
              <div className="weditCorr__groupTitle">톤 & 컬러</div>
              <div className="weditCorr__slider">
                <div className="weditCorr__sliderRow">
                  <span>톤 보정</span>
                  <b>{tools.tone}</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tools.tone}
                  onChange={(e) => setTools((t) => ({ ...t, tone: Number(e.target.value) }))}
                  disabled={!originFile}
                />
              </div>
              <div className="weditCorr__slider">
                <div className="weditCorr__sliderRow">
                  <span>채도</span>
                  <b>{tools.shade}</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tools.shade}
                  onChange={(e) => setTools((t) => ({ ...t, shade: Number(e.target.value) }))}
                  disabled={!originFile}
                />
              </div>
            </div>

            <div className="weditCorr__group">
              <div className="weditCorr__groupTitle">디테일</div>
              <div className="weditCorr__slider">
                <div className="weditCorr__sliderRow">
                  <span>선명도</span>
                  <b>{tools.sharp}</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tools.sharp}
                  onChange={(e) => setTools((t) => ({ ...t, sharp: Number(e.target.value) }))}
                  disabled={!originFile}
                />
              </div>
              <div className="weditCorr__slider">
                <div className="weditCorr__sliderRow">
                  <span>부드러움</span>
                  <b>{tools.soft}</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tools.soft}
                  onChange={(e) => setTools((t) => ({ ...t, soft: Number(e.target.value) }))}
                  disabled={!originFile}
                />
              </div>
            </div>

            <div className="weditCorr__saveRow">
              <div className="weditCorr__saveWrap">
                <button
                  type="button"
                  className="weditCorr__saveBtn"
                  disabled={!canSave}
                  onClick={() => setSaveMenuOpen((v) => !v)}
                >
                  {busy.save ? "저장중..." : "저장 ▾"}
                </button>
                {saveMenuOpen && (
                  <div className="weditCorr__saveMenu">
                    <button type="button" onClick={handleSave} disabled={busy.save}>
                      내 앨범에 저장
                    </button>
                    <button type="button" onClick={onDownload} disabled={!afterUrl}>
                      다운로드
                    </button>
                    <button type="button" onClick={() => navigate("/workspace/album")}>
                      내 앨범으로 이동
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="weditCorr__modal" onClick={() => setModal({ open: false, url: null })}>
          <button
            type="button"
            className="weditCorr__modalClose"
            onClick={() => setModal({ open: false, url: null })}
          >
            ×
          </button>
          <div className="weditCorr__modalBody" onClick={(e) => e.stopPropagation()}>
            <img src={modal.url} alt="preview" />
          </div>
        </div>
      )}
    </section>
  );
}
