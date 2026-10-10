import Image from "next/image";
import { withBasePath } from "@/lib/paths";

type LogoProps = {
  className?: string;
  /** mono = white+cyan for dark surfaces; mark = navy+cyan for light surfaces */
  variant?: "mark" | "mono";
  title?: string;
  priority?: boolean;
  /** Kept for call-site compatibility (SVG era); unused with raster mark */
  idSuffix?: string;
};

/**
 * User-supplied BDC mark, improved: transparent crop, navy/white variants,
 * cyan spray accent. Drone fused into the letterforms while cleaning.
 */
export function Logo({
  className = "h-10 w-auto",
  variant = "mark",
  title = "Belgian Drone Cleaning",
  priority = false,
}: LogoProps) {
  const src = withBasePath(
    variant === "mono"
      ? "/brand/bdc-logo-white-cyan.png"
      : "/brand/bdc-logo.png",
  );

  return (
    <Image
      src={src}
      alt={title}
      width={994}
      height={499}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
