"use client";

import { useId, useState, type FormEvent } from "react";
import { FORM_ENDPOINT } from "@/lib/contact";

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
  { value: "dak", label: "Dakreiniging" },
  { value: "gevel", label: "Gevelreiniging" },
  { value: "zonnepanelen", label: "Zonnepanelen" },
  { value: "industrie", label: "Industriële reiniging" },
  { value: "andere", label: "Andere / nog niet zeker" },
] as const;

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function QuoteForm() {
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [pending, setPending] = useState(false);

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
    const payload = {
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      phone: String(data.get("phone") ?? "").trim(),
      service: String(data.get("service")),
      message: String(data.get("message")).trim(),
    };

    // No fake success: only claim delivery when an endpoint exists and responds OK.
    if (!FORM_ENDPOINT) {
      setStatus({
        type: "unwired",
        message:
          "Het formulier is gevalideerd, maar e-mailintegratie is nog niet geconfigureerd. Uw gegevens zijn niet verzonden. Neem contact op via de vermelde kanalen zodra die beschikbaar zijn, of vraag ons de koppeling (Resend / Formspree / API) te activeren.",
      });
      return;
    }

    setPending(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
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
    "mt-1.5 w-full rounded-sm border border-bdc-navy/15 bg-white px-3.5 py-2.5 text-sm text-bdc-ink outline-none transition-[border-color,box-shadow] placeholder:text-bdc-slate/50 focus:border-bdc-cyan focus:shadow-[0_0_0_3px_rgba(0,194,232,0.2)]";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-sm border border-bdc-navy/10 bg-white p-6 sm:p-8"
      aria-labelledby={`${formId}-title`}
    >
      <h3 id={`${formId}-title`} className="text-xl font-semibold text-bdc-navy">
        Offerte aanvragen
      </h3>
      <p className="mt-2 text-sm text-bdc-slate">
        Velden met * zijn verplicht. We gebruiken uw gegevens enkel om deze
        aanvraag te beantwoorden.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={`${formId}-name`} className="text-sm font-medium text-bdc-navy">
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
          <label htmlFor={`${formId}-email`} className="text-sm font-medium text-bdc-navy">
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
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-bdc-navy">
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
          <label htmlFor={`${formId}-service`} className="text-sm font-medium text-bdc-navy">
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
          <label htmlFor={`${formId}-message`} className="text-sm font-medium text-bdc-navy">
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
          <label className="flex items-start gap-3 text-sm text-bdc-slate">
            <input
              type="checkbox"
              name="consent"
              className="mt-1 h-4 w-4 rounded border-bdc-navy/30 text-bdc-cyan focus:ring-bdc-cyan"
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              Ik ga akkoord dat JDC mij contacteert over deze offerteaanvraag. *
            </span>
          </label>
          {errors.consent ? (
            <p className="mt-1 text-xs text-red-700">{errors.consent}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-sm bg-bdc-cyan px-6 py-3 text-sm font-semibold text-bdc-navy-deep transition-[background-color,transform] hover:bg-bdc-cyan-bright disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
        >
          {pending ? "Bezig…" : "Verstuur aanvraag"}
        </button>
        <p className="text-xs text-bdc-slate">
          {/* TODO: koppel FORM_ENDPOINT in src/lib/contact.ts (Resend, Formspree, of /api/quote) */}
          Integratie: nog niet gekoppeld aan een mail-/API-endpoint.
        </p>
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
