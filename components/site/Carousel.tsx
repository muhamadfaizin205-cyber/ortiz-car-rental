"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  itemCount: number;
}

export default function Carousel({ children, itemCount }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [progress, setProgress] = useState(0);

  function updateState() {
    const el = ref.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < maxScroll - 10);
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [itemCount]);

  function scroll(dir: "left" | "right") {
    const el = ref.current;
    if (!el) return;
    const cardWidth = 340;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  }

  if (itemCount === 0) return null;

  return (
    <div className="relative group">
      {/* Scroll container */}
      <div
        ref={ref}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {children}
      </div>

      {/* Left arrow */}
      {canLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 sm:w-12 sm:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-dark hover:bg-gold hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 sm:opacity-80"
          aria-label="Scroll left"
        >
          <i className="ri-arrow-left-s-line text-xl" />
        </button>
      )}

      {/* Right arrow */}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 sm:w-12 sm:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-dark hover:bg-gold hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 sm:opacity-80"
          aria-label="Scroll right"
        >
          <i className="ri-arrow-right-s-line text-xl" />
        </button>
      )}

      {/* Progress bar + swipe hint */}
      <div className="flex items-center justify-between mt-3 px-1">
        {/* Progress bar */}
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
          <div
            className="h-full bg-gold rounded-full transition-all duration-200"
            style={{ width: `${Math.max(15, progress * 100)}%` }}
          />
        </div>

        {/* Swipe hint (mobile) / arrow hint (desktop) */}
        <span className="text-xs text-gray-400 flex items-center gap-1 ml-3">
          <i className="ri-arrow-left-right-line text-gold" />
          <span className="hidden sm:inline">Scroll</span>
          <span className="sm:hidden">Geser</span>
        </span>
      </div>
    </div>
  );
}
