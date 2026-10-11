"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { business, filled } from "@/config/business";
import { services, type ServiceId } from "@/config/services";

type FieldErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "service"
    | "message"
    | "consent"
    | "building"
    | "area"
    | "height"
    | "postcode",
    string
  >
>;

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "unwired"; message: string }
  | { type: "success"; message: string };

const SERVICE_OPTIONS = [
  ...services.map((service) => ({ value: service.id, label: service.title })),
  { value: "andere", label: "Andere / nog niet zeker" },
];

const BUILDINGS = [
  { value: "woning", label: "Woning" },
  { value: "appartement", label: "Appartementsgebouw" },
  { value: "kantoor", label: "Kantoor of handelsruimte" },
  { value: "industrie", label: "Industriële site" },
  { value: "onzeker", label: "Nog niet zeker" },
] as const;

const STEPS = [
  { id: "dienst", label: "Dienst" },
  { id: "gebouw", label: "Gebouw" },
  { id: "omvang", label: "Omvang" },
  { id: "postcode", label: "Postcode" },
  { id: "contact", label: "Contact" },
] as const;

type Payload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

function readDienstParam() {
  const id = new URLSearchParams(window.location.search).get("dienst");
  return id && services.some((service) => service.id === (id as ServiceId)) ? id : "";
}

function subscribeDienst() {
  return () => {};
}

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseMeasure(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const normalized = trimmed.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return false;
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 && amount <= 100000;
}

function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
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
  const legendRef = useRef<HTMLLegendElement>(null);
  const moved = useRef(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [pending, setPending] = useState(false);
  const inbox = filled(business.email);
  const endpoint = filled(business.formEndpoint);
  const privacy = filled(business.privacyPolicyPath);
  const workArea = filled(business.workArea);
  const preset = useSyncExternalStore(subscribeDienst, readDienstParam, () => "");
  const [serviceValue, setServiceValue] = useState<string | null>(null);
  const selectedService = serviceValue ?? preset;

  useEffect(() => {
    if (!moved.current) return;
    legendRef.current?.focus();
  }, [step]);

  function errorsFor(form: HTMLFormElement, index: number): FieldErrors {
    const data = new FormData(form);
    const next: FieldErrors = {};
    const service = selectedService || String(data.get("service") ?? "");
    if (index === 0 && !service) next.service = "Selecteer een dienst.";
    if (index === 1 && !String(data.get("building") ?? "")) next.building = "Kies een type gebouw.";
    if (index === 2) {
      if (!parseMeasure(String(data.get("area") ?? ""))) {
        next.area = "Vul een getal groter dan nul in, of laat het veld leeg.";
      }
      if (!parseMeasure(String(data.get("height") ?? ""))) {
        next.height = "Vul een getal groter dan nul in, of laat het veld leeg.";
      }
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
      if (!service) next.service = "Selecteer een dienst.";
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

  function composeMessage(data: FormData) {
    const area = String(data.get("area") ?? "").trim();
    const height = String(data.get("height") ?? "").trim();
    const postcode = String(data.get("postcode") ?? "").trim();
    const note = String(data.get("message") ?? "").trim();
    return [
      `Gebouw: ${labelFor(BUILDINGS, String(data.get("building") ?? ""))}`,
      area ? `Oppervlakte: ${area} m²` : "Oppervlakte: niet ingevuld",
      height ? `Hoogte: ${height} m` : "Hoogte: niet ingevuld",
      postcode ? `Postcode: ${postcode}` : "Postcode: niet ingevuld",
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
      service: selectedService || String(data.get("service") ?? ""),
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
      setServiceValue("");
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

  const fieldClass =
    "mt-1.5 w-full rounded-sm border border-jdc-navy/15 bg-white px-3.5 py-2.5 text-sm text-jdc-ink outline-none transition-[border-color,box-shadow] placeholder:text-jdc-slate focus:border-jdc-cyan focus:shadow-[0_0_0_3px_rgba(0,194,232,0.2)]";

  const upcoming = STEPS[step + 1];

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-sm border border-jdc-navy/10 bg-white p-6 sm:p-8"
      aria-labelledby={`${formId}-title`}
    >
      <h3 id={`${formId}-title`} className="text-xl font-semibold text-jdc-navy">
        Vraag een vrijblijvende offerte aan
      </h3>
      <p className="mt-2 text-sm text-jdc-slate">
        Vijf korte stappen. Velden met * zijn verplicht. We gebruiken uw gegevens alleen om deze
        aanvraag te beantwoorden.
      </p>
      {notice ? (
        <p id={`${formId}-notice`} className="mt-3 text-xs leading-relaxed text-jdc-slate">
          {notice}
        </p>
      ) : null}

      <ol className="mt-5 grid grid-cols-5 border-y border-jdc-navy/15" aria-label="Stappen">
        {STEPS.map((item, index) => (
          <li
            key={item.id}
            aria-current={index === step ? "step" : undefined}
            className={`min-w-0 border-t-2 px-1 py-2 sm:px-2 ${
              index === step
                ? "border-jdc-cyan bg-jdc-fog"
                : index < step
                  ? "border-jdc-navy/40"
                  : "border-transparent"
            }`}
          >
            <span
              className={`jdc-mono block text-[10px] tracking-[0.12em] ${
                index === step ? "text-jdc-cyan-ink" : "text-jdc-slate"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`mt-0.5 block text-[0.65rem] leading-tight sm:text-xs ${
                index === step ? "font-semibold text-jdc-navy" : "text-jdc-slate"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-jdc-slate" aria-live="polite">
        {step < STEPS.length - 1
          ? `Nu: ${STEPS[step].label}. Daarna: ${upcoming?.label ?? ""}.`
          : "Nu: Contact."}
      </p>

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

      <fieldset className="mt-6 border-0 p-0" hidden={step !== 0}>
        <legend ref={step === 0 ? legendRef : undefined} tabIndex={-1} className="text-base font-semibold text-jdc-navy">
          Welke dienst?
        </legend>
        <div className="mt-3 grid gap-2">
          {SERVICE_OPTIONS.map((option) => (
            <label key={option.value} className="flex min-h-11 items-center gap-3 border border-jdc-navy/15 px-3 py-2 text-sm text-jdc-navy">
              <input
                type="radio"
                name="service"
                value={option.value}
                checked={selectedService === option.value}
                onChange={() => setServiceValue(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.service ? <p className="mt-2 text-xs text-red-700">{errors.service}</p> : null}
      </fieldset>

      <fieldset className="mt-6 border-0 p-0" hidden={step !== 1}>
        <legend ref={step === 1 ? legendRef : undefined} tabIndex={-1} className="text-base font-semibold text-jdc-navy">
          Wat voor gebouw?
        </legend>
        <div className="mt-3 grid gap-2">
          {BUILDINGS.map((option) => (
            <label key={option.value} className="flex min-h-11 items-center gap-3 border border-jdc-navy/15 px-3 py-2 text-sm text-jdc-navy">
              <input type="radio" name="building" value={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.building ? <p className="mt-2 text-xs text-red-700">{errors.building}</p> : null}
      </fieldset>

      <fieldset className="mt-6 border-0 p-0" hidden={step !== 2}>
        <legend ref={step === 2 ? legendRef : undefined} tabIndex={-1} className="text-base font-semibold text-jdc-navy">
          Omvang, als u die kent
        </legend>
        <p className="mt-2 text-sm text-jdc-slate">
          De prijs hangt af van de oppervlakte, de hoogte, hoe vuil het is, en hoe bereikbaar het is.
          Beide velden mogen leeg blijven. Foto&apos;s mag u in het bericht vermelden.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-area`} className="text-sm font-medium text-jdc-navy">
              Oppervlakte (m²)
            </label>
            <input id={`${formId}-area`} name="area" inputMode="decimal" className={fieldClass} />
            {errors.area ? <p className="mt-1 text-xs text-red-700">{errors.area}</p> : null}
          </div>
          <div>
            <label htmlFor={`${formId}-height`} className="text-sm font-medium text-jdc-navy">
              Hoogte (m)
            </label>
            <input id={`${formId}-height`} name="height" inputMode="decimal" className={fieldClass} />
            {errors.height ? <p className="mt-1 text-xs text-red-700">{errors.height}</p> : null}
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-6 border-0 p-0" hidden={step !== 3}>
        <legend ref={step === 3 ? legendRef : undefined} tabIndex={-1} className="text-base font-semibold text-jdc-navy">
          Postcode
        </legend>
        <p className="mt-2 text-sm text-jdc-slate">
          {workArea
            ? `We werken in ${workArea}. Een postcode helpt het plaatsbezoek te plannen.`
            : "Een postcode helpt het plaatsbezoek te plannen. Het veld mag leeg blijven."}
        </p>
        <div className="mt-4 max-w-xs">
          <label htmlFor={`${formId}-postcode`} className="text-sm font-medium text-jdc-navy">
            Postcode
          </label>
          <input
            id={`${formId}-postcode`}
            name="postcode"
            inputMode="numeric"
            autoComplete="postal-code"
            className={fieldClass}
          />
          {errors.postcode ? <p className="mt-1 text-xs text-red-700">{errors.postcode}</p> : null}
        </div>
      </fieldset>

      <fieldset className="mt-6 border-0 p-0" hidden={step !== 4}>
        <legend ref={step === 4 ? legendRef : undefined} tabIndex={-1} className="text-base font-semibold text-jdc-navy">
          Hoe mogen we u bereiken?
        </legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
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
            <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" className={fieldClass} />
            {errors.phone ? <p className="mt-1 text-xs text-red-700">{errors.phone}</p> : null}
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
              placeholder="Waar staat het gebouw, wat moet proper, en waar kunnen we foto's zien?"
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
                className="mt-1 h-4 w-4 border-jdc-navy/30 text-jdc-cyan focus:ring-jdc-cyan"
                aria-invalid={Boolean(errors.consent)}
              />
              <span>Ik ga akkoord dat {business.shortName} mij contacteert over deze offerteaanvraag. *</span>
            </label>
            {errors.consent ? <p className="mt-1 text-xs text-red-700">{errors.consent}</p> : null}
          </div>
        </div>
      </fieldset>

      {privacy ? (
        <p className="mt-4 text-sm">
          <Link
            href={privacy}
            className="font-medium text-jdc-navy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            Privacy
          </Link>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center px-5 py-3 text-sm font-semibold text-jdc-navy shadow-[inset_0_0_0_1px_rgba(7,21,37,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            onClick={(event) => goTo(event.currentTarget.form!, step - 1)}
          >
            Vorige
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center bg-jdc-cyan px-6 py-3 text-sm font-semibold text-jdc-navy-deep hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            onClick={(event) => goTo(event.currentTarget.form!, step + 1)}
          >
            Volgende
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center bg-jdc-cyan px-6 py-3 text-sm font-semibold text-jdc-navy-deep hover:bg-jdc-cyan-bright disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            {pending ? "Bezig…" : "Verstuur aanvraag"}
          </button>
        )}
      </div>

      <div className="mt-4" aria-live="polite">
        {status.type === "error" ? (
          <p className="rounded-sm bg-red-50 px-3 py-2 text-sm text-red-800">{status.message}</p>
        ) : null}
        {status.type === "unwired" ? (
          <p className="rounded-sm bg-amber-50 px-3 py-2 text-sm text-amber-950">{status.message}</p>
        ) : null}
        {status.type === "success" ? (
          <p className="rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}
