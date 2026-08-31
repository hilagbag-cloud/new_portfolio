"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";

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

          <div className="flex items-center gap-2.5">
            {/* Desktop Contact CTA */}
            <a
              href={site.nav.contact.href}
              className="hidden md:inline-flex btn-skew focus-ring py-2 px-4 text-xs"
            >
              <span>{site.nav.contact.label.toUpperCase()}</span>
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>

            {/* Mobile Contact Pill Button */}
            <a
              href={site.nav.contact.href}
              className="md:hidden inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-text hover:border-accent hover:text-accent transition-colors active:scale-95 shadow-xs"
            >
              <span>LET&apos;S BUILD</span>
            </a>

            {/* Mobile Menu Icon Button (Icon only) */}
            <button
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-border bg-surface/90 text-text hover:border-accent hover:text-accent transition-all focus-ring active:scale-95 shadow-xs"
              id="mobile-nav-toggle-btn"
            >
              {menuOpen ? (
                <X size={19} strokeWidth={2.2} />
              ) : (
                <Menu size={19} strokeWidth={2.2} />
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg/98 backdrop-blur-2xl md:hidden overflow-y-auto px-6 py-20"
          >
            {/* Top Close Bar in Drawer */}
            <div className="absolute top-6 right-6">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-surface text-text hover:border-accent hover:text-accent transition-all focus-ring"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
                hidden: {},
              }}
              className="flex flex-col items-start justify-center gap-1 my-auto w-full"
            >
              {site.nav.links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="block w-full py-3.5 font-display text-3xl sm:text-4xl text-text hover:text-accent transition-colors focus-ring"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="pt-8 border-t border-border flex flex-col gap-4 w-full"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow text-xs text-muted">Mode Visuel</span>
                <ThemeToggle variant="compact" />
              </div>

              <a
                href={site.nav.contact.href}
                onClick={handleLinkClick}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-mono text-xs font-bold text-accent-contrast focus-ring shadow-lg hover:opacity-95 transition-opacity"
              >
                <span>CONTACTER LE STUDIO</span>
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
