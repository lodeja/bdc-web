import { Mail, MapPin, Phone } from "lucide-react";
import { business, filled, formatAddress } from "@/config/business";
import { QuoteForm } from "../QuoteForm";
import { SectionShell } from "../SectionShell";

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-jdc-navy-deep text-jdc-cyan">
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wide text-jdc-slate uppercase">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="mt-0.5 block text-sm font-medium text-jdc-navy hover:text-jdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 text-sm font-medium text-jdc-navy">{value}</p>
        )}
      </div>
    </div>
  );
}

export function Contact() {
  const email = filled(business.email);
  const phone = filled(business.phone);
  const address = formatAddress();
  const workArea = filled(business.workArea);
  const vat = filled(business.vat);
  const kbo = filled(business.enterpriseNumber);
  const canReach = Boolean(business.formEndpoint || email || phone);

  return (
    <SectionShell
      id="contact"
      title="Vrijblijvende offerte"
      lead={
        canReach
          ? "Vertel ons wat proper moet. We antwoorden met een vrijblijvende offerte. Stuur gerust een paar foto's mee."
          : "Het formulier controleert uw invoer, maar verstuurt nog niets. Beschrijf het gebouw, en vermeld waar we foto's kunnen zien."
      }
      tone="white"
    >
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <div className="space-y-6 lg:col-span-2">
          {email ? (
            <ContactLine
              icon={Mail}
              label="E-mail"
              value={email}
              href={`mailto:${email}`}
            />
          ) : null}
          {phone ? (
            <ContactLine
              icon={Phone}
              label="Telefoon"
              value={phone}
              href={`tel:${phone.replace(/\s/g, "")}`}
            />
          ) : null}
          {address ? <ContactLine icon={MapPin} label="Adres" value={address} /> : null}
          {workArea ? <ContactLine icon={MapPin} label="Werkgebied" value={workArea} /> : null}
          {vat ? <p className="text-sm font-medium text-jdc-navy">BTW {vat}</p> : null}
          {kbo ? <p className="text-sm font-medium text-jdc-navy">KBO {kbo}</p> : null}
        </div>

        <div className="lg:col-span-3">
          <QuoteForm />
        </div>
      </div>
    </SectionShell>
  );
}
