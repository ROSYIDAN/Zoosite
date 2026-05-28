"use client";

import React, { useRef, useState, useEffect } from "react";

export default function AutoPagination({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = React.Children.count(children);

  const calculateCurrentPage = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      if (clientWidth > 0) {
        const page = Math.round(scrollLeft / clientWidth);
        setCurrentPage(page);
      }
    }
  };


  useEffect(() => {
    window.addEventListener("resize", calculateCurrentPage);
    return () => {
      window.removeEventListener("resize", calculateCurrentPage);
    };
  }, []);


  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => calculateCurrentPage());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);


  const handleScroll = () => {
    calculateCurrentPage();
  };


  const scrollToPage = (page: number) => {
    if (containerRef.current && totalPages > 1) {
      const { clientWidth } = containerRef.current;
      const targetPage = Math.max(0, Math.min(page, totalPages - 1));

      containerRef.current.scrollTo({
        left: targetPage * clientWidth,
        behavior: "smooth",
      });

      setCurrentPage(targetPage);
    }
  };


  return (
    <div className={`relative flex flex-col h-full w-full max-w-full group ${className}`}>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          maxHeight: "max-content",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className="w-full flex-shrink-0 snap-start snap-always pr-8">
            {child}
          </div>
        ))}
      </div>


      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20 fade-in">
          <button
            onClick={() => scrollToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === 0
              ? "opacity-30 cursor-not-allowed text-on-surface-variant"
              : "hover:bg-primary/10 text-primary bg-surface-container-high cursor-pointer"
              }`}
            aria-label="Previous Page"
          >
            ←
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === i
                  ? "bg-primary scale-125"
                  : "bg-on-surface-variant/30 hover:bg-on-surface-variant/50"
                  }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => scrollToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === totalPages - 1
              ? "opacity-30 cursor-not-allowed text-on-surface-variant"
              : "hover:bg-primary/10 text-primary bg-surface-container-high cursor-pointer"
              }`}
            aria-label="Next Page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
