# Janssens Drone Cleaning (JDC)

Premium NL-BE marketing site for professional drone cleaning.

Public Pages URL: https://lodeja.github.io/jdc-web/ (`REPO_SLUG` in `src/config/repo.ts`).

Do not deploy before the GitHub repository is renamed to `jdc-web`. Order: merge this pull request, rename the repository, then run `scripts/deploy-gh-pages.sh`. The current Pages site stays up until that deploy.

## Stack

- Next.js 16 App Router + React + TypeScript
- Tailwind CSS v4
- GSAP (hero and industrial illustrations; not started when `prefers-reduced-motion` matches)
- Lucide icons

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:e2e          # Playwright + axe against the static export
npm run preview           # gzip static server on 127.0.0.1:4173
npm run lhci              # Lighthouse mobile + desktop
npm run copy:check        # Vale, local LanguageTool nl-BE, Flesch-Douma
GITHUB_PAGES=true npm run build   # static export; basePath is / plus REPO_SLUG
```

Do not run `scripts/deploy-gh-pages.sh` from CI. It force-pushes `out/` to `gh-pages`.

## Brand

Logo WebPs in `/public/brand/` (transparent): `jdc-mono.webp`, `jdc-wordmark.webp`, `jdc-van-logo.webp`, plus `favicon.png`. Source PNGs and style references live in `/design/brand/` and are not deployed.

The public brand is Janssens Drone Cleaning (JDC). The Pages base path is `REPO_SLUG` in `src/config/repo.ts`.

Confirmed services live in `src/config/services.ts`: dakreiniging, gevelreiniging, ramen- en glasreiniging, zonnepanelen reinigen, industriële reiniging. Each `slug` is a static page. Longer copy is in `src/config/service-pages.ts`. `/privacy/` is linked from the footer once `privacyPolicyPath` is set.

## Bedrijfsgegevens invullen

Alles wat nog niet vastligt staat op `null` of in een lege lijst. Verzin niets: laat het veld leeg tot er een echt gegeven is. Componenten verbergen een leeg veld. Zodra je het invult, verschijnt het vanzelf.

Bestand: `src/config/business.ts`

| Veld | Wat je invult | Wat de site doet |
| --- | --- | --- |
| `brandName`, `shortName` | Al gezet: Janssens Drone Cleaning / JDC | Blijft zichtbaar. Niet leegmaken. |
| `legalName` | Officiële vennootschapsnaam, of `null` | Footer, en de naam in LocalBusiness |
| `email` | Inbox, of `null` | `mailto:` in contact en footer. Zonder formulier-endpoint opent een geldige offerte het e-mailprogramma; de site zegt niet dat ze verzonden is |
| `phone` | Internationaal nummer, of `null` | `tel:`-link |
| `street`, `postalCode`, `city`, `region`, `country` | Adres. `country` is een ISO-code zoals `BE` | Contactblok. LocalBusiness JSON-LD verschijnt pas als straat, postcode, gemeente én land ingevuld zijn, plus telefoon of e-mail |
| `workArea` | Bijvoorbeeld een bevestigd werkgebied, of `null` | Contactregel |
| `vat` | BTW-nummer, of `null` | Contact, footer, JSON-LD |
| `enterpriseNumber` | KBO-nummer, of `null` | Contact, footer, JSON-LD |
| `domain` | Publieke origin zonder slash op het einde, zoals `https://example.be`, of `null` | Canonical, sitemap, robots en Open Graph. `null` houdt de GitHub Pages-origin uit `REPO_SLUG` |
| `formEndpoint` | HTTPS-URL die POST JSON aanvaardt, of `null` | Zie hieronder |
| `social` | `{ label, href }`, of `[]` | Footerlinks |
| `certifications` | `{ name, issuer, url }`, of `[]` | Footer. `issuer` en `url` mogen `null` |
| `references` | `{ name, summary, url }`, of `[]` | Lijst onder Resultaten. Alleen publiceren met toestemming |
| `privacyPolicyPath` | Pad zoals `/privacy/`, of `null` | Footerlink |

`formEndpoint` ontvangt JSON `{ name, email, phone, service, message }`. Het veld `website` is een honeypot: als het gevuld is, is het een bot. Er is geen `/api`-route op GitHub Pages; gebruik een externe HTTPS-endpoint. Zolang `formEndpoint` `null` is, meldt het formulier dat de aanvraag niet verzonden is. Bestaat er wel een `email` en nog geen endpoint, dan opent `mailto:` en moet de bezoeker zelf versturen.

Foto's: `src/config/images.ts`. Zet het bestand in `public/` (bijvoorbeeld `public/photos/hero.webp`) en vul `src` (`/photos/hero.webp`), `alt`, `width` en `height`. Slots: `hero`, `beforeAfter` (vóór én na moeten samen ingevuld zijn), `projects`, `team`, `drone`. Tot dan blijven de eigen illustraties staan, met het bijschrift uit de manifest. Geen stockfoto's van derden.

LocalBusiness JSON-LD en FAQ-schema: FAQPage wordt niet toegevoegd. LocalBusiness wordt alleen in de HTML gezet wanneer de verplichte velden hierboven bestaan.
