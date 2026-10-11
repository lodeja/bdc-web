import { serviceSurface, photoReady } from "@/config/images";
import type { ServiceId } from "@/config/services";
import { withBasePath } from "@/lib/paths";
import { ServiceSketch } from "./ServiceSketch";

/**
 * Photo slot when the owner has set one. Otherwise the line illustration.
 * A schematic has no per-drawing caption; pass `caption` for one note.
 */
export function ServiceFigure({
  id,
  caption,
  label,
}: {
  id: ServiceId;
  caption?: string;
  /** Plate number shown in the frame footer, e.g. "Fig. 01". */
  label?: string;
}) {
  const slot = serviceSurface(id);
  if (photoReady(slot)) {
    return (
      <figure className="m-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, sized slot */}
        <img
          src={withBasePath(slot.src)}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </figure>
    );
  }

  return (
    <figure className="m-0 border border-jdc-navy/15 bg-white">
      <div className="px-5 pt-6 pb-4">
        <ServiceSketch id={id} />
      </div>
      {caption || label ? (
        <figcaption className="flex items-center justify-between gap-4 border-t border-jdc-navy/10 px-5 py-3 text-xs">
          <span className="font-semibold tracking-[0.14em] text-jdc-cyan-ink uppercase">
            {label ?? ""}
          </span>
          <span className="text-jdc-slate">{caption ?? ""}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
