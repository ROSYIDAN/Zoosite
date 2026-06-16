import { cn } from "@/lib/utils";

interface AnimalCardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ELLIPSIS_THRESHOLD = 7;

function shouldShowPageButton(page: number, currentPage: number, totalPages: number) {
  return (
    page === 1 ||
    page === totalPages ||
    (page >= currentPage - 1 && page <= currentPage + 1)
  );
}

export default function AnimalCardPagination({ currentPage, totalPages, onPageChange }: AnimalCardPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
          currentPage === 1
            ? "border-outline-variant/30 text-outline-variant/30 cursor-not-allowed"
            : "border-outline-variant hover:bg-surface-container text-primary"
        )}
        aria-label="Previous Page"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (totalPages > ELLIPSIS_THRESHOLD) {
            if (shouldShowPageButton(page, currentPage, totalPages)) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "w-10 h-10 rounded-full font-medium text-sm transition-colors",
                    currentPage === page
                      ? "bg-primary text-on-primary"
                      : "hover:bg-surface-container text-on-surface"
                  )}
                >
                  {page}
                </button>
              );
            }

            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="w-10 h-10 flex items-center justify-center text-on-surface-variant">
                  ...
                </span>
              );
            }

            return null;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-10 h-10 rounded-full font-medium text-sm transition-colors",
                currentPage === page
                  ? "bg-primary text-on-primary"
                  : "hover:bg-surface-container text-on-surface"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
          currentPage === totalPages
            ? "border-outline-variant/30 text-outline-variant/30 cursor-not-allowed"
            : "border-outline-variant hover:bg-surface-container text-primary"
        )}
        aria-label="Next Page"
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  );
}
