import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
  tone?: "fog" | "white" | "navy";
  className?: string;
};

export function SectionShell({
  id,
  title,
  lead,
  children,
  tone = "fog",
  className = "",
}: SectionShellProps) {
  const toneClass =
    tone === "navy"
      ? "bg-jdc-navy-deep text-white"
      : tone === "white"
        ? "bg-white text-jdc-ink"
        : "bg-jdc-fog text-jdc-ink";

  return (
    <section
      id={id}
      className={`scroll-mt-[var(--header-height)] border-t border-jdc-navy/10 ${toneClass} ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id={`${id}-heading`}
            className={`jdc-display text-balance text-4xl sm:text-5xl ${
              tone === "navy" ? "text-white" : "text-jdc-navy"
            }`}
          >
            {title}
          </h2>
          {lead ? (
            <p
              className={`mt-4 text-pretty text-base leading-relaxed sm:text-lg ${
                tone === "navy" ? "text-[#d5e2ee]" : "text-jdc-slate"
              }`}
            >
              {lead}
            </p>
          ) : null}
        </div>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
