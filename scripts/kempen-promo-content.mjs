/** Kempen summer promo — shared copy for flyers, QR codes, and Facebook posts. */

export const KEMPEN_BRANCH_ID = "concordia-kempen";

/** Always use this URL in print & social QR codes (never staging/local). */
export const KEMPEN_ORDER_URL =
  "https://www.concordiapizza.de/branch/concordia-kempen";

export const KEMPEN_PROMO = {
  headline: "Sommer-Aktion in Kempen",
  subheadline: "Jetzt online bestellen & sparen",
  location: "Concordienplatz 1, Kempen",
  slogan: "Deutsche Herzlichkeit · Italienische Leidenschaft",
  benefits: [
    "10 % automatischer Rabatt auf Online-Bestellungen",
    "Gratis Getränk ab 35 € Bestellwert",
    "Gratis Lieferung in Kempen & Umgebung",
    "Lieferung & Abholung"
  ],
  cta: "Jetzt bestellen",
  hashtags: [
    "#PizzeriaConcordia",
    "#Kempen",
    "#Pizza",
    "#SommerAktion",
    "#OnlineBestellen",
    "#Lieferung",
    "#ItalienischeKüche"
  ]
};

export function facebookPostText() {
  const { headline, benefits, location, slogan, cta, hashtags } = KEMPEN_PROMO;
  return [
    `🍕☀️ ${headline}!`,
    "",
    "Bestellt bequem online bei Pizzeria Concordia Kempen und sichert euch diese Vorteile:",
    "",
    ...benefits.map((b) => `✅ ${b}`),
    "",
    `📍 ${location}`,
    `👉 ${cta}: ${KEMPEN_ORDER_URL}`,
    "",
    `❤️ ${slogan}`,
    "",
    hashtags.join(" "),
    "",
    "Es gelten die jeweiligen Aktionsbedingungen."
  ].join("\n");
}

export function facebookPostShort() {
  return [
    `🍕☀️ ${KEMPEN_PROMO.headline} — 10 % Online-Rabatt, gratis Getränk ab 35 € & gratis Lieferung!`,
    `👉 ${KEMPEN_ORDER_URL}`,
    KEMPEN_PROMO.hashtags.slice(0, 5).join(" ")
  ].join("\n\n");
}
