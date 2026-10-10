import { withBasePath } from "@/lib/paths";

type LogoProps = {
  className?: string;
  /** mono = white+cyan for dark surfaces; mark = navy+cyan for light surfaces */
  variant?: "mark" | "mono";
  title?: string;
  priority?: boolean;
  /** Kept for call-site compatibility */
  idSuffix?: string;
};

/**
 * JDC mark: bold JDC letterforms with cleaning drone fused into the D crown.
 * SVG variants in /public/brand/ (mark, mono, wordmark, favicon).
 * Uses <img> (not next/image) so SVG marks render reliably on static Pages.
 */
export function Logo({
  className = "h-10 w-auto",
  variant = "mark",
  title = "Janssens Drone Cleaning",
  priority = false,
}: LogoProps) {
  const src = withBasePath(
    variant === "mono" ? "/brand/jdc-mono.svg" : "/brand/jdc-mark.svg",
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand mark; basePath via withBasePath
    <img
      src={src}
      alt={title}
      width={320}
      height={180}
      className={className}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
