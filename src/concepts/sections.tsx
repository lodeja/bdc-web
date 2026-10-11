import {
  comparisonLead,
  faqs,
  methods,
  pioneers,
  specs,
  steps,
} from "./content";
import "./sections.css";

export function SheetMeta({ fig, subject }: { fig: string; subject: string }) {
  return (
    <dl className="jdc-sheet">
      <div>
        <dt>Fig.</dt>
        <dd>{fig}</dd>
      </div>
      <div>
        <dt>Onderwerp</dt>
        <dd>{subject}</dd>
      </div>
      <div>
        <dt>Schaal</dt>
        <dd>illustratie</dd>
      </div>
      <div>
        <dt>Meting</dt>
        <dd>geen</dd>
      </div>
    </dl>
  );
}

export function Timeline() {
  return (
    <ol className="jdc-timeline">
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="jdc-timeline-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function SpecSheet() {
  return (
    <div className="jdc-spec-wrap">
      <h3 className="jdc-spec-title">Specificatie</h3>
      <dl className="jdc-spec">
        {specs.map((row) => (
          <div key={row.label}>
            <dt>[{row.label}]</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Comparison({ layout = "sheet" }: { layout?: "sheet" | "rows" }) {
  return (
    <div className={layout === "rows" ? "jdc-compare is-rows" : "jdc-compare"}>
      <p className="jdc-sec-lead">{comparisonLead}</p>
      <div className="jdc-compare-grid">
        {methods.map((method) => (
          <article key={method.name}>
            <h3>{method.name}</h3>
            <dl>
              <div>
                <dt>Past</dt>
                <dd>{method.fits}</dd>
              </div>
              <div>
                <dt>Op de grond</dt>
                <dd>{method.ground}</dd>
              </div>
              <div>
                <dt>Niet wanneer</dt>
                <dd>{method.not}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

export function FaqList() {
  return (
    <div className="jdc-faq">
      {faqs.map((item) => (
        <article key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </article>
      ))}
    </div>
  );
}

export function Pioneers() {
  return <p className="jdc-pioneers">{pioneers}</p>;
}
