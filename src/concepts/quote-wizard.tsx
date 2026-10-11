"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { business, filled } from "@/config/business";
import { services } from "@/config/services";
import { buildings } from "./content";
import "./form.css";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "service" | "message" | "consent" | "building" | "area" | "height" | "postcode", string>
>;

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "unwired"; message: string }
  | { type: "success"; message: string };

type Payload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const STEPS = [
  { id: "dienst", label: "Dienst" },
  { id: "gebouw", label: "Gebouw" },
  { id: "omvang", label: "Omvang" },
  { id: "postcode", label: "Postcode" },
  { id: "contact", label: "Contact" },
] as const;

const SERVICE_OPTIONS = [
  ...services.map((service) => ({ value: service.id, label: service.title })),
  { value: "andere", label: "Andere / nog niet zeker" },
];

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseMeasure(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { empty: true as const };
  const normalized = trimmed.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return { empty: false as const, ok: false as const };
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return { empty: false as const, ok: false as const };
  }
  return { empty: false as const, ok: true as const };
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

function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function QuoteWizard() {
  const formId = useId();
  const legendRef = useRef<HTMLLegendElement>(null);
  const moved = useRef(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [pending, setPending] = useState(false);
  const inbox = filled(business.email);
  const endpoint = filled(business.formEndpoint);
  const current = STEPS[step];
  const upcoming = STEPS[step + 1];

  function errorsFor(form: HTMLFormElement, index: number): FieldErrors {
    const data = new FormData(form);
    const next: FieldErrors = {};
    if (index === 0 && !String(data.get("service") ?? "")) {
      next.service = "Kies een dienst.";
    }
    if (index === 1 && !String(data.get("building") ?? "")) {
      next.building = "Kies een type gebouw.";
    }
    if (index === 2) {
      const area = parseMeasure(String(data.get("area") ?? ""));
      const height = parseMeasure(String(data.get("height") ?? ""));
      if (!area.empty && !area.ok) next.area = "Vul een getal groter dan nul in, of laat het veld leeg.";
      if (!height.empty && !height.ok) next.height = "Vul een getal groter dan nul in, of laat het veld leeg.";
    }
    if (index === 3) {
      const postcode = String(data.get("postcode") ?? "").trim();
      if (postcode && !/^\d{4}$/.test(postcode)) {
        next.postcode = "Gebruik vier cijfers, of laat het veld leeg.";
      }
    }
    if (index === 4) {
      const name = String(data.get("name") ?? "").trim();
      const email = String(data.get("email") ?? "").trim();
      const phone = String(data.get("phone") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();
      if (name.length < 2) next.name = "Vul uw naam in (min. 2 tekens).";
      if (!validateEmail(email)) next.email = "Vul een geldig e-mailadres in.";
      if (phone && phone.replace(/\s/g, "").length < 8) {
        next.phone = "Telefoonnummer lijkt onvolledig.";
      }
      if (message.length < 10) next.message = "Beschrijf kort uw project (min. 10 tekens).";
      if (data.get("consent") !== "on") {
        next.consent = "Bevestig dat we u mogen contacteren over deze aanvraag.";
      }
      if (!String(data.get("service") ?? "")) next.service = "Kies een dienst.";
    }
    return next;
  }

  function goTo(form: HTMLFormElement, nextStep: number) {
    if (nextStep > step) {
      const nextErrors = errorsFor(form, step);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        setStatus({ type: "error", message: "Controleer de gemarkeerde velden." });
        return;
      }
    }
    moved.current = true;
    setErrors({});
    setStatus({ type: "idle" });
    setStep(nextStep);
  }

  useEffect(() => {
    if (!moved.current) return;
    legendRef.current?.focus();
  }, [step]);

  function composeMessage(data: FormData) {
    const area = String(data.get("area") ?? "").trim();
    const height = String(data.get("height") ?? "").trim();
    const postcode = String(data.get("postcode") ?? "").trim();
    const note = String(data.get("message") ?? "").trim();
    return [
      `Gebouw: ${labelFor(buildings, String(data.get("building") ?? ""))}`,
      area ? `Oppervlakte (indicatie): ${area} m²` : "Oppervlakte: niet ingevuld",
      height ? `Hoogte (indicatie): ${height} m` : "Hoogte: niet ingevuld",
      postcode ? `Postcode: ${postcode}` : "Postcode: niet ingevuld",
      "Upload: er is nog geen upload.",
      "",
      note,
    ].join("\n");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (step < STEPS.length - 1) {
      goTo(form, step + 1);
      return;
    }

    setStatus({ type: "idle" });
    const nextErrors = errorsFor(form, 4);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Controleer de gemarkeerde velden." });
      return;
    }

    const data = new FormData(form);
    const payload: Payload = {
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      phone: String(data.get("phone") ?? "").trim(),
      service: String(data.get("service")),
      message: composeMessage(data),
    };

    if (String(data.get("website") ?? "").trim().length > 0) {
      setStatus({ type: "error", message: "Uw aanvraag is niet verzonden." });
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
        message: "Uw aanvraag is niet verzonden. Online aanvragen openen binnenkort.",
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
      setStep(0);
    } catch {
      setStatus({
        type: "error",
        message: "Verzenden mislukt. Probeer later opnieuw of gebruik een ander kanaal.",
      });
    } finally {
      setPending(false);
    }
  }

  const notice = endpoint
    ? null
    : inbox
      ? `Online verzenden is nog niet gekoppeld. Een geldige aanvraag opent een e-mail naar ${inbox}; u verstuurt die zelf.`
      : "Online aanvragen openen binnenkort. Dit formulier controleert uw gegevens, maar verstuurt ze nog niet.";

  const live =
    step < STEPS.length - 1
      ? `Nu: ${current.label}. Daarna: ${upcoming?.label ?? ""}.`
      : "Nu: Contact. De aanvraag wordt nog niet verzonden.";

  return (
    <form className="jdc-form jdc-wizard" onSubmit={onSubmit} noValidate aria-labelledby="offerte-title">
      <p className="jdc-form-lead">
        Vijf korte stappen. Velden met * zijn verplicht. We gebruiken uw gegevens enkel om deze
        aanvraag te beantwoorden.
      </p>
      {notice ? <p className="jdc-form-note">{notice}</p> : null}

      <ol className="jdc-wizard-progress">
        {STEPS.map((item, index) => (
          <li key={item.id} aria-current={index === step ? "step" : undefined}>
            {item.label}
          </li>
        ))}
      </ol>
      <p className="jdc-wizard-now" aria-live="polite">
        {live}
      </p>

      <div className="jdc-hp" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <fieldset hidden={step !== 0} aria-describedby={errors.service ? `${formId}-service-err` : undefined}>
        <legend ref={step === 0 ? legendRef : undefined} tabIndex={-1}>
          Welke dienst?
        </legend>
        <div className="jdc-choices">
          {SERVICE_OPTIONS.map((option) => (
            <label className="jdc-choice" key={option.value}>
              <input type="radio" name="service" value={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.service ? (
          <p id={`${formId}-service-err`} className="jdc-error">
            {errors.service}
          </p>
        ) : null}
      </fieldset>

      <fieldset hidden={step !== 1}>
        <legend ref={step === 1 ? legendRef : undefined} tabIndex={-1}>
          Wat voor gebouw?
        </legend>
        <div className="jdc-choices">
          {buildings.map((option) => (
            <label className="jdc-choice" key={option.value}>
              <input type="radio" name="building" value={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.building ? <p className="jdc-error">{errors.building}</p> : null}
      </fieldset>

      <fieldset hidden={step !== 2}>
        <legend ref={step === 2 ? legendRef : undefined} tabIndex={-1}>
          Omvang, als u die kent
        </legend>
        <p className="jdc-form-lead">
          De prijs hangt af van oppervlakte, hoogte, vervuiling en bereikbaarheid. Er staat geen
          tarief op deze site. Beide velden mogen leeg blijven.
        </p>
        <p className="jdc-form-note">Upload is er nog niet. Beschrijf het oppervlak in het bericht.</p>
        <div className="jdc-form-grid">
          <Field
            id={`${formId}-area`}
            name="area"
            label="Oppervlakte (m²)"
            inputMode="decimal"
            error={errors.area}
          />
          <Field
            id={`${formId}-height`}
            name="height"
            label="Hoogte (m)"
            inputMode="decimal"
            error={errors.height}
          />
        </div>
      </fieldset>

      <fieldset hidden={step !== 3}>
        <legend ref={step === 3 ? legendRef : undefined} tabIndex={-1}>
          Postcode
        </legend>
        <p className="jdc-form-lead">
          Het werkgebied staat nog niet vast. Een postcode helpt de plek in te schatten, maar
          bevestigt geen dekking. Het veld mag leeg blijven.
        </p>
        <Field
          id={`${formId}-postcode`}
          name="postcode"
          label="Postcode"
          inputMode="numeric"
          autoComplete="postal-code"
          error={errors.postcode}
        />
      </fieldset>

      <fieldset hidden={step !== 4}>
        <legend ref={step === 4 ? legendRef : undefined} tabIndex={-1}>
          Hoe mogen we u bereiken?
        </legend>
        <div className="jdc-form-grid">
          <Field id={`${formId}-name`} name="name" label="Naam *" autoComplete="name" error={errors.name} />
          <Field
            id={`${formId}-email`}
            name="email"
            type="email"
            label="E-mail *"
            autoComplete="email"
            error={errors.email}
          />
          <Field
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            label="Telefoon"
            autoComplete="tel"
            error={errors.phone}
          />
          <div className="jdc-span-2">
            <label htmlFor={`${formId}-message`}>Bericht *</label>
            <textarea
              id={`${formId}-message`}
              name="message"
              className="jdc-field"
              rows={4}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${formId}-message-err` : undefined}
            />
            {errors.message ? (
              <p id={`${formId}-message-err`} className="jdc-error">
                {errors.message}
              </p>
            ) : null}
          </div>
          <div className="jdc-span-2">
            <label className="jdc-check" htmlFor={`${formId}-consent`}>
              <input
                id={`${formId}-consent`}
                type="checkbox"
                name="consent"
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? `${formId}-consent-err` : undefined}
              />
              <span>Ik ga akkoord dat {business.shortName} mij contacteert over deze offerteaanvraag. *</span>
            </label>
            {errors.consent ? (
              <p id={`${formId}-consent-err`} className="jdc-error">
                {errors.consent}
              </p>
            ) : null}
          </div>
        </div>
      </fieldset>

      <div className="jdc-wizard-nav">
        {step > 0 ? (
          <button className="jdc-wizard-back" type="button" onClick={(event) => goTo(event.currentTarget.form!, step - 1)}>
            Vorige
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button className="jdc-submit" type="button" onClick={(event) => goTo(event.currentTarget.form!, step + 1)}>
            Volgende
          </button>
        ) : (
          <button className="jdc-submit" type="submit" disabled={pending}>
            {pending ? "Bezig" : "Vraag een offerte aan"}
          </button>
        )}
      </div>

      <div aria-live="assertive">
        {status.type !== "idle" ? (
          <p className="jdc-status" role="alert">
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "decimal" | "numeric" | "text";
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="jdc-field"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error ? (
        <p id={`${id}-err`} className="jdc-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
