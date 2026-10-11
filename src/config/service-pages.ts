import { services, type Service, type ServiceId } from "@/config/services";

/**
 * Page copy for the five confirmed services. Belgian Dutch (nl-BE), u + we.
 *
 * Owner to confirm before any of these appear in visible copy.
 * `methodNotes` stays null until then, and the page hides a null note.
 * - osmosewater
 * - gedemineraliseerd water
 * - biologisch afbreekbaar middel
 * - hydrofuge
 * - impregneren
 * - softwash
 * - testzone
 * - plaatsbezoek
 * - opleverrapport
 * - voor- en nabeelden
 *
 * Do not add prices, yields, client names, or certificates.
 */

export const methodNotes: Record<string, string | null> = {
  purifiedWater: null,
  biodegradableAgent: null,
  hydrofuge: null,
  impregnate: null,
  softwash: null,
  testPatch: null,
  siteVisit: null,
  handoverReport: null,
  beforeAfterPhotos: null,
};

export type ServiceFaq = {
  q: string;
  a: string;
};

export type ServicePageCopy = {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  definition: string;
  howTitle: string;
  how: readonly string[];
  limits: readonly string[];
  approach: string;
  faqs: readonly ServiceFaq[];
  /** Extra link already on the site, when this service also has a home section. */
  related?: { href: string; label: string };
};

export const servicePageCopy: Record<ServiceId, ServicePageCopy> = {
  dak: {
    metaTitle: "Dak ontmossen met een drone",
    metaDescription:
      "Mos, algen en groene aanslag van uw dak, met zo weinig mogelijk dakbetreding. Janssens Drone Cleaning wast pannen en leien vanop afstand.",
    headline: "Uw dak weer proper, zonder iemand op de pannen",
    definition:
      "Dakreiniging met een drone betekent: we ontmossen het dak vanop afstand, met zo weinig mogelijk dakbetreding.",
    howTitle: "Zo pakken we uw dak aan",
    how: [
      "De drone vliegt boven uw dak en wast van daaruit. Zo hoeft er bijna niemand over uw pannen of leien te lopen.",
      "Soms moet iemand even op het dak om iets klaar te zetten. Dat bekijken we per woning.",
      "We halen mos, algen en groene aanslag weg waar de dakbedekking dat verdraagt. Dit is een wasbeurt, geen herstelling.",
    ],
    limits: [
      "Is de dakbedekking te kwetsbaar voor water, dan wassen we niet.",
      "Bij sterke wind, regen of weinig zicht plannen we een andere dag.",
      "Losse pannen, een lek of een versleten laag horen bij een dakdekker.",
      "Een te smalle binnenplaats of obstakels rond het huis kunnen een vlucht in de weg zitten.",
    ],
    approach:
      "U stuurt foto's van het dak en de omgeving. We zeggen of een drone past, en u krijgt een vrijblijvende offerte. Daarna plannen we de reinigingsbeurt.",
    faqs: [
      {
        q: "Blijft mijn dak daarna mosvrij?",
        a: "Mos komt na een tijd terug, vooral op de schaduwkant en onder bomen. Hoe snel dat gebeurt, verschilt per dak.",
      },
      {
        q: "Komt er iemand op mijn dak?",
        a: "Zo weinig mogelijk. Soms is een korte toegang nodig om iets klaar te zetten of een zone te controleren.",
      },
      {
        q: "Werkt dit op elk dak?",
        a: "Nee. We starten als de dakbedekking, de helling, de bereikbaarheid en het weer een wasbeurt toelaten.",
      },
    ],
  },
  gevel: {
    metaTitle: "Gevel wassen met een drone",
    metaDescription:
      "Groene aanslag en grijze sluier van uw gevel, ook waar een stelling veel plaats vraagt. Voor woningen, kantoren en appartementsgebouwen.",
    headline: "Een grauwe gevel weer fris, zonder stelling voor de deur",
    definition:
      "Gevelreiniging met een drone betekent: we wassen groene aanslag en atmosferische vervuiling van de gevel, vanop de grond.",
    howTitle: "Zo pakken we uw gevel aan",
    how: [
      "De drone wast uw gevel vanop afstand. Ook op hoogtes waar een stelling veel plaats en opbouwtijd vraagt.",
      "Groene aanslag, atmosferische vervuiling en een grijze sluier kunnen wijken als de afwerking dat verdraagt.",
      "Een VME of syndicus kan de gevel van het appartementsgebouw laten wassen. Kleurverschil of oude schade blijft staan wanneer die niet in de wasbeurt zit.",
    ],
    limits: [
      "Een beschermde gevel of een delicate afwerking wassen we pas als het materiaal duidelijk is.",
      "Graffiti, loszittende verf en kapotte voegen vragen een andere aanpak.",
      "Bij wind of regen langs de gevel plannen we een andere dag.",
      "Een smalle straat of een kleine binnenplaats kan de vlucht in de weg zitten.",
    ],
    approach:
      "Foto's van de gevel en de straat volstaan om te starten. In de vrijblijvende offerte staat wat we wassen en wat we laten staan.",
    faqs: [
      {
        q: "Heb ik dan geen stelling meer nodig?",
        a: "Soms wel. Bij een herstelling, of wanneer de drone de gevel niet goed kan naderen, is een stelling of hoogtewerker beter.",
      },
      {
        q: "Raakt de gevel beschadigd?",
        a: "Dat risico zit in het materiaal. Past een wasbeurt niet bij de afwerking, dan starten we niet.",
      },
      {
        q: "Kan elke vlek weg?",
        a: "Nee. Oppervlakkig vuil is iets anders dan ingetrokken verkleuring, verf of schade.",
      },
    ],
  },
  ramen: {
    metaTitle: "Ramen wassen met een drone",
    metaDescription:
      "Buitenglas, omlijstingen en dorpels op hoogte, zonder hoogtewerker voor de deur. Streeploos is het doel. Zon en wind spelen mee bij het drogen.",
    headline: "Ramen en glaspartijen weer helder, ook op hoogte",
    definition:
      "Ramen wassen met een drone betekent: we reinigen het buitenglas, de omlijstingen en de dorpels die we van buitenaf bereiken.",
    howTitle: "Zo wassen we uw ramen",
    how: [
      "De drone bereikt ramen en glaspartijen die anders een hoogtewerker of stelling vragen.",
      "We wassen het buitenoppervlak, de omlijstingen en de dorpels. Binnenglas en kapotte dichtingen vallen erbuiten.",
      "Streeploos is het doel. Zon, wind en het glas zelf bepalen mee hoe het opdroogt.",
    ],
    limits: [
      "Beschadigd, gebarsten of onbekend gecoat glas wassen we pas als dat duidelijk is.",
      "Bij te veel wind plannen we de passage langs het glas op een andere dag.",
      "Diepe dagkanten, luifels of begroeiing kunnen een zone onbereikbaar maken.",
      "Interieurglas wassen we niet met de drone.",
    ],
    approach:
      "Stuur foto's van de glaspartijen en de gevel. We zeggen welke ramen we bereiken, en u krijgt een vrijblijvende offerte.",
    faqs: [
      {
        q: "Worden de ramen streeploos?",
        a: "Dat is het doel. Zon, wind en het glas bepalen mee hoe het droogt. Een streep kan dus blijven.",
      },
      {
        q: "Wassen jullie ook de binnenkant?",
        a: "Nee. Deze dienst gaat over glas dat de drone aan de buitenzijde bereikt.",
      },
      {
        q: "Elk soort glas?",
        a: "Nee. We kijken naar het glas, de bereikbaarheid en de wind. Bij twijfel starten we niet.",
      },
    ],
  },
  zonnepanelen: {
    metaTitle: "Zonnepanelen wassen met een drone",
    metaDescription:
      "Stof, stuifmeel en groene aanslag van uw zonnepanelen, zonder over de panelen te lopen. Geen verzonnen cijfer over meeropbrengst.",
    headline: "Zonnepanelen weer vrij van stof en groene aanslag",
    definition:
      "Zonnepanelen reinigen met een drone betekent: we wassen stof, stuifmeel en groene aanslag van de panelen, zonder erover te lopen.",
    howTitle: "Zo wassen we uw panelen",
    how: [
      "Stof, stuifmeel en groene aanslag leggen een sluier op het paneel. Een wasbeurt haalt dat oppervlakkige vuil weg.",
      "Hoeveel meer uw panelen daarna opbrengen, kunnen we niet op voorhand zeggen. Dat verschilt per vuilgraad, helling en weer. Een cijfer verzinnen we niet.",
      "De fabrikant kan een methode uitsluiten. Geeft u die voorschriften door, dan volgen we die. We kennen ze niet op voorhand.",
    ],
    limits: [
      "Beschadigde of losse panelen wassen we niet wanneer dat het risico vergroot.",
      "We publiceren geen cijfer over meeropbrengst en geven geen garantie op de energieopbrengst.",
      "Een opstelling die de drone niet veilig nadert, laten we liggen.",
      "Een product gebruiken we alleen wanneer dat voor het paneel toegelaten is en nodig blijkt.",
    ],
    approach:
      "Foto's van de panelen en het dak volstaan voor een eerste kijk. U krijgt daarna een vrijblijvende offerte, zonder een verzonnen opbrengstcijfer.",
    faqs: [
      {
        q: "Hoeveel meer opbrengst levert een wasbeurt op?",
        a: "Dat cijfer geven we niet. Het verschilt per vuil, helling, weer en de staat van de installatie. Een vast percentage zou verzonnen zijn.",
      },
      {
        q: "Loopt er iemand over de panelen?",
        a: "De bedoeling is de panelen niet te belopen. Soms is een korte toegang op het dak nodig om iets klaar te zetten.",
      },
      {
        q: "Mag elk paneel nat gewassen worden?",
        a: "Niet blind. Beschadigde panelen en de voorschriften van de fabrikant kunnen een wasbeurt uitsluiten.",
      },
    ],
  },
  industrie: {
    metaTitle: "Industriële reiniging met een drone",
    metaDescription:
      "Wanden, tanks en loodsen wassen met een drone, waar een stelling veel plaats vraagt. We volgen de regels van uw site.",
    headline: "Hoge wanden en loodsen wassen, zonder een volledige stelling",
    definition:
      "Industriële reiniging met een drone betekent: we wassen wanden, tanks of een loods waar een stelling zwaar ingrijpt, als uw site een vlucht toelaat.",
    howTitle: "Zo pakken we een bedrijfssite aan",
    how: [
      "Op een bedrijfssite wegen hoogte, bereikbaarheid en stilstand vaak zwaarder dan bij een woning.",
      "Een drone kan sommige wanden, tanks of een loods bereiken zonder een volledige stelling. Dat kan een loods van een KMO zijn, of een grotere site.",
      "Welk vlak we wassen, spreken we af per site. We kijken naar materiaal, temperatuur, obstakels en of een vlucht het proces stoort.",
    ],
    limits: [
      "Zones met explosiegevaar, hete vlakken of een lopend proces dat geen vlucht toelaat, vallen buiten een gewone opdracht.",
      "Chemische resten, een onbekende coating of een installatie onder druk vragen eerst meer info. Zonder die info starten we niet.",
      "Een drone is niet vanzelf veiliger dan een stelling of hoogtewerker. We kiezen wat bij uw site past.",
      "Bezorg ons vooraf de veiligheidsregels van uw site. We starten pas als de toelatingen rond zijn.",
    ],
    approach:
      "U beschrijft de site en stuurt foto's mee. We zeggen of een drone past, en u krijgt een vrijblijvende offerte. Een vaste stilstandduur spreken we niet af.",
    faqs: [
      {
        q: "Kunnen jullie elke tank of loods wassen?",
        a: "Nee. Alleen vlakken die we veilig bereiken en die het materiaal toelaat.",
      },
      {
        q: "Moet de productie stilliggen?",
        a: "Dat verschilt per site. Soms is een vlucht tijdens de productie niet verantwoord. Een vaste duur spreken we niet af.",
      },
      {
        q: "Is een drone veiliger dan een hoogtewerker?",
        a: "Niet op elke site. We kijken naar de site, het weer en de opdracht, en kiezen dan.",
      },
    ],
    related: {
      href: "/#industriele-reiniging",
      label: "Korte toelichting op de startpagina",
    },
  },
};

export type ServicePage = Service & ServicePageCopy;

export function getServicePage(slug: string): ServicePage | null {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;
  return { ...service, ...servicePageCopy[service.id] };
}
