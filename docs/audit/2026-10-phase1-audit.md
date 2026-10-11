# Fase 1-audit — Janssens Drone Cleaning

Datum: 10 oktober 2026  
Repo: `lodeja/bdc-web` (branch `main` op het moment van meten, commit `e6b1368`)  
Scope: alleen onderzoek. Geen applicatiecode gewijzigd, geen dependency-upgrades, niets naar `main` gepusht.

Dit rapport beschrijft de site zoals die nu in de broncode staat en zoals ze live staat op GitHub Pages. Cijfers onder “gemeten” komen uit commando’s die tijdens deze audit echt gedraaid zijn. Zinnen onder “afgeleid” zijn conclusies uit die broncode of uit de screenshots, geen extra businessfeiten.

## Leeswijzer: gemeten versus afgeleid

Gemeten in deze sessie:

- Broncode, configs, assetformaten en bestandsgroottes.
- `npm ci`, `npm run lint`, `npx tsc --noEmit` (vóór en na de build), `npm test`, `npm audit`, `npm outdated`, `npm run build`.
- Lighthouse 12.8.2 op de lokale statische export en op de live GitHub Pages-URL.
- axe-core 4.10.3 (WCAG 2.1 A/AA) via Playwright op desktop en mobiel.
- Playwright-screenshots, een lege formuliervalidatie, het mobiele menu (openen en Escape), en wolkenbeweging bij `prefers-reduced-motion`.
- HTTP-headers van de live site, inclusief of referentiebeelden publiek bereikbaar zijn.
- GitHub-repometadata via `gh repo view`.

Afgeleid, niet apart in een browser “bewezen” tenzij hierboven genoemd: ontwerpintentie, welke clientcomponent een servercomponent zou kunnen zijn, en de oorzaak van de LCP-rendervertraging.

## Merknaam

De zichtbare merknaam in de broncode en op de live HTML is **Janssens Drone Cleaning**, met afkorting **JDC**.

De zin **“Belgian Drone Cleaning”** en het losse woord **“BDC”** komen in de huidige git-tree niet voor (`git grep -i belgian` is leeg; een woordgrenszoekactie op `BDC` in de worktree is leeg). De live HTML van 10 oktober 2026 bevat 0 keer “Belgian” en 0 keer “BDC”.

De oude naam leeft nog op deze plekken. Dit is de checklist voor een latere hernoeming.

### Buiten de broncode, wel publiek

| Plek | Huidige tekst | Gemeten via |
| --- | --- | --- |
| GitHub-repositorybeschrijving | `Belgian Drone Cleaning (BDC) — Next.js marketing site` | `gh repo view` |
| Repositorynaam | `lodeja/bdc-web` | `gh repo view` |
| Live URL | `https://lodeja.github.io/bdc-web/` | README, `next.config.ts`, deploy-script, curl |
| Oude commitberichten (niet in de huidige bestanden) | `d52f497` “Initial BDC Phase 1 site…”, `48a01eb` “Improve BDC logo…” | `git log` |

De hernoeming van de zichtbare copy is al gebeurd in commits `f8986cf` en `9744f08`. De repositorybeschrijving is daarbij niet mee veranderd.

### Pakketnaam en configuratie

| Bestand | Wat er staat |
| --- | --- |
| `package.json` → `name` | `jdc-web` (al de nieuwe afkorting) |
| `package-lock.json` regel 2 en `packages[""].name` | `bdc-web` (wijkt af van `package.json`) |
| `next.config.ts` | commentaar met `https://lodeja.github.io/bdc-web/`; `const repoName = "bdc-web"`; dat wordt `basePath` en `assetPrefix` wanneer `GITHUB_PAGES=true` |
| `scripts/deploy-gh-pages.sh` | commentaar en `git remote` naar `https://github.com/lodeja/bdc-web.git`; echo van de Pages-URL |
| `README.md` | titel is al “Janssens Drone Cleaning (JDC)”; de live URL en de tekst `/bdc-web basePath` gebruiken nog de oude slug |

Een hernoeming van de GitHub-repository verandert de Pages-URL. Dat is een bewuste stap (redirects, `basePath`), geen zoek-en-vervang in CSS.

### CSS- en Tailwind-prefix `bdc`

`src/app/globals.css` zegt expliciet dat de prefix `--bdc-*` blijft “for stability”. Die prefix is technisch, niet zichtbaar als het woord BDC. Hij zit wel in elke sectie.

Custom properties in `src/app/globals.css`:

- `--bdc-navy` `#0b1f3a`
- `--bdc-navy-deep` `#071525`
- `--bdc-navy-mid` `#143356` (geen Tailwind-klasse in `src/**/*.tsx`)
- `--bdc-anthracite` `#1c222c` (geen klasse in tsx)
- `--bdc-anthracite-soft` `#2a3340` (geen klasse in tsx)
- `--bdc-cyan` `#00c2e8`
- `--bdc-cyan-bright` `#33d6f0`
- `--bdc-cyan-dim` `#009bb8`
- `--bdc-white` `#ffffff` (geen klasse in tsx)
- `--bdc-fog` `#f4f7fb`
- `--bdc-mist` `#e4ebf4` (geen klasse in tsx)
- `--bdc-slate` `#5a6578`
- `--bdc-ink` `#0e1624`

Bijhorende theme-tokens: `--color-bdc-*` voor elk van die namen.

Klassen en keyframes:

- `.bdc-skip-link` — gebruikt in `src/app/layout.tsx`
- `.bdc-hero-atmosphere` — gebruikt in `src/components/Hero.tsx`
- `.bdc-fade-up` en `@keyframes bdcFadeUp` — gebruikt in `src/components/Header.tsx`
- `.bdc-section-placeholder` — alleen gedefinieerd, nergens gebruikt

Tailwind-kleurklassen (`bg-bdc-*`, `text-bdc-*`, `border-bdc-*`, `outline-bdc-*`, `from-bdc-*`, `via-bdc-*`) staan in:

- `src/components/Hero.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/SectionShell.tsx`
- `src/components/QuoteForm.tsx`
- `src/components/BeforeAfterSlider.tsx`
- `src/components/sections/Services.tsx`
- `src/components/sections/Industrial.tsx`
- `src/components/sections/Benefits.tsx`
- `src/components/sections/Process.tsx`
- `src/components/sections/Results.tsx`
- `src/components/sections/FAQ.tsx`
- `src/components/sections/Contact.tsx`

### Metadata, structured data, assets

- Metadata in `src/app/layout.tsx` gebruikt “Janssens Drone Cleaning (JDC)”. Geen BDC, geen “Belgian”.
- Er is geen JSON-LD / schema.org. Daar staat de oude naam dus ook niet.
- Geen enkel bestand onder `public/` of `src/app/favicon.ico` heeft `bdc` of `Belgian` in de bestandsnaam. De logo’s heten `jdc-*`.
- `skills-lock.json` bevat de letterreeks `bdc` alleen binnen een SHA-256-hash. Dat is geen merkverwijzing en hoeft niet hernoemd te worden.

## 1. Huidige technische architectuur

### Stack en versies

Gemeten na `npm ci` (Node v22.14.0, npm 10.9.9):

| Pakket | Geïnstalleerd | Opmerking |
| --- | --- | --- |
| next | 16.4.0 | Build log: “Next.js 16.4.0 (Turbopack)” |
| react / react-dom | 19.3.0 | |
| typescript | 5.9.3 | `npm outdated`: latest 7.0.2, buiten de range `^5` |
| tailwindcss + `@tailwindcss/turbopack` | 4.3.3 | Geen `postcss.config`, geen `tailwind.config`. Tailwind 4 via `@import "tailwindcss"` en een turbopack-loader in `next.config.ts` |
| eslint + eslint-config-next | 9.39.5 en 16.4.0 | `npm ci` waarschuwt dat ESLint 9 niet meer ondersteund wordt. Latest ESLint is 10.12.0 |
| gsap | 3.13.0 | Binnen range `^3.13.0` wil npm 3.15.0 |
| motion | 14.1.0 | Geen import in `src`. Trekt `framer-motion` mee in `node_modules`, niet in de sitebundle |
| lucide-react | 1.55.0 | Named imports in header, FAQ, diensten, voordelen, industrie, contact |
| `@types/node` | 20.19.43 | Latest 26.6.5, buiten `^20` |

Package manager: npm. Er is een `package-lock.json`. Geen `packageManager`-veld, geen `engines`, geen pnpm- of yarn-lock.

Scripts in `package.json`:

- `dev` → `next dev`
- `build` → `next build`
- `build:pages` → `GITHUB_PAGES=true next build`
- `start` → `next start`
- `lint` → `eslint`

Er is geen `typecheck`-script en geen `test`-script. `npm test` stopt met “Missing script: test”.

### Router en rendering

App Router, alleen `src/app`. Geen `pages/`.

`next.config.ts` zet `output: "export"`, `trailingSlash: true`, en `images.unoptimized: true`. De site is een statische export. `npm run build` prerendert twee routes:

- `○ /`
- `○ /_not-found`

Er is geen request-time SSR, geen `src/app/api`, geen server actions, geen middleware, geen database. `next start` hoort bij een serverbuild; voor deze export is een statische file server de runtime. Lokaal is dat tijdens de audit `python3 -m http.server` op de map `out/`. Live is GitHub Pages.

Clientcomponenten (`"use client"`):

- `Header.tsx` — scrollstaat en mobiel menu
- `FAQ.tsx` — accordion
- `QuoteForm.tsx` — validatie en submit
- `BeforeAfterSlider.tsx` — range-slider
- `DroneCleaningHeroAnimation.tsx` — GSAP, ongeveer 1100 regels
- `IndustrialDroneCleaningAnimation.tsx` — GSAP

`page.tsx`, `Hero.tsx`, de sectie-shells en de meeste secties zijn servercomponenten. Ze importeren wel client-eilanden, dus de homepage hydrateert alsnog een grote clientbundel (header + hero-animatie + slider + FAQ + formulier).

### Formulier

`QuoteForm` valideert in de browser (`noValidate` + eigen checks): naam minstens 2 tekens, eenvoudige e-mailregex, telefoon optioneel maar minstens 8 cijfers als hij ingevuld is, dienst verplicht, bericht minstens 10 tekens, toestemmingsvinkje verplicht. Fouten hangen via `aria-invalid` en `aria-describedby`, behalve het vinkje: die fouttekst heeft geen `aria-describedby`.

`FORM_ENDPOINT` in `src/lib/contact.ts` is `null`. Bij een geldige submit wordt niets verstuurd. De UI zegt dat de integratie nog niet gekoppeld is. Er is geen honeypot, geen captcha, geen rate limit. Zodra een endpoint wordt gezet, doet de code een `POST` met `Content-Type: application/json` en de velden naam, e-mail, telefoon, dienst en bericht. Waar dat heen gaat, is nog niet gekozen (commentaar noemt Resend, Formspree of een API).

Gemeten: een lege submit op de lokale productiebuild toont “Controleer de gemarkeerde velden.”

### Deploy en hosting

Live site: `https://lodeja.github.io/bdc-web/`.  
`scripts/deploy-gh-pages.sh` bouwt met `GITHUB_PAGES=true` en force-pusht de map `out/` naar branch `gh-pages`. Er is geen GitHub Actions-workflow. `.github/` bevat alleen `README.md` (“GitHub Actions / Pages config”), geen workflow-YAML.

Gemeten responseheaders op de live site:

- HTTP/2, HSTS `max-age=31556952`
- HTML, JS en CSS: `content-encoding: gzip`
- HTML, een hashed JS-chunk én `jdc-wordmark.png`: `cache-control: max-age=600` (10 minuten), ook voor bestanden met een content-hash in de naam
- Geen `Content-Security-Policy` in de gemeten headers

`next.config.ts` kan op GitHub Pages geen eigen cache- of securityheaders afdwingen. De 10 minuten zijn platformgedrag.

### Security-audit van dependencies

`npm audit`: 5 high, 0 critical, 0 moderate, 0 low. Alle vijf zitten in de dev-keten `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces` ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion bij diep geneste glob-patronen). Geen advisory in de productie-runtime (Next, React, GSAP). Dit is een lint-time risico, geen risico voor bezoekers van de statische site.

### Kwaliteitscommando’s

| Commando | Resultaat |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0. 376 packages. Waarschuwing: `eslint@9.39.5` is deprecated |
| `npm run lint` | Exit 0, geen meldingen |
| `npx tsc --noEmit` vóór een Next-build | Exit 2. `src/app/layout.tsx(55,50): Cannot find name 'LayoutProps'` |
| `npm run build` | Exit 0. Next draait tijdens de build zelf TypeScript en die stap slaagt |
| `npx tsc --noEmit` ná de build | Exit 0. `LayoutProps` komt uit gegenereerde Next-types; `next-env.d.ts` staat in `.gitignore` |
| `npm test` | Faalt: geen script |
| `npm outdated` | `gsap` 3.13.0 → 3.15.0 binnen de bestaande range. Major-updates beschikbaar voor TypeScript, ESLint en `@types/node`, buiten de huidige ranges |
| `npm audit` | Exit 1, zie hierboven |

`LayoutProps<'/'>` in de root layout is Next 16-specifiek. Een kale `tsc` op een verse clone faalt tot iemand `next dev` of `next build` heeft gedraaid.

## 2. Huidige ontwerpkwaliteit

De site is één lange Nederlandstalige landingspagina (`lang="nl-BE"`), geen losse URL’s per dienst. Opbouw: sticky header, hero, diensten, industriële reiniging, voordelen, werkwijze, resultaten, FAQ, contact, footer.

Wat er staat, is een samenhangend systeem en geen losse Bootstrap-pagina:

- Beperkt palet: diep navy `#071525` / `#0b1f3a`, mist `#f4f7fb`, signaalcyaan `#00c2e8`.
- Eén schreefloze familie: Geist (via `next/font`), met Geist Mono alleen voor de stapnummers 01–04. Geist is het standaardlettertype van een nieuwe Next.js-app. Het is netjes en neutraal. Het onderscheidt een reinigingsbedrijf niet.
- Vaste maat: `max-w-7xl`, sectiepadding `py-20` / `sm:py-24`, hoeken `rounded-sm`, iconen van Lucide in een navy vakje.
- De hero is het enige stuk met een eigen tekening: een platte SVG-toren, geometrische wolken, een bestelwagen met het JDC-logo, een operator met helm, een drone die ramen schoonmaakt. Dat is maatwerk, geen stockfoto.
- De copy is voorzichtig. Ze belooft geen “altijd veiliger”, geen prijzen, geen verzonnen reviews. Dat is inhoudelijk sterker dan een typische template.

Waar het alsnog generiek wordt, is onder de hero. Diensten, voordelen en werkwijze zijn het bekende ritme van een B2B-landingspagina: drie kaarten met icoon, een bento van zeven punten, vier genummerde stappen, een accordion, een formulier. De kaarten lijken op elkaar. De industriële sectie herhaalt hetzelfde verhaal met een tweede, kleinere animatie. Na de hero is er weinig dat alleen dit bedrijf kan zijn.

De hero zelf heeft een hiërarchieprobleem dat op de screenshots zichtbaar is:

- De achtergrond loopt van donker navy links naar een lichte lucht rechts.
- De kop en de knoppen staan links, op het donkere deel, en lezen goed.
- De navigatie staat rechts, in wit op die lichte lucht, zolang de header transparant is (tot 12 px scroll). Op desktop en op de mobiele hero is dat wit op lichtblauw slecht leesbaar. axe ziet dit niet, omdat de headerachtergrond transparant is en axe niet tegen de lucht achter het element rekent. Het oordeel komt uit de screenshots plus de CSS.
- Het woordmerk is een PNG van 750×756 px (bijna vierkant) en wordt met `h-36` (144 px hoog vanaf de `md`-breakpoint) getoond. Het kader is daardoor ongeveer 143×144 px. Boven een kop van `text-6xl` blijft het merk een compact blok, geen breed woordmerk op de schaal van de zin.

Het voor/na-blok is een SVG van twaalf rechthoeken, met het bijschrift “Illustratie — geen echte projectfoto.” Eerlijk, en visueel het zwakste bewijs op de pagina. Een opdrachtgever die een gevel of panelen wil laten reinigen, ziet nergens een echt gebouw, een echte drone of een echt resultaat.

Zichtbare placeholders breken het premium-gevoel meteen:

- Contact toont schuin: “TODO: e-mailadres invullen in src/lib/contact.ts”, hetzelfde voor telefoon en adres.
- De footer toont “TODO: domein in src/lib/contact.ts” en “TODO: e-mail in src/lib/contact.ts”.
- Onder de verstuurknop staat “Integratie: nog niet gekoppeld aan een mail-/API-endpoint.”

Dat zijn ontwikkelaarsnotities in de publieke HTML. Op een site die offertes moet binnenhalen is dat de zwaarste visuele en vertrouwensfout.

Screenshots (artifacts bij de PR, niet in de repo):

- Desktop hero 1440×900 en volledige pagina (1440×6948).
- Desktop met formuliervalidatie.
- Desktop met reduced motion.
- Mobiel hero, menu, contact en volledige pagina (viewport 390×844, schermafbeelding op 2×).

## 3. Grootste technische en visuele tekortkomingen

1. **De offerte komt nergens aan.** Het formulier valideert en stopt dan, omdat `FORM_ENDPOINT` null is. Telefoon en e-mail zijn lege strings. Een bezoeker kan de site niet omzetten in een aanvraag.
2. **TODO-teksten staan in de live HTML.** Gemeten op de lokale export én ze staan in dezelfde componenten die de live site rendert. Tien keer “TODO” in `out/index.html`, waarvan de contact- en footerregels zichtbaar zijn.
3. **Headercontrast op de hero.** Witte navigatie (`text-white/75`) op een transparante header boven een lichte lucht. De donkere headerbalk verschijnt pas na 12 px scroll.
4. **Bewijs ontbreekt, referentiebeelden staan wel online.** De pagina zegt zelf dat cases en reviews nog niet mogen. Tegelijk liggen stijlreferenties in `public/brand/refs/` en gaan die mee in de export. Live gecontroleerd: `.../brand/refs/meldrone-cleaning-drone.jpg` antwoordt HTTP 200 (133 173 bytes) en `.../brand/refs/style/tamesis-flat-ref.jpg` HTTP 200 (601 035 bytes). Ze staan niet in de UI, wel op het publieke domein. Bestandsnamen en codecommentaar wijzen naar derden (Meldrone, Airbnb, Tamesis). Of dat hergebruik mag, is vanuit deze audit niet vast te stellen. Publiek serveren is hoe dan ook onnodig.
5. **Hero-DOM is zwaar.** Lighthouse telt 1 255 DOM-elementen. De hero-SVG (ramen, sparkles, wolken, voertuig) staat in de HTML vóór de `h1`. De LCP is die `h1`, met het grootste deel van de tijd in render delay (zie sectie 4).
6. **`prefers-reduced-motion` is half toegepast.** Gemeten op de lokale build: de drone heeft opacity 0 (eindbeeld, zoals de code bedoelt) en de wolken verschuiven toch, van transform `-4.5` naar `-10.5` in 700 ms. De oneindige GSAP-wolktimeline start vóór de reduced-motion-tak. CSS zet `scroll-behavior` en `.bdc-fade-up` wel uit.
7. **Typecheck is geen eersteklas script** en faalt op een verse clone door `LayoutProps`.
8. **Deploy is een force-push** zonder CI. Eén script overschrijft `gh-pages`.
9. **Dode en dubbele bestanden.** `motion` wordt niet geïmporteerd. `jdc-mark.png` en `jdc-mono.png` hebben dezelfde SHA-256. `jdc-mark-dark.png`, `jdc-wordmark-dark.png` en `jdc-van-logo-mark.png` worden door geen enkele pagina-variant gebruikt (`Logo` variant `mark` heeft geen call site). `.bdc-section-placeholder` en de kleuren navy-mid, anthracite, mist en white hebben geen tsx-gebruik.
10. **Skills-lock en skills-mappen lopen uiteen.** `skills-lock.json` noemt 78 skills. Op schijf staan er 11, dubbel: een keer onder `.cursor/skills` en een keer onder `.agents/skills`.

## 4. Performance- en SEO-problemen

### Bundel, gemeten op `out/` na `npm run build`

Next 16 drukt geen “First Load JS”-tabel meer. Groottes hieronder zijn de bestanden in `out/`.

Moderne browsers laden 7 scripts (de `noModule`-polyfill van 112 594 bytes / 39 496 bytes gzip wordt overgeslagen). Samen 574 296 bytes raw, 177 805 bytes gzip (`gzip -c`):

| Chunk | Raw | gzip | Inhoud (gezocht in de file) |
| --- | ---: | ---: | --- |
| `3dmm3v_fq28gc.js` | 229 820 | 71 948 | Framework, grootste chunk |
| `1ar3ax_-2xzvy.js` | 168 704 | 46 465 | Framework |
| `3stw-qs_jgjb_.js` | 117 820 | 42 229 | Appcode: treffers op `gsap`, `lucide`, `QuoteForm`, `Drone` |
| `2r4s4h5xul1n-.js` | 28 739 | 7 666 | |
| `0umf92h1sb77c.js` | 13 822 | 3 546 | |
| `turbopack-….js` | 10 030 | 3 972 | |
| `1x6obpmlu1_c2.js` | 5 361 | 1 979 | |

CSS: 52 641 bytes / 9 559 bytes gzip.  
HTML: 162 182 bytes / 27 419 bytes gzip lokaal. Live `content-length` met gzip: 28 055 bytes.  
Twee preloaded woff2-bestanden: 23 108 en 29 288 bytes. `font-display: swap` (11 font-face-regels in de CSS).  
Preloaded beelden: `jdc-wordmark.png` 122 264 bytes (`fetchpriority=high`) en `jdc-mono.png` 91 208 bytes. De SVG haalt daarnaast `jdc-van-logo.png` op, 97 666 bytes. Lighthouse ziet 3 afbeeldingen, samen ongeveer 312 KB.

`images.unoptimized: true` hoort bij `output: "export"` (geen Next-image-optimizer). Logo’s zijn PNG, niet WebP/AVIF, en veel groter dan de weergave (woordmerk 750×756 px getoond op ongeveer 144 px).

### Lighthouse 12.8.2

Simulated throttling. Mobile: CPU 4×, RTT 150 ms. Desktop-preset: CPU 1×, RTT 40 ms.

De lokale server was `python3 -m http.server`. Die gzip’t niet en spreekt HTTP/1.0. Daardoor zijn de lokale mobiele cijfers te pessimistisch voor tekst (JS, CSS, HTML). De live run op GitHub Pages gzip’t wel. Beeld-PNG’s worden ook live niet kleiner door gzip.

| Meting | Performance | Accessibility | Best practices | SEO | FCP | LCP | Speed Index | TBT | CLS | TTI |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Lokaal, mobile, geen gzip | 75 | 96 | 100 | 100 | 1,7 s | 6,8 s | 2,2 s | 130 ms | 0 | 7,1 s |
| Lokaal, desktop-preset, geen gzip | 97 | 96 | 100 | 100 | 0,4 s | 1,3 s | 0,6 s | 10 ms | 0 | 1,3 s |
| Live Pages, mobile, gzip + HTTP/2 | 93 | 96 | 100 | 100 | 1,1 s | 3,1 s | 1,1 s | 110 ms | 0 | 3,3 s |

Live TTFB volgens Lighthouse: “Root document took 20 ms”. Totale transfer live: 581 KiB, 18 requests, document 28 483 bytes. Lokaal zonder compressie: 1 169 KiB.

LCP-element, lokaal én live, mobile: de hero-`h1` “Geavanceerde reiniging. Van gebouwen tot industrie.”  
Fasen live mobile: TTFB 20%, load delay 0%, load time 0%, render delay 80% (2 475 ms van 3,1 s).  
Fasen lokaal desktop: render delay 90% (1 148 ms van 1,3 s).  
Fasen lokaal mobile: render delay 93% (6 308 ms van 6,8 s).

Afgeleid uit die fasen plus de DOM-volgorde: de `h1` is tekst, geen laat beeld. Het grootste deel van de LCP is tijd tot de heading geschilderd wordt, terwijl de zware SVG ervoor in de hero staat en de clientbundel (GSAP inbegrepen) hydrateert. Het woordmerk is wél `fetchpriority=high` gepreload, maar het is niet het LCP-element.

Andere Lighthouse-bevindingen die ook op de live mobile-run gelden:

- Unused JavaScript: 194 KiB op de ongecomprimeerde lokale server, **29 KiB op GitHub Pages**. Het Pages-cijfer is het bruikbare.
- Moderne beeldformaten: geschatte winst 213 KiB. Responsive afbeeldingen: geschatte winst 198 KiB. Zelfde schattingen live.
- Legacy JavaScript: 43 KiB lokaal, 14 KiB live.
- DOM-grootte 1 255, onvoldoende volgens Lighthouse.
- Main thread: 2,3 s lokaal mobile, 2,2 s live mobile.
- Tekstcompressie faalt alleen lokaal (score 0, “591 KiB”). Live score 1. Dat is een meetartefact van `http.server`, geen bug in de site.
- Cache-TTL score 0,5, 13 resources. Live bevestigd: `max-age=600` op HTML, JS én PNG.

CLS is 0 op alle drie de runs. Er is geen third-party script (geen analytics, geen tag manager, geen chatwidget).

### SEO: wat Lighthouse “100” wel en niet dekt

Lighthouse SEO is 100 omdat title, meta description, `lang`, crawlable links en een indexeerbare pagina kloppen. Dat cijfer dekt lokale SEO niet.

Aanwezig, gemeten in bron én live HTML:

- Title: `Janssens Drone Cleaning (JDC) | Professionele drone-reiniging`
- Description over daken, gevels, zonnepanelen, industriële oppervlakken, België
- `robots` index, follow
- Open Graph: type website, locale `nl_BE`, site name, title, description
- Twitter-card `summary` (door Next afgeleid; geen eigen `twitter`-blok in de bron)
- Eén `h1`, daarna `h2` per sectie. Lighthouse heading-order: geslaagd
- Logo’s hebben alt-tekst “Janssens Drone Cleaning”. De hero- en industrie-animaties hebben een `role="img"` met Nederlandstalig `aria-label`
- `lang="nl-BE"`

Afwezig, gemeten (lokale export én live HTTP 404 voor `robots.txt` en `sitemap.xml`):

- Geen `metadataBase`, geen canonical
- Geen Open Graph-afbeelding en geen `og:url`
- Geen sitemap, geen `robots.txt`
- Geen JSON-LD (`LocalBusiness` of anders)
- Geen hreflang-alternates. Voor één taal is dat verdedigbaar; Lighthouse markeert hreflang als geslaagd omdat er geen foutieve tags staan
- De `h1` bevat het woord “drone” niet. Het woord staat in de title, de description en de alinea eronder
- Keywords-meta bevat het Engelse woord “Belgium” naast Nederlandse termen. Keywords-meta heeft voor Google nauwelijks gewicht
- FAQ-antwoorden staan in de HTML (de eerste staat open, de rest heeft `hidden`). Ze zijn niet als `FAQPage`-schema gemarkeerd
- Het werkgebied in de copy is “België” in de meta description. Geen stad, geen provincie, geen adres. Lokale pakketten (Google Business, Maps) hebben hier niets om aan te haken

## 5. Toegankelijkheid en privacy

Landmarks zijn aanwezig: skip-link “Ga naar inhoud”, `header`, `main#main`, `footer`, nav met `aria-label` (hoofd, mobiel, footer). Formuliervelden hebben labels. Lighthouse: label, button-name, link-name, alt, target-size en heading-order slagen.

axe-core 4.10.3, desktop 1440 en mobiel 390, zelfde enige overtreding: `color-contrast`, impact serious, 13 nodes.

| Element | Contrast | Kleuren | Norm voor deze tekstgrootte |
| --- | ---: | --- | --- |
| Stapnummers 01–04, `text-bdc-cyan-dim` | 3,29 | `#009bb8` op `#ffffff` | 4,5 |
| Drie TODO-regels contact, `text-bdc-slate/80` | 3,77 | `#7b8493` op `#ffffff` | 4,5 |
| Footerlabels “Navigatie” en “Gegevens”, `text-white/40` | 3,81 | `#6a737c` op `#071525` | 4,5 |
| Footerregels domein en e-mail, `text-white/45` | 4,47 | `#777e87` op `#071525` | 4,5 |
| Twee kleine footerregels (copyright / “Alle rechten voorbehouden”), `text-white/40` | 3,81 | `#6a737c` op `#071525` | 4,5 |

Knoppen navy-op-cyaan zitten ruim boven 4,5 (berekend 8,65 voor `#071525` op `#00c2e8`). Bodytekst slate `#5a6578` op wit of mist zit rond 5,5–5,9 en haalt AA. Die zijn door axe niet gemarkeerd.

Toetsenbord, deels gemeten: het mobiele menu opent via de knop “Menu openen” en sluit met Escape (focus wordt niet aantoonbaar in het menu gezet; een focus-trap is in de code niet aanwezig). Een volledige tab-ronde en de skip-link zijn niet apart gescreenshot.

Privacy, uit de bron:

- Geen analytics, geen cookies van de site zelf. De gemeten Pages-responses zetten geen `Set-Cookie`.
- Geen cookiebanner. Voor deze statische pagina zonder tracking is dat consistent.
- Het formulier vraagt toestemming om gecontacteerd te worden en zegt dat de gegevens alleen voor de aanvraag dienen. Er is geen privacyverklaring, geen verwerkingsverantwoordelijke, geen bewaartermijn. De footer heeft een JSX-commentaar “TODO: privacyverklaring-link” en toont alleen “Alle rechten voorbehouden”.
- Zolang het formulier niets verstuurt, verwerkt de site ook geen persoonsgegevens. De toestemmingstekst belooft wel al een verwerking die nog niet bestaat.

## 6. Aanbevolen verbeteringen, op impact

1. **Een werkend offertepad.** Echte mailbox of form-endpoint, telefoon, en de TODO-zinnen uit de publieke HTML. Zonder dit converteert de site niet. Spam: minstens een honeypot; captcha pas als misbruik dat nodig maakt.
2. **Publieke bedrijfsgegevens die de eigenaar aanlevert** (sectie 7 hieronder), inclusief een privacyverklaring vóór het formulier echt gaat verzenden.
3. **Header altijd leesbaar op de hero.** Vaste scrim of nav-kleur die op de lichte lucht klopt, ook vóór de eerste scroll.
4. **Contrast van de 13 axe-nodes.** Donkerder cyaan voor de stapnummers, footertekst richting wit/70 of hoger, en de placeholderteksten weg.
5. **Reduced motion afmaken.** De wolktimeline niet starten wanneer de media query matcht. De SMIL-`animate` op de propellers zit in de drone-groep; die groep is bij reduced motion onzichtbaar, de wolken niet.
6. **LCP onder de 2,5 s op mobiel (nu 3,1 s live).** Minder DOM in de hero-SVG, GSAP niet in het kritieke pad van de heading, woordmerk als klein SVG of WebP zonder vierkante padding, en niet twee logo-PNG’s preloaden.
7. **SEO-basis voor één Nederlandstalige bedrijfswebsite.** `metadataBase` op het echte domein, canonical, `robots.txt`, sitemap, Open Graph-beeld, `LocalBusiness`-JSON-LD met alleen gegevens die de eigenaar bevestigt. FAQ-schema pas als de antwoorden definitief zijn.
8. **Referentiebeelden uit `public/` halen** en echte, rechtenvrije projectfoto’s op de resultatenplek zetten. Tot die foto’s er zijn, de illustratie houden en het bijschrift houden.
9. **Oude naam afronden** volgens de checklist bovenaan: eerst de GitHub-beschrijving, dan `package-lock`-naam. De slug `bdc-web` en de CSS-prefix alleen wijzigen als de URL en een brede klasse-hernoeming gepland zijn.
10. **Dode dependencies en dubbele assets.** `motion` verwijderen, identieke `jdc-mark.png` niet meer meeleveren, ongebruikte logo-PNG’s archiveren buiten `public/`.
11. **CI in plaats van force-push.** Lint, `tsc` (na het genereren van Next-types, of een eigen type voor de layout), productiebuild, en een smoke-test. Geen PAT in een lokaal script als enige deploy.

## 7. Ontbrekende informatie die de eigenaar moet aanleveren

De site vult dit nu bewust niet in. Niets hieronder is tijdens de audit “ontdekt” als feit over het bedrijf. Het zijn lege velden en vragen.

Bevestigen of corrigeren wat de copy nu al zegt: diensten dakreiniging, gevelreiniging, zonnepanelen en industriële oppervlakken, werkgebied in de meta description “België”, merken “Janssens Drone Cleaning” en “JDC”.

Aan te leveren voor de site live kan converteren en lokaal gevonden kan worden:

- Definitieve handelsnaam en, als die afwijkt, de statutaire naam
- E-mailadres voor offertes en een telefoonnummer in +32-formaat
- Vestigingsadres of, als er geen publiek adres is, een juist werkgebied (provincies of steden)
- KBO-nummer, BTW-nummer, eventueel RPR
- Het domein waarop de site moet staan (nu alleen het GitHub Pages-pad)
- Waar formulierdata heen mag (mailbox, Formspree, Resend, iets anders) en wie verwerkingsverantwoordelijke is
- Tekst of uitgangspunten voor een privacyverklaring (bewaartermijn, geen verkoop van gegevens)
- Echte foto’s: drone, ploeg, voor/na van uitgevoerde jobs, met toestemming van de klant en rechten op het beeld
- Referenties of cases die gepubliceerd mogen worden, of de expliciete keuze om die blokken leeg te laten
- Verzekering, certificaten en drone-documenten die het bedrijf echt heeft en publiek wil tonen (de site noemt er nu geen enkele)
- Prijslogica: de site noemt geen prijzen. Alleen een vanaf-prijs of “op offerte” publiceren als dat klopt
- Of de repositorynaam en de Pages-URL `bdc-web` mogen blijven, of mee moeten naar een slug met Janssens / JDC

## 8. Gefaseerd uitvoeringsplan

1. **Audit.** Dit document. Geen code.
2. **Tooling.** Playwright + axe in de repo, Lighthouse tegen een server die gzip’t (of tegen de Pages-URL), een `typecheck`-script dat niet faalt op een verse clone, CI op pull requests. De force-push blijft buiten CI tot de deploy bewust herzien is.
3. **Strategie.** Eigenaar levert de lijst uit sectie 7. Besluit over domein, formulierbackend, of de hero een illustratie blijft of echte fotografie krijgt, en of `bdc-web` als URL blijft.
4. **Implementatie.** Contactgegevens, werkend formulier, privacyverklaring, TODO’s weg, contrast en header, sitemap/robots/canonical/JSON-LD, referentiebestanden uit `public/`. Merkchecklist voor beschrijving en lockfile-naam.
5. **Verfijning.** Hero-compositie (woordmerk op de schaal van de kop, lucht versus navigatie), resultaten met echte beelden, typografie als Geist te generiek blijft, copy per dienst aanscherpen met alleen bevestigde feiten.
6. **Optimalisatie.** Hero-SVG uitdunnen, GSAP uit het LCP-pad, logo’s als SVG of WebP op de juiste pixelmaat, ongebruikte `motion` weg, cache alleen verwachten van een host die meer kan dan GitHub Pages’ `max-age=600`.
7. **QA.** Opnieuw Lighthouse mobile op de live URL (doel: LCP onder 2,5 s, accessibility 100), axe zonder serious violations, toetsenbord inclusief skip-link en menu, reduced motion zonder bewegende wolken, formulier tot een testinbox, 404-pagina, en de Pages-build mét `basePath`.
8. **Finale correctie.** Inhoudsronde door de eigenaar op elke zin die een dienst, gebied of garantie noemt. Daarna pas de deploy die `gh-pages` vervangt.

## 9. Dev-tooling die bij deze codebase past

- **Playwright.** De site is één pagina met een menu, een formulier, hash-navigatie en animaties. Er is nog geen test. De skill `.cursor/skills/playwright-cli` ligt al in de repo, een Playwright-config niet. Geschikt voor de paden die hier handmatig zijn gedaan: menu, Escape, lege submit, reduced motion.
- **axe-core, in diezelfde Playwright-run.** De enige echte WCAG-bevinding zat in contrast. Een losse scanner zonder de pagina te bedienen mist het menu niet (het menu zit niet in de DOM tot het open is), dus axe hoort ná de interactie, niet alleen op de eerste paint.
- **Lighthouse CI.** De export is statisch en dus goed automatisch te meten. De lokale run zonder gzip gaf performance 75 tegen 93 op Pages. CI moet gzippen (bijvoorbeeld `serve`) of de gedeployde URL meten, anders worden tekstbestanden ten onrechte als de bottleneck gezien. Mobile én desktop, omdat de hero op mobiel het LCP-probleem draagt (3,1 s versus 1,3 s).
- **Officiële Next-docs of Context7.** De repo heeft geen MCP-config. `AGENTS.md` waarschuwt dat deze Next-versie afwijkt van trainingsdata, en `LayoutProps` is daar een voorbeeld van. Een docs-MCP (Context7 of de officiële Next-documentatie) past bij Next 16 en Tailwind 4. De docs staan ook lokaal in `node_modules/next/dist/docs/` na install.
- **Figma-MCP niet.** Er is geen Figma-bestand in de repo. Het ontwerp leeft in `globals.css` en de componenten. Een Figma-koppeling wordt pas zinvol als het ontwerp daar echt wordt gemaakt.

Bestaande Cursor-setup, kort:

- `AGENTS.md` bevat alleen het automatische Next.js-blok.
- Geen `.cursor/rules`, geen `mcp.json`.
- Skills op schijf: `60fps-animation`, `accessible-animation`, `design-taste-frontend`, `high-end-visual-design`, `image-to-code`, `motion-design`, `playwright-cli`, `premium`, `redesign-existing-projects`, `svg-animation`, `web-design-guidelines`. Dezelfde set staat nog eens onder `.agents/skills`.
- `skills-lock.json` verwijst naar 78 skills, vooral uit `DAChughtai/awesome-design-skills`. Die mappen zitten niet in de checkout. Dat lockfile stuurt een agent naar skills die er niet zijn.

## Bijlage: commando’s en uitkomst

| Commando | Uitkomst |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0, 376 packages, ESLint 9 deprecated-waarschuwing |
| `npm run lint` | Exit 0 |
| `npx tsc --noEmit` (vóór build) | Exit 2, `LayoutProps` onbekend |
| `npm run build` | Exit 0, statische routes `/` en `/_not-found` |
| `npx tsc --noEmit` (na build) | Exit 0 |
| `npm test` | Exit 1, script ontbreekt |
| `npm outdated` | `gsap` achter op 3.15.0; major latest voor typescript, eslint, `@types/node` |
| `npm audit` | Exit 1, 5 high, allemaal dev-keten `braces` / `micromatch` / `fast-glob` |
| `python3 -m http.server 3456 --directory out` | HTTP 200. Gzip’t niet |
| `npx lighthouse@12.8.2` lokaal mobile | Performance 75, accessibility 96, best practices 100, SEO 100, LCP 6,8 s, CLS 0 |
| `npx lighthouse@12.8.2 --preset=desktop` lokaal | Performance 97, accessibility 96, best practices 100, SEO 100, LCP 1,3 s, CLS 0 |
| `npx lighthouse@12.8.2` op `https://lodeja.github.io/bdc-web/` mobile | Performance 93, accessibility 96, best practices 100, SEO 100, LCP 3,1 s, CLS 0, transfer 581 KiB |
| Playwright 1.56.1 core + systeem-Chrome + axe-core 4.10.3 | Screenshots geschreven; axe: alleen `color-contrast` serious, 13 nodes, desktop en mobiel |
| Lege form submit, menu open/Escape, reduced-motion sample | Zie secties 1, 3 en 5 |
| `curl` live headers en twee ref-URL’s | gzip aan, `max-age=600`, ref-JPG’s HTTP 200 |
| `gh repo view` | Beschrijving nog “Belgian Drone Cleaning (BDC)” |

Niet gedraaid: `npm run build:pages` als tweede lokale build (de live site is die Pages-build, met `basePath` `/bdc-web`), een volledige toetsenbord-audit, en een visuele controle van `404.html`.
