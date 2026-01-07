// (필터/검색 흰 바)
/**
 * ✅ PanelHeader: 예시처럼 "필터/검색 흰색 바"를 공통으로 사용
 * - 페이지에서 필요할 때만 사용하면 됨
 */
export default function PanelHeader({ children, className = "" }) {
  return <section className={`panel panelHeader ${className}`}>{children}</section>;
}
