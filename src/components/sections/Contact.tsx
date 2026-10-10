import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { QuoteForm } from "../QuoteForm";
import { SectionShell } from "../SectionShell";

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
  emptyHint,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  emptyHint: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-bdc-navy-deep text-bdc-cyan">
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wide text-bdc-slate uppercase">
          {label}
        </p>
        {value ? (
          href ? (
            <a
              href={href}
              className="mt-0.5 text-sm font-medium text-bdc-navy hover:text-bdc-cyan-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
            >
              {value}
            </a>
          ) : (
            <p className="mt-0.5 text-sm font-medium text-bdc-navy">{value}</p>
          )
        ) : (
          <p className="mt-0.5 text-sm text-bdc-slate/80 italic">{emptyHint}</p>
        )}
      </div>
    </div>
  );
}

export function Contact() {
  const address = [CONTACT.street, CONTACT.city].filter(Boolean).join(", ");

  return (
    <SectionShell
      id="contact"
      title="Contact & offerte"
      lead="Vertel ons kort wat u nodig heeft. We reageren met een haalbaarheidsinschatting of een gerichte offerte."
      tone="white"
    >
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <div className="space-y-6 lg:col-span-2">
          <ContactLine
            icon={Mail}
            label="E-mail"
            value={CONTACT.email}
            href={CONTACT.email ? `mailto:${CONTACT.email}` : undefined}
            emptyHint="TODO: e-mailadres invullen in src/lib/contact.ts"
          />
          <ContactLine
            icon={Phone}
            label="Telefoon"
            value={CONTACT.phone}
            href={CONTACT.phone ? `tel:${CONTACT.phone.replace(/\s/g, "")}` : undefined}
            emptyHint="TODO: telefoonnummer invullen in src/lib/contact.ts"
          />
          <ContactLine
            icon={MapPin}
            label="Adres"
            value={address}
            emptyHint="TODO: adres / werkgebied invullen in src/lib/contact.ts"
          />

          <div className="rounded-sm border border-dashed border-bdc-navy/20 bg-bdc-fog px-4 py-3 text-xs leading-relaxed text-bdc-slate">
            {/* TODO: BTW, RPR, verzekeringsinfo wanneer beschikbaar */}
            Ondernemingsgegevens (BTW, RPR) en verzekeringsinfo volgen hier
            wanneer ze officieel beschikbaar zijn. Geen placeholder-nummers.
            {CONTACT.vat ? (
              <p className="mt-2 font-medium text-bdc-navy">BTW: {CONTACT.vat}</p>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-3">
          <QuoteForm />
        </div>
      </div>
    </SectionShell>
  );
}
