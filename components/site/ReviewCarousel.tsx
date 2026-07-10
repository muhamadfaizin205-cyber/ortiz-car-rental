"use client";
import { useRef, useEffect, useState } from "react";

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !shouldAutoScroll) return;

    const speed = 0.5;
    let animId: number;

    function step() {
      if (!el || paused) {
        animId = requestAnimationFrame(step);
        return;
      }

      el.scrollLeft += speed;

      const halfWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft = 0;
      }

      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused, shouldAutoScroll]);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <i className="ri-star-smile-line text-4xl block mb-3" />
        <p>No reviews yet</p>
      </div>
    );
  }

  // Only auto-scroll if 4+ reviews, otherwise show static
  const shouldAutoScroll = reviews.length >= 4;

  // Duplicate for seamless loop (only if auto-scrolling)
  const items = shouldAutoScroll ? [...reviews, ...reviews] : reviews;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 3000)}
    >
      {/* Fade edges - only for auto-scroll */}
      {shouldAutoScroll && <>
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </>}

      {/* Scrolling container */}
      <div
        ref={scrollRef}
        className={`flex gap-5 ${shouldAutoScroll ? "overflow-x-hidden" : "overflow-x-auto justify-center flex-wrap px-4 sm:px-6"}`}
        style={{ scrollBehavior: "auto" }}
      >
        {items.map((review, idx) => (
          <div
            key={`${review.id}-${idx}`}
            className="min-w-[300px] sm:min-w-[340px] max-w-[360px] flex-shrink-0"
          >
            <div className="bg-light rounded-2xl p-6 border border-gray-100 h-full flex flex-col">
              {/* Header: avatar + name + stars */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                  {review.customer_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-dark text-sm">{review.customer_name}</p>
                    <i className="ri-verified-badge-fill text-blue-500 text-xs" />
                  </div>
                  <div className="flex mt-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <i key={i} className={`text-sm ${i <= review.rating ? "ri-star-fill text-gold" : "ri-star-line text-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{review.comment}&rdquo;</p>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
                {new Date(review.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
