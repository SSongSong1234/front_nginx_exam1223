import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAlbum, toggleFavorite, deleteAlbum } from "../../../api/album";
import { useAuth } from "../../../contexts/auth.jsx";
import "./WorkspaceAlbum.css";
const makeSvg = (title, accent = "#35C2FF") => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0B1220"/>
        <stop offset="1" stop-color="${accent}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="40" y="40" width="720" height="520" rx="28" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.12)"/>
    <text x="80" y="140" font-size="44" fill="rgba(255,255,255,0.92)" font-family="system-ui, -apple-system, Segoe UI, Roboto">WED:IT</text>
    <text x="80" y="210" font-size="22" fill="rgba(255,255,255,0.70)" font-family="system-ui, -apple-system, Segoe UI, Roboto">Album Dummy</text>
    <text x="80" y="360" font-size="34" fill="rgba(255,255,255,0.92)" font-family="system-ui, -apple-system, Segoe UI, Roboto">${title}</text>
    <text x="80" y="420" font-size="18" fill="rgba(255,255,255,0.65)" font-family="system-ui, -apple-system, Segoe UI, Roboto">API 연결 전 레이아웃 확인용</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const DUMMY_ALBUM = [
  {
    id: "dummy-1",
    title: "샘플 01",
    status: "완료",
    thumbUrl: makeSvg("샘플 01", "#35C2FF"),
    imageUrl: makeSvg("샘플 01", "#35C2FF"),
    createdAt: "2026-01-07",
  },
  {
    id: "dummy-2",
    title: "샘플 02",
    status: "완료",
    thumbUrl: makeSvg("샘플 02", "#A78BFA"),
    imageUrl: makeSvg("샘플 02", "#A78BFA"),
    createdAt: "2026-01-06",
  },
  {
    id: "dummy-3",
    title: "샘플 03",
    status: "처리중",
    thumbUrl: makeSvg("샘플 03", "#34D399"),
    imageUrl: makeSvg("샘플 03", "#34D399"),
    createdAt: "2026-01-05",
  },
  {
    id: "dummy-4",
    title: "샘플 04",
    status: "완료",
    thumbUrl: makeSvg("샘플 04", "#F59E0B"),
    imageUrl: makeSvg("샘플 04", "#F59E0B"),
    createdAt: "2026-01-04",
  },
];


function safeFirstArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}

function mapAlbumItem(item) {
  return {
    id: item?.id ?? item?.album_id ?? String(Math.random()),
    title: item?.title ?? item?.name ?? item?.file_name ?? "(untitled)",
    thumbUrl: item?.thumb_url ?? item?.thumbnail_url ?? item?.after_url ?? item?.image_url ?? null,
    imageUrl: item?.after_url ?? item?.image_url ?? item?.url ?? null,
    status: item?.status ?? "완료",
    favorite: !!(item?.favorite ?? item?.is_favorite),
    createdAt: item?.createdAt ?? item?.created_at ?? null,
    raw: item,
  };
}

export default function WorkspaceAlbum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.user_id || user?.username;

  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all"); // all | fav
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);
  const [modal, setModal] = useState({ open: false, url: null, title: null, id: null });

  const closeModal = () => setModal({ open: false, url: null, title: null, id: null });

  const downloadFromUrl = async (url, filename = "wedit_image") => {
    if (!url) return;

    // data URL이면 바로 다운로드
    if (typeof url === "string" && url.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    // 외부 URL은 CORS 때문에 download 속성이 안 먹을 수 있어서 fetch->blob 시도
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // 최후 fallback: 새 탭 열기
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    (async () => {
      if (!userId) return;
      try {
        const data = await listAlbum(userId);
        const list = safeFirstArray(data?.items ?? data?.list ?? data).map(mapAlbumItem);
        setItems(list);
        if ((import.meta.env.VITE_USE_DUMMY_ALBUM === "1" || import.meta.env.DEV) && list.length === 0) {
          setItems(DUMMY_ALBUM);
          setMessage("API 미연결: 더미 앨범을 표시중입니다.");
        }
      } catch (e) {
        if (import.meta.env.VITE_USE_DUMMY_ALBUM === "1" || import.meta.env.DEV) {
          setItems(DUMMY_ALBUM);
          setMessage("API 미연결: 더미 앨범을 표시중입니다.");
        } else {
          setMessage(e?.friendlyMessage || "앨범을 불러오지 못했습니다.");
        }
      }
    })();
  }, [userId]);

  const filtered = useMemo(() => {
    if (tab === "fav") return items.filter((i) => i.favorite);
    return items;
  }, [items, tab]);

  const onToggleFav = async (it) => {
    if (!userId) return;
    setMessage(null);
    setBusyId(it.id);
    try {
      await toggleFavorite({ user_id: userId, album_id: it.id, favorite: !it.favorite });
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, favorite: !p.favorite } : p)));
    } catch (e) {
      setMessage(e?.friendlyMessage || "즐겨찾기 변경에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (it) => {
    if (!userId) return;
    if (!window.confirm("정말 삭제할까요?")) return;
    setMessage(null);
    setBusyId(it.id);
    try {
      await deleteAlbum({ user_id: userId, album_id: it.id });
      setItems((prev) => prev.filter((p) => p.id !== it.id));
    } catch (e) {
      setMessage(e?.friendlyMessage || "삭제에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="weditAlb">
      <div className="weditAlb__header">
        <div>
          <div className="weditAlb__title">프로필</div>
          <div className="weditAlb__sub">요약 + 갤러리</div>
        </div>

        <div className="weditAlb__tabs">
          <button
            type="button"
            className={`weditAlb__tab ${tab === "all" ? "isActive" : ""}`}
            onClick={() => setTab("all")}
          >
            전체
          </button>
          <button
            type="button"
            className={`weditAlb__tab ${tab === "fav" ? "isActive" : ""}`}
            onClick={() => setTab("fav")}
          >
            즐겨찾기
          </button>
        </div>
      </div>

      <div className="weditAlb__summary">
        <div className="weditAlb__stat">
          <span>총 보정</span>
          <b>{items.length.toString().padStart(2, "0")}</b>
        </div>
        <div className="weditAlb__stat">
          <span>이번 달</span>
          <b>00</b>
        </div>
        <div className="weditAlb__stat">
          <span>저장됨</span>
          <b>{items.length.toString().padStart(2, "0")}</b>
        </div>
      </div>

      {message && <div className="weditAlb__message">{message}</div>}

      <div className="weditAlb__grid">
        {filtered.length === 0 ? (
          <div className="weditAlb__empty">저장된 이미지가 없습니다.</div>
        ) : (
          filtered.map((it) => (
            <div key={it.id} className="weditAlb__card">
              <button
                type="button"
                className="weditAlb__thumb"
                onClick={() =>
                  setModal({
                    open: true,
                    url: it.imageUrl || it.thumbUrl,
                    title: it.title,
                    id: it.id,
                  })
                }
                title="확대보기"
              >
                {it.thumbUrl ? <img src={it.thumbUrl} alt={it.title} /> : <div className="weditAlb__thumbPh" />}
              </button>

              <div className="weditAlb__badge">{it.status}</div>

              <div className="weditAlb__cardActions">
                <button
                  type="button"
                  className={`weditAlb__iconBtn ${it.favorite ? "isOn" : ""}`}
                  onClick={() => onToggleFav(it)}
                  disabled={busyId === it.id}
                  title="즐겨찾기"
                >
                  ★
                </button>
                <button
                  type="button"
                  className="weditAlb__iconBtn"
                  onClick={() => onDelete(it)}
                  disabled={busyId === it.id}
                  title="삭제"
                >
                  🗑
                </button>
              </div>

              <div className="weditAlb__cardTitle" title={it.title}>
                {it.title}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="weditAlb__footNote">
        ※ AI로 보정된 이미지를 다시 재보정할 경우 부자연스러워질 수 있습니다.
      </div>

      {modal.open && (
        <div className="weditAlb__modal" onClick={closeModal}>
          <button
            type="button"
            className="weditAlb__modalClose"
            onClick={closeModal}
          >
            ×
          </button>
          <div className="weditAlb__modalBody" onClick={(e) => e.stopPropagation()}>
            <div className="weditAlb__modalTitle">{modal.title}</div>
            <img src={modal.url} alt="preview" />

            {/* ✅ 우측 하단 액션 버튼 2개: 다운로드 / 보정페이지 이동 */}
            <div className="weditAlb__modalActions">
              <button
                type="button"
                className="weditAlb__modalActionBtn"
                onClick={() => downloadFromUrl(modal.url, modal.title || "wedit")}
                title="다운로드"
              >
                ⬇
              </button>
              <button
                type="button"
                className="weditAlb__modalActionBtn isPrimary"
                onClick={() => {
                  closeModal();
                  navigate("/workspace/library", {
                    state: { imageUrl: modal.url, title: modal.title, source: "album", albumId: modal.id },
                  });
                }}
                title="라이브러리 보정"
              >
                ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}