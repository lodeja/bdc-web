import { serviceSurface, photoReady } from "@/config/images";
import type { ServiceId } from "@/config/services";
import { withBasePath } from "@/lib/paths";
import { ServiceSketch } from "./ServiceSketch";

/** Photo slot when the owner has set one. Otherwise the line illustration. */
export function ServiceFigure({ id, caption }: { id: ServiceId; caption?: string }) {
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
    <figure className="m-0">
      <ServiceSketch id={id} />
      <figcaption className="mt-3 text-xs leading-relaxed text-jdc-slate">
        {caption ?? "Illustratie — geen echte projectfoto."}
      </figcaption>
    </figure>
  );
}
