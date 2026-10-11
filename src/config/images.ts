import type { ServiceId } from "@/config/services";

/**
 * Slots for real photos. Leave `src` null until a file exists.
 *
 * Drop the file in `public/` (for example `public/photos/hero.webp`) and set
 * `src` to the root path (`/photos/hero.webp`) plus a truthful `alt`.
 * Width and height are the file’s pixel size. Do not use stock photos of
 * third parties. While `src` is null the page keeps its own illustrations.
 */

export type PhotoSlot = {
  id: string;
  /** Root path under public/, or null while the slot is empty. */
  src: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
};

export type BeforeAfterSlot = {
  id: string;
  /** Shown under the pair. Say when it is still an illustration. */
  caption: string;
  before: PhotoSlot;
  after: PhotoSlot;
};

export type ImageManifest = {
  hero: PhotoSlot;
  beforeAfter: BeforeAfterSlot[];
  projects: PhotoSlot[];
  team: PhotoSlot;
  drone: PhotoSlot;
  /** One surface photo per confirmed service. Null until the owner adds a file. */
  serviceSurfaces: Record<ServiceId, PhotoSlot>;
};

function emptySlot(id: string): PhotoSlot {
  return { id, src: null, alt: null, width: null, height: null };
}

export const images: ImageManifest = {
  hero: {
    id: "hero",
    src: null,
    alt: null,
    width: null,
    height: null,
  },
  beforeAfter: [
    {
      id: "panels",
      caption: "Illustratie — geen echte projectfoto.",
      before: {
        id: "panels-before",
        src: null,
        alt: null,
        width: null,
        height: null,
      },
      after: {
        id: "panels-after",
        src: null,
        alt: null,
        width: null,
        height: null,
      },
    },
  ],
  projects: [],
  team: {
    id: "team",
    src: null,
    alt: null,
    width: null,
    height: null,
  },
  drone: {
    id: "drone",
    src: null,
    alt: null,
    width: null,
    height: null,
  },
  serviceSurfaces: {
    dak: emptySlot("service-dak"),
    gevel: emptySlot("service-gevel"),
    ramen: emptySlot("service-ramen"),
    zonnepanelen: emptySlot("service-zonnepanelen"),
    industrie: emptySlot("service-industrie"),
  },
};

export function serviceSurface(id: ServiceId): PhotoSlot {
  return images.serviceSurfaces[id];
}

export function photoReady(
  slot: PhotoSlot | null | undefined,
): slot is PhotoSlot & { src: string; alt: string; width: number; height: number } {
  return Boolean(
    slot &&
      slot.src?.trim() &&
      slot.alt?.trim() &&
      slot.width &&
      slot.height,
  );
}
