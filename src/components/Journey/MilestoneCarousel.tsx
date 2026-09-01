"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";
import type { MilestoneGalleryItem } from "@/data/milestones";

interface MilestoneCarouselProps {
  gallery: MilestoneGalleryItem[];
  milestoneTitle: string;
  isActive?: boolean;
  onOpenModal?: () => void;
}

export function MilestoneCarousel({
  gallery,
  milestoneTitle,
  isActive = true,
  onOpenModal,
}: MilestoneCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const total = gallery.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch swipe support (Mobile friendly)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diffX > minSwipeDistance) {
      // Swiped left -> next
      nextSlide();
    } else if (diffX < -minSwipeDistance) {
      // Swiped right -> prev
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Reset index when gallery changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [gallery]);

  // Autoplay when active, visible, and not hovered/reduced motion
  useEffect(() => {
    if (!isActive || isHovered || total <= 1 || reducedMotion) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isActive, isHovered, nextSlide, total, reducedMotion]);

  if (!gallery || gallery.length === 0) return null;

  const currentItem = gallery[currentIndex];

  return (
    <div
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-2.5 sm:p-4 transition-all duration-300 hover:border-accent/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id={`carousel-${milestoneTitle.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Main Image Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/60 touch-pan-y">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentItem.url}-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full"
          >
            <Image
              src={currentItem.url}
              alt={currentItem.alt || milestoneTitle}
              fill
              unoptimized={currentItem.url.startsWith("data:")}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              priority={currentIndex === 0}
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white backdrop-blur-md">
            <Sparkles size={11} className="text-accent" />
            <span>{currentItem.tag}</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            {onOpenModal && (
              <button
                type="button"
                onClick={onOpenModal}
                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/90 backdrop-blur-md transition-colors hover:border-accent hover:text-accent focus-ring"
                aria-label="Agrandir et voir les détails"
                title="Agrandir l'image et voir les détails"
              >
                <Maximize2 size={13} />
              </button>
            )}
            <div className="rounded-full border border-white/20 bg-black/80 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] text-white/80 backdrop-blur-md">
              <span className="text-accent font-semibold">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="mx-1">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows (Touch friendly >= 44px) */}
        {total > 1 && (
          <div className="absolute inset-y-0 left-1 right-1 sm:left-2 sm:right-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={prevSlide}
              className="pointer-events-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-black/85 text-white backdrop-blur-md opacity-90 transition-all hover:scale-110 hover:border-accent hover:bg-black hover:text-accent hover:opacity-100 active:scale-95 focus-ring"
              aria-label="Image précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="pointer-events-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-black/85 text-white backdrop-blur-md opacity-90 transition-all hover:scale-110 hover:border-accent hover:bg-black hover:text-accent hover:opacity-100 active:scale-95 focus-ring"
              aria-label="Image suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Caption Overlay on Bottom of Image */}
        <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <p className="text-xs sm:text-sm text-white font-medium line-clamp-2">
            {currentItem.caption}
          </p>
        </div>
      </div>

      {/* Thumbnails Row */}
      {total > 1 && (
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2 pt-1.5 border-t border-border/50">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {gallery.map((item, idx) => (
              <button
                key={`${item.url}-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-11 w-14 sm:h-12 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                  idx === currentIndex
                    ? "border-accent ring-1 ring-accent opacity-100 scale-105"
                    : "border-border/60 opacity-60 hover:opacity-100 hover:border-border"
                }`}
                aria-label={`Afficher l'image ${idx + 1}: ${item.caption}`}
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  unoptimized={item.url.startsWith("data:")}
                  className="object-cover"
                  sizes="80px"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Quick Dots / Indicator */}
          <div className="flex items-center gap-1 pl-2">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-5 bg-accent" : "w-1.5 bg-border hover:bg-muted"
                }`}
                aria-label={`Diapositive ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
