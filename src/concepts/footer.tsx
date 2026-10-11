import Link from "next/link";

export function ConceptFooter({ name }: { name: string }) {
  return (
    <footer className="jdc-foot">
      <p>
        {name}. Conceptverkenning, niet de live site. Zoekmachines wordt gevraagd deze
        pagina niet te indexeren.
      </p>
      <p className="jdc-foot-links">
        <Link href="/concepts/">Alle concepten</Link>
        <Link href="/">Huidige site</Link>
      </p>
    </footer>
  );
}