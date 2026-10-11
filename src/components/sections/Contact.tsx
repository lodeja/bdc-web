import Link from "next/link";
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
  const hasReach = Boolean(email || phone || address || workArea || vat || kbo);

  return (
    <SectionShell
      id="contact"
      title="Vrijblijvende offerte"
      lead="Beschrijf het gebouw. Daarna plannen we een plaatsbezoek en sturen we een vrijblijvende offerte."
      tone="white"
    >
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className={hasReach ? "mb-8 space-y-4" : ""}>
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

          <ol className="border-t border-jdc-navy/15">
            <li className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-jdc-navy/15 py-4">
              <span className="jdc-mono pt-1 text-xs tracking-[0.14em] text-jdc-cyan-ink" aria-hidden>
                01
              </span>
              <div>
                <h3 className="font-semibold text-jdc-navy">Plaatsbezoek</h3>
                <p className="mt-1 text-sm leading-relaxed text-jdc-slate">
                  We komen langs, bekijken het vlak en nemen foto&apos;s.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-jdc-navy/15 py-4">
              <span className="jdc-mono pt-1 text-xs tracking-[0.14em] text-jdc-cyan-ink" aria-hidden>
                02
              </span>
              <div>
                <h3 className="font-semibold text-jdc-navy">Offerte</h3>
                <p className="mt-1 text-sm leading-relaxed text-jdc-slate">
                  U krijgt een vrijblijvende offerte.
                </p>
              </div>
            </li>
          </ol>

          <h3 className="mt-8 font-semibold text-jdc-navy">Foto&apos;s die helpen</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-jdc-slate">
            Een foto van het dak, de gevel, de ramen of de panelen, en van hoe we het gebouw
            bereiken, helpt het plaatsbezoek te plannen.
          </p>
          <p className="mt-5">
            <Link
              href="/veiligheid-en-regelgeving/"
              className="text-sm font-semibold text-jdc-navy underline decoration-jdc-cyan underline-offset-4 hover:text-jdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              Veiligheid en regelgeving
            </Link>
          </p>
        </div>

        <QuoteForm />
      </div>
    </SectionShell>
  );
}
