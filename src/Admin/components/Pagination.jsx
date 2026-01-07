// (하단 페이지네이션)
export default function Pagination({
  page = 1,
  totalPages = 3,
  onChange = () => {},
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button className="pageBtn" onClick={() => onChange(Math.max(1, page - 1))}>
        {"<"}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pageBtn ${p === page ? "active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pageBtn"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
      >
        {">"}
      </button>
    </div>
  );
}
