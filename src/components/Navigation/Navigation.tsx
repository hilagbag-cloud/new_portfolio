"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-bg/85 backdrop-blur-md border-b border-border/80 py-3 shadow-lg"
            : "bg-transparent py-6"
        )}
      >
        <nav className="section-shell flex items-center justify-between">
          <a
            href="#top"
            className="group font-display text-xl tracking-tight text-text focus-ring flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="group-hover:text-accent transition-colors">{site.nav.brand}</span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {site.nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="eyebrow text-muted hover:text-accent transition-colors focus-ring relative py-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={site.nav.contact.href}
            className="hidden md:inline-flex btn-skew focus-ring py-2 px-4 text-xs"
          >
            <span>{site.nav.contact.label.toUpperCase()}</span>
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center gap-2 eyebrow text-text focus-ring p-2"
          >
            {menuOpen ? "FERMER" : "MENU"}
            {menuOpen ? (
              <X size={18} strokeWidth={2} />
            ) : (
              <Menu size={18} strokeWidth={2} />
            )}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                hidden: {},
              }}
              className="flex h-full flex-col items-start justify-center gap-3 section-shell"
            >
              {site.nav.links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="font-display text-4xl text-text hover:text-accent transition-colors focus-ring"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3 }}
                className="pt-6"
              >
                <a
                  href={site.nav.contact.href}
                  onClick={handleLinkClick}
                  className="inline-flex items-center gap-2 rounded-btn bg-accent px-6 py-3 eyebrow text-bg font-bold focus-ring shadow-lg"
                >
                  CONTACTER
                  <ArrowUpRight size={14} strokeWidth={2} />
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
