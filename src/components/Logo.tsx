import { withBasePath } from "@/lib/paths";

type LogoProps = {
  className?: string;
  /**
   * mono — white mark for dark surfaces (header/hero/footer)
   * mark — navy ink mark for light surfaces
   * wordmark — full logo including “JANSSENS DRONE CLEANING” (dark surfaces)
   */
  variant?: "mark" | "mono" | "wordmark";
  title?: string;
  priority?: boolean;
  /** Kept for call-site compatibility */
  idSuffix?: string;
};

/**
 * Official JDC logo (user-supplied): drone fused into JDC letterforms + spray.
 * Transparent PNGs in /public/brand/ — served via withBasePath for GitHub Pages.
 */
export function Logo({
  className = "h-10 w-auto",
  variant = "mono",
  title = "Janssens Drone Cleaning",
  priority = false,
}: LogoProps) {
  const file =
    variant === "wordmark"
      ? "/brand/jdc-wordmark.png"
      : variant === "mark"
        ? "/brand/jdc-mark-dark.png"
        : "/brand/jdc-mono.png";

  const src = withBasePath(file);

  // Intrinsic sizes match cropped assets (approx) for layout stability
  const size =
    variant === "wordmark"
      ? { width: 750, height: 756 }
      : { width: 750, height: 429 };

  return (
    // eslint-disable-next-line @next/next/no-img-element -- PNG brand mark; basePath via withBasePath
    <img
      src={src}
      alt={title}
      width={size.width}
      height={size.height}
      className={className}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
