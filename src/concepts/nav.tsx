type NavLink = { href: string; label: string };

export function ConceptNav({ links }: { links: readonly NavLink[] }) {
  return (
    <header className="jdc-nav" id="top">
      <a className="jdc-nav-brand" href="#top">
        Janssens Drone Cleaning
      </a>
      <nav className="jdc-nav-desk" aria-label="Pagina">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <a className="jdc-nav-cta" href="#offerte">
          Vraag een offerte aan
        </a>
      </nav>
      <details className="jdc-nav-fold">
        <summary className="jdc-nav-toggle">Menu</summary>
        <nav className="jdc-nav-panel" aria-label="Menu">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="jdc-nav-cta" href="#offerte">
            Vraag een offerte aan
          </a>
        </nav>
      </details>
    </header>
  );
}
