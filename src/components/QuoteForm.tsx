"use client";

import { useId, useState, type FormEvent } from "react";
import { business, filled } from "@/config/business";
import { services } from "@/config/services";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "service" | "message" | "consent", string>
>;

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "unwired"; message: string }
  | { type: "success"; message: string };

const SERVICES = [
  { value: "", label: "Kies een dienst" },
  ...services.map((service) => ({ value: service.id, label: service.title })),
  { value: "andere", label: "Andere / nog niet zeker" },
];

type Payload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function mailtoHref(payload: Payload, inbox: string) {
  const subject = "Offerteaanvraag";
  const body = [
    `Naam: ${payload.name}`,
    `E-mail: ${payload.email}`,
    payload.phone ? `Telefoon: ${payload.phone}` : null,
    `Dienst: ${payload.service}`,
    "",
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  return `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function QuoteForm() {
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [pending, setPending] = useState(false);
  const inbox = filled(business.email);
  const endpoint = filled(business.formEndpoint);

  function validate(form: HTMLFormElement): FieldErrors {
    const data = new FormData(form);
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "").trim();
    const consent = data.get("consent") === "on";

    if (name.length < 2) next.name = "Vul uw naam in (min. 2 tekens).";
    if (!validateEmail(email)) next.email = "Vul een geldig e-mailadres in.";
    if (phone && phone.replace(/\s/g, "").length < 8) {
      next.phone = "Telefoonnummer lijkt onvolledig.";
    }
    if (!service) next.service = "Selecteer een dienst.";
    if (message.length < 10) {
      next.message = "Beschrijf kort uw project (min. 10 tekens).";
    }
    if (!consent) {
      next.consent = "Bevestig dat we u mogen contacteren over deze aanvraag.";
    }
    return next;
  }

  function honeypotFilled(form: HTMLFormElement) {
    return String(new FormData(form).get("website") ?? "").trim().length > 0;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "idle" });
    const form = e.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Controleer de gemarkeerde velden.",
      });
      return;
    }

    const data = new FormData(form);
    const payload: Payload = {
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      phone: String(data.get("phone") ?? "").trim(),
      service: String(data.get("service")),
      message: String(data.get("message")).trim(),
    };

    if (honeypotFilled(form)) {
      setStatus({
        type: "error",
        message: "Uw aanvraag is niet verzonden.",
      });
      return;
    }

    if (!endpoint) {
      if (inbox) {
        window.location.href = mailtoHref(payload, inbox);
        setStatus({
          type: "unwired",
          message:
            "Uw aanvraag is niet verzonden via deze site. Als uw e-mailprogramma opende, verstuurt u het bericht daar zelf.",
        });
        return;
      }
      setStatus({
        type: "unwired",
        message:
          "Uw aanvraag is niet verzonden. Online aanvragen openen binnenkort.",
      });
      return;
    }

    setPending(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus({
        type: "success",
        message: "Bedankt. Uw aanvraag is verzonden. We nemen contact op.",
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message:
          "Verzenden mislukt. Probeer later opnieuw of gebruik een ander kanaal.",
      });
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "mt-1.5 w-full rounded-sm border border-jdc-navy/15 bg-white px-3.5 py-2.5 text-sm text-jdc-ink outline-none transition-[border-color,box-shadow] placeholder:text-jdc-slate focus:border-jdc-cyan focus:shadow-[0_0_0_3px_rgba(0,194,232,0.2)]";

  const notice = endpoint
    ? null
    : inbox
      ? `Online verzenden is nog niet gekoppeld. Een geldige aanvraag opent een e-mail naar ${inbox}; u verstuurt die zelf.`
      : "Online aanvragen openen binnenkort. Dit formulier controleert uw gegevens, maar verstuurt ze nog niet.";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-sm border border-jdc-navy/10 bg-white p-6 sm:p-8"
      aria-labelledby={`${formId}-title`}
    >
      <h3 id={`${formId}-title`} className="text-xl font-semibold text-jdc-navy">
        Offerte aanvragen
      </h3>
      <p className="mt-2 text-sm text-jdc-slate">
        Velden met * zijn verplicht. We gebruiken uw gegevens enkel om deze
        aanvraag te beantwoorden.
      </p>
      {notice ? (
        <p id={`${formId}-notice`} className="mt-3 text-sm text-jdc-navy">
          {notice}
        </p>
      ) : null}

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={`${formId}-name`} className="text-sm font-medium text-jdc-navy">
            Naam *
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-err` : undefined}
          />
          {errors.name ? (
            <p id={`${formId}-name-err`} className="mt-1 text-xs text-red-700">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-medium text-jdc-navy">
            E-mail *
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-err` : undefined}
          />
          {errors.email ? (
            <p id={`${formId}-email-err`} className="mt-1 text-xs text-red-700">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-jdc-navy">
            Telefoon
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-err` : undefined}
          />
          {errors.phone ? (
            <p id={`${formId}-phone-err`} className="mt-1 text-xs text-red-700">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-service`} className="text-sm font-medium text-jdc-navy">
            Dienst *
          </label>
          <select
            id={`${formId}-service`}
            name="service"
            className={fieldClass}
            defaultValue=""
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? `${formId}-service-err` : undefined}
          >
            {SERVICES.map((s) => (
              <option key={s.value || "empty"} value={s.value} disabled={s.value === ""}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.service ? (
            <p id={`${formId}-service-err`} className="mt-1 text-xs text-red-700">
              {errors.service}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-message`} className="text-sm font-medium text-jdc-navy">
            Bericht *
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="Locatie, type gebouw/oppervlak, timing…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${formId}-message-err` : undefined}
          />
          {errors.message ? (
            <p id={`${formId}-message-err`} className="mt-1 text-xs text-red-700">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-jdc-slate">
            <input
              type="checkbox"
              name="consent"
              className="mt-1 h-4 w-4 rounded border-jdc-navy/30 text-jdc-cyan focus:ring-jdc-cyan"
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              Ik ga akkoord dat {business.shortName} mij contacteert over deze offerteaanvraag. *
            </span>
          </label>
          {errors.consent ? (
            <p className="mt-1 text-xs text-red-700">{errors.consent}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-sm bg-jdc-cyan px-6 py-3 text-sm font-semibold text-jdc-navy-deep transition-[background-color,transform] hover:bg-jdc-cyan-bright disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
        >
          {pending ? "Bezig…" : "Verstuur aanvraag"}
        </button>
      </div>

      <div className="mt-4" aria-live="polite">
        {status.type === "error" ? (
          <p className="rounded-sm bg-red-50 px-3 py-2 text-sm text-red-800">
            {status.message}
          </p>
        ) : null}
        {status.type === "unwired" ? (
          <p className="rounded-sm bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {status.message}
          </p>
        ) : null}
        {status.type === "success" ? (
          <p className="rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
