"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

export function MobileFloatingCta() {
  const [visible, setVisible] = useState(false);
  const [nearContact, setNearContact] = useState(false);

  useEffect(() => {
    // Show after slight initial scroll or slight delay for smooth entry
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setVisible(true);
      } else {
        // also keep visible on short screens
        setVisible(true);
      }

      // Check if user is already at the bottom near contact form to avoid overlap
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && rect.bottom > 150) {
          setNearContact(true);
        } else {
          setNearContact(false);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#contact";
    }
  };

  return (
    <AnimatePresence>
      {visible && !nearContact && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-4 z-40 md:hidden pointer-events-auto"
          id="mobile-floating-cta-container"
        >
          <a
            href="#contact"
            onClick={handleClick}
            className="group relative flex items-center gap-2 rounded-full border border-accent/50 bg-bg/95 px-4 py-2.5 text-text backdrop-blur-md shadow-md transition-all duration-300 active:scale-95 focus-ring"
            aria-label="Discuter d'un projet — Let's Build"
            id="mobile-lets-build-btn"
          >
            {/* Static accent dot */}
            <span className="h-2 w-2 rounded-full bg-accent inline-block shrink-0" />

            {/* CTA Label */}
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text group-hover:text-accent transition-colors">
              LET&apos;S BUILD
            </span>

            {/* Icon */}
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-black transition-transform group-hover:rotate-45">
              <ArrowUpRight size={12} strokeWidth={2.5} className="text-black" />
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
