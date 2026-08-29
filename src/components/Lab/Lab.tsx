import { ArrowUpRight } from "lucide-react";
import { experiments } from "@/data/experiments";

export function Lab() {
  return (
    <section id="lab" className="section-shell py-24 md:py-32">
      <div className="mb-14 md:mb-16">
        <div className="eyebrow mb-4">The Lab</div>
        <h2 className="font-display text-4xl text-text sm:text-5xl">
          Ce qui se construit en ce moment
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h3 className="eyebrow mb-5 text-muted">Currently exploring</h3>
          <ul className="flex flex-wrap gap-3">
            {experiments.exploring.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-text"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 text-muted">Currently building</h3>
          <ul className="space-y-3">
            {experiments.building.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 font-display text-xl text-text transition-colors hover:text-accent"
                  >
                    {item.label}
                    <ArrowUpRight size={16} strokeWidth={1.75} />
                  </a>
                ) : (
                  <span className="font-display text-xl text-muted">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
