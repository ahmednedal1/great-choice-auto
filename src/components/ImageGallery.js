"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

export default function ImageGallery({ images = [], alt = "", sold = false }) {
  const safeImages = images.length
    ? images
    : [{ image_url: "/placeholder-car.svg" }];

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef(null);

  const count = safeImages.length;

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;

    function onKey(e) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, next, prev]);

  // Swipe support for touch devices
  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchX.current = null;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label="Open full-size image"
        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/20 group cursor-zoom-in block"
      >
        <Image
          src={safeImages[active].image_url}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {sold && (
          <span className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            Sold
          </span>
        )}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Expand size={14} /> View
        </span>
        {count > 1 && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {active + 1} / {count}
          </span>
        )}
      </button>

      {count > 1 && (
        <div className="gc-scroll flex gap-3 mt-3 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/20 transition-all ${
                i === active
                  ? "ring-2 ring-brand-red"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.image_url}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="gc-backdrop fixed inset-0 z-[100] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
        >
          <div className="flex justify-between items-center p-4 text-white">
            <span className="text-sm font-semibold">
              {active + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close"
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center px-2 sm:px-4 pb-4 select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative w-full h-full max-w-5xl">
              <Image
                src={safeImages[active].image_url}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div
              className="gc-scroll flex gap-2 justify-start sm:justify-center p-4 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative w-16 h-12 flex-shrink-0 rounded overflow-hidden transition-all ${
                    i === active
                      ? "ring-2 ring-brand-red"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
