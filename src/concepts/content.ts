/** Shared concept copy. No prices, certificates, methods, or results we cannot stand behind. */

export const steps = [
  {
    title: "Aanvraag",
    text: "U beschrijft het object, de locatie en wat u wilt bereiken. Foto's helpen om de haalbaarheid in te schatten.",
  },
  {
    title: "Beoordeling",
    text: "We bekijken bereikbaarheid, ondergrond, omgeving en weersrisico's. Zo bepalen we of drone-reiniging zinvol is. Ook of een vlucht op die plek mag, hoort bij die beoordeling.",
  },
  {
    title: "Voorstel",
    text: "U ontvangt een duidelijke offerte met scope, voorwaarden en wat wél of niet inbegrepen is.",
  },
  {
    title: "Testvlak",
    text: "Bij een kwetsbare ondergrond beginnen we met een klein vlak, voor het hele oppervlak aan de beurt is.",
  },
  {
    title: "Uitvoering",
    text: "Op de afgesproken dag voeren we de reiniging uit.",
  },
  {
    title: "Documentatie",
    text: "Waar relevant documenteren we het resultaat. Een vast rapportformaat volgt met de eerste opdrachten.",
  },
] as const;

export const faqs = [
  {
    question: "Is een drone altijd de juiste keuze?",
    answer:
      "Nee. We beoordelen bereikbaarheid, ondergrond, omgeving en weer. Soms is een stelling, een hoogwerker of touwtechniek beter.",
  },
  {
    question: "Reinigen jullie ook binnenramen?",
    answer: "Nee. Alleen buiten, waar het veilig kan.",
  },
  {
    question: "Wat bij wind of regen?",
    answer:
      "We beoordelen het weer voor de vlucht. Concrete limieten volgen als het toestel vastligt.",
  },
  {
    question: "Welk middel gebruiken jullie?",
    answer:
      "Het middel hangt af van het oppervlak. We noemen geen merknamen tot de producten gekozen zijn.",
  },
  {
    question: "Kunnen panelen of de gevel schade oplopen?",
    answer:
      "Eerst bekijken we het materiaal. Bij een kwetsbare ondergrond beginnen we met een klein testvlak. Garantievoorwaarden verschillen per fabrikant. De methode stemmen we daarop af.",
  },
] as const;

export const methods = [
  {
    name: "Drone",
    fits: "Hoogte en bereik waar een vlucht mag, met minder betreden van het oppervlak.",
    ground: "Een kleinere zone op de grond dan een stelling, na beoordeling van de plek.",
    not: "Niet binnen, en niet waar ondergrond, omgeving of luchtruim het uitsluit.",
  },
  {
    name: "Stelling",
    fits: "Werk dicht bij de gevel, of waar een drone niet mag vliegen.",
    ground: "Neemt straat, tuin of parkeerplaats in.",
    not: "Niet wanneer de opbouw zwaarder weegt dan het werk, of de ondergrond het niet draagt.",
  },
  {
    name: "Hoogwerker",
    fits: "Bereikbare gevels met een stabiele standplaats voor het voertuig.",
    ground: "Voertuig en werkzone op de grond.",
    not: "Niet zonder toegang voor het voertuig, en niet boven wat de arm haalt.",
  },
  {
    name: "Touwtechniek",
    fits: "Plekken waar een persoon aan een lijn het vlak veilig bereikt.",
    ground: "Ankerpunten en een werkzone onderaan.",
    not: "Niet zonder geschikte ankers, en niet waar het risico voor de persoon te groot is.",
  },
] as const;

export const comparisonLead =
  "Geen enkele methode is overal de beste. Hieronder staat wanneer een aanpak past, wat ze op de grond vraagt, en wanneer ze niet past. Zonder snelheids- of prijsvergelijking, want die cijfers hebben we niet.";

export const pioneers =
  "Er zijn nog geen publieke referenties, en we verzinnen er geen. Voorstel, nog niet beslist: bij de eerste projecten een eerlijk verslag van wat één bezoek wel en niet oplost, in ruil voor toestemming om beelden te tonen. Voorwaarden leggen we per aanvraag vast. Het is geen staande belofte van een gratis opdracht.";

export const specs = [
  { label: "werkhoogte", value: "nog niet vastgelegd" },
  { label: "druk", value: "per materiaal, nog geen cijfer" },
  { label: "middel", value: "keuze volgt" },
  { label: "weerlimiet", value: "volgt met het toestel" },
  { label: "documentatie", value: "waar relevant" },
] as const;

export const buildings = [
  { value: "woning", label: "Woning" },
  { value: "appartement", label: "Appartementsgebouw" },
  { value: "kantoor", label: "Kantoor of handelsruimte" },
  { value: "industrie", label: "Industriële site" },
  { value: "onzeker", label: "Nog niet zeker" },
] as const;
