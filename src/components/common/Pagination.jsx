import { Button } from "../ui/button";

export function Pagination({ totalPages, currentPage, onPageChange }) {
  const visiblePages = 5; // Số trang hiển thị tối đa
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex space-x-2 items-center">
      {/* Nút Previous */}
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </Button>

      {/* Danh sách số trang */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "ghost"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Nút Next */}
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </Button>
    </div>
  );
}
