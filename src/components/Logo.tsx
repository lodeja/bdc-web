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
  /** Kept for call-site compatibility */
  idSuffix?: string;
};

/**
 * Official JDC logo (user-supplied): drone fused into JDC letterforms + spray.
 * Sized WebP in /public/brand/ — served via withBasePath for GitHub Pages.
 * Original PNGs live in design/brand/archive and are not deployed.
 */
export function Logo({
  className = "h-10 w-auto",
  variant = "mono",
  title = "Janssens Drone Cleaning",
}: LogoProps) {
  const file =
    variant === "wordmark"
      ? "/brand/jdc-wordmark.webp"
      : variant === "mark"
        ? "/brand/jdc-mono.webp"
        : "/brand/jdc-mono.webp";

  const src = withBasePath(file);

  // Same aspect ratio as the archived PNGs, exported near the CSS display size.
  const size =
    variant === "wordmark"
      ? { width: 430, height: 433 }
      : { width: 240, height: 137 };

  return (
    // eslint-disable-next-line @next/next/no-img-element -- sized WebP; basePath via withBasePath
    <img
      src={src}
      alt={title}
      width={size.width}
      height={size.height}
      className={className}
      decoding="async"
      loading="lazy"
    />
  );
}
