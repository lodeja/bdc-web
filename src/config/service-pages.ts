import { services, type Service, type ServiceId } from "@/config/services";

/**
 * Page copy for the five confirmed services.
 *
 * OWNER: confirm the on-site method (water, brush, pressure, product) before
 * this copy names a tool. It stays method-agnostic on purpose.
 * OWNER: confirm any surface we must always refuse. Do not add that refusal
 * here until it is confirmed. Do not add prices, yields, client names, or
 * certificates.
 */

export type ServiceFaq = {
  q: string;
  a: string;
};

export type ServicePageCopy = {
  metaDescription: string;
  how: readonly string[];
  limits: readonly string[];
  faqs: readonly ServiceFaq[];
  /** Extra link already on the site, when this service also has a home section. */
  related?: { href: string; label: string };
};

export const servicePageCopy: Record<ServiceId, ServicePageCopy> = {
  dak: {
    metaDescription:
      "Dakreiniging met een drone op geschikte dakvlakken, met minder betreden van het dak. Alleen na beoordeling van bekleding, bereikbaarheid en weer.",
    how: [
      "Een drone brengt de reiniging tot bij het dakvlak. Het dak zelf hoeft daardoor minder belopen te worden dan bij een klassieke betreding. Of er nog een korte toegang op het dak nodig is om op te stellen, hangt af van het gebouw.",
      "Aanslag, mos en fijnstof kunnen verminderen wanneer de dakbekleding een behandeling verdraagt. Welke techniek past, leggen we vast na beoordeling van het materiaal. Die keuze verschilt per dak.",
      "Dit is een reiniging, geen herstelling. Losse pannen, een versleten laag of een lek vallen buiten deze dienst.",
    ],
    limits: [
      "Niet elke bekleding verdraagt water of een mechanische behandeling. Bij twijfel over het materiaal reinigen we niet.",
      "Sterke wind, neerslag of te weinig zicht: geen vlucht. We plannen dan opnieuw.",
      "Een drone vervangt geen controle van de waterdichtheid en geen dakherstelling.",
      "Obstakels, een te smalle koer of geen bruikbare opstelplaats kunnen de vlucht onmogelijk maken.",
    ],
    faqs: [
      {
        q: "Verwijdert dit alle mos voorgoed?",
        a: "Nee. Mos en aanslag kunnen minder worden als de bekleding dat toelaat. Nieuwe aangroei hangt af van schaduw, vocht en het materiaal. We garanderen geen blijvend mosvrij dak.",
      },
      {
        q: "Betreedt iemand het dak?",
        a: "Minder dan bij een gewone dakbetreding, en niet altijd nul. Soms is een korte toegang nodig om op te stellen of om een zone te controleren.",
      },
      {
        q: "Werkt dit op elk daktype?",
        a: "Nee. We starten pas als de bekleding, de helling, de bereikbaarheid en het weer een reiniging toelaten.",
      },
    ],
  },
  gevel: {
    metaDescription:
      "Gevelreiniging met een drone waar een stelling omslachtig is. Alleen na beoordeling van het gevelmateriaal, de omgeving en het weer.",
    how: [
      "De drone behandelt het gevelvlak vanop afstand, op hoogtes waar een stelling veel plaats of tijd vraagt. Dat is een manier om bij het oppervlak te komen, geen reden om elke gevel te reinigen.",
      "Vuil, aanslag en fijnstof kunnen verminderen als de afwerking dat verdraagt. Pleister, verse verf, open natuursteen of een onbekende coating vragen eerst een beoordeling.",
      "We spreken geen resultaat af dat het materiaal niet aankan. Kleurverschil, voegen of onderliggende schade blijven zichtbaar wanneer ze niet in de reiniging zitten.",
    ],
    limits: [
      "Een beschermde gevel of een delicate afwerking: geen start zonder aparte beoordeling.",
      "Graffiti, loszittende verf en kapotte voegen zijn geen standaard reiniging.",
      "Wind en neerslag bepalen of een vlucht langs de gevel verantwoord is.",
      "Niet elke binnenplaats of smalle straat heeft een bruikbare opstelplaats.",
    ],
    faqs: [
      {
        q: "Vervangt dit altijd een stelling?",
        a: "Nee. Soms blijft een stelling of hoogwerker geschikter, bijvoorbeeld bij herstelling of wanneer de drone de gevel niet goed kan naderen.",
      },
      {
        q: "Raakt de gevel beschadigd?",
        a: "Dat risico hangt af van het materiaal en de techniek. Daarom beoordelen we de afwerking vooraf. Past de behandeling niet, dan reinigen we niet.",
      },
      {
        q: "Kan elke vlek weg?",
        a: "Nee. Oppervlakkig vuil is iets anders dan ingetrokken verkleuring, verf of schade.",
      },
    ],
  },
  ramen: {
    metaDescription:
      "Ramen- en glasreiniging met een drone, alleen waar het glas, de bereikbaarheid en de omgeving dat toelaten. Geen streeploze garantie.",
    how: [
      "Een drone kan ramen en glasvlakken bereiken die anders een hoogwerker of stelling vragen. Of dat voor uw glas past, hangt af van het glastype, de indeling, obstakels en de wind.",
      "De reiniging gaat over het buitenoppervlak. Binnenglas, kaders die hersteld moeten worden en kapotte dichtingen vallen erbuiten.",
      "Water, zon en het glas zelf bepalen hoe het droogt. Een streeploos resultaat is geen belofte.",
    ],
    limits: [
      "Beschadigd, gebarsten of onbekend gecoat glas: geen reiniging tot dat duidelijk is.",
      "Te veel wind maakt een gecontroleerde passage langs het glas ongeschikt.",
      "Diepe dagkanten, luifels of begroeiing kunnen zones onbereikbaar maken.",
      "Interieurglas reinigen we niet met de drone.",
    ],
    faqs: [
      {
        q: "Is het resultaat altijd streeploos?",
        a: "Nee. Glas, zon, wind en de droogsnelheid spelen mee. We beloven geen streeploos resultaat.",
      },
      {
        q: "Reinigen jullie ook de binnenkant?",
        a: "Nee. Deze dienst gaat over glas dat de drone aan de buitenzijde kan bereiken.",
      },
      {
        q: "Elk soort glas?",
        a: "Nee. Geschiktheid hangt af van het glas, de bereikbaarheid en de omgeving. Bij twijfel starten we niet.",
      },
    ],
  },
  zonnepanelen: {
    metaDescription:
      "Zonnepanelen reinigen met een drone: een zachte reiniging om lichtinval te herstellen, zonder rendementscijfer of opbrengstgarantie.",
    how: [
      "Stof, stuifmeel en aanslag kunnen het licht op het paneel verminderen. Een zachte reiniging is bedoeld om dat oppervlakkige vuil te verminderen, niet om het paneel te herstellen.",
      "We noemen geen meeropbrengst. Hoeveel lichtinval terugkomt, hangt af van de vuilgraad, de helling, het weer en de staat van de panelen.",
      "De fabrikant van de panelen kan een methode uitsluiten. Geeft u die voorschriften door, dan houden we daar rekening mee. We kennen ze niet op voorhand.",
    ],
    limits: [
      "Beschadigde, losse of duidelijk defecte panelen reinigen we niet wanneer een behandeling het risico vergroot.",
      "We publiceren geen percentage meeropbrengst en geven geen garantie op de energieopbrengst.",
      "Een opstelling die de drone niet veilig nadert, kan de opdracht ongeschikt maken.",
      "Een product gebruiken we alleen wanneer dat voor het paneel toegelaten is en nodig blijkt. Het is geen standaardstap.",
    ],
    faqs: [
      {
        q: "Hoeveel procent meer opbrengst levert dit op?",
        a: "Dat cijfer publiceren we niet. Het hangt af van vuil, helling, weer en de staat van de installatie. Een vast percentage zou verzonnen zijn.",
      },
      {
        q: "Betreedt iemand de panelen?",
        a: "De bedoeling is de panelen niet te belopen. Of een korte toegang op het dak nodig is om op te stellen, beoordelen we per site.",
      },
      {
        q: "Mag elk paneel nat gereinigd worden?",
        a: "Niet blind. Beschadigde panelen en de voorschriften van de fabrikant kunnen een reiniging uitsluiten.",
      },
    ],
  },
  industrie: {
    metaDescription:
      "Industriële reiniging met een drone als aanvulling op klassieke methodes, na beoordeling van de site. Geen standaardaanpak voor elke installatie.",
    how: [
      "Op industriële sites wegen hoogte, bereikbaarheid en stilstand vaak zwaarder dan bij een woning. Een drone kan sommige wanden, tanks of installaties bereiken zonder een volledige stelling. Dat is een aanvulling, geen vervanging van elke klassieke methode.",
      "Welk oppervlak in aanmerking komt, beslissen we na een beoordeling van de site: materiaal, temperatuur, omgeving, obstakels en of een vlucht het proces stoort.",
      "We beloven geen kortere stilstand en geen resultaat op elk industrieel oppervlak. Past de vlucht niet, dan zeggen we dat.",
    ],
    limits: [
      "Zones met explosiegevaar, hete oppervlakken of een lopend proces dat geen vlucht toelaat, vallen buiten een standaardopdracht.",
      "Chemische residu's, een onbekende coating of een installatie onder druk vragen een aparte beoordeling. Zonder die informatie starten we niet.",
      "Een drone is niet automatisch veiliger dan een stelling of hoogwerker. We kiezen wat bij de site past.",
      "Site-regels die u moet aanleveren, vragen we op voorhand. We gaan niet uit van een toelating die er niet is.",
    ],
    faqs: [
      {
        q: "Kunnen jullie elke tank of hal reinigen?",
        a: "Nee. Alleen oppervlakken die na beoordeling bereikbaar en geschikt zijn.",
      },
      {
        q: "Moet de productie stilliggen?",
        a: "Dat hangt af van de site. We spreken geen vaste stilstandduur af. Soms is een vlucht tijdens productie niet verantwoord.",
      },
      {
        q: "Is dit altijd veiliger dan een hoogwerker?",
        a: "Nee. Of een vlucht past, hangt af van de site, het weer en de opdracht. We doen geen algemene veiligheidsclaim.",
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
