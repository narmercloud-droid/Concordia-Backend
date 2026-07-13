/**
 * Printed Kempen menu item numbers (from owner menu photos).
 * Matched to Lieferando/imported names via substring.
 */

export const KEMPEN_CATEGORY_LAYOUT = [
  { name: "Pizzen", sortOrder: 10, description: "Klein 24 cm · Groß 30 cm" },
  {
    name: "Pizzabrötchen",
    sortOrder: 20,
    description: "10 Stück mit Kräuterbutter · Gefüllte Varianten"
  },
  {
    name: "Schnitzel",
    sortOrder: 30,
    description: "Alle Gerichte mit Pommes und Salat"
  },
  { name: "Burger", sortOrder: 40, description: "" },
  { name: "Imbiss", sortOrder: 50, description: "" },
  {
    name: "Pasta",
    sortOrder: 60,
    description: "Wahlweise Spaghetti, Penne oder Tortellini"
  },
  { name: "Al Forno Gerichte", sortOrder: 70, description: "" },
  { name: "Salate", sortOrder: 80, description: "Mit Dressing nach Wahl" },
  {
    name: "Baguettes",
    sortOrder: 90,
    description: "Mit Eisbergsalat, Tomaten, Gurken, Remoulade"
  },
  { name: "Alkoholfreie Getränke", sortOrder: 100, description: "" },
  { name: "Alkoholische Getränke", sortOrder: 110, description: "" }
];

/** Longer matches first at resolve time. */
export const MENU_NUMBER_ENTRIES = [
  // Pizzen 01–26
  { number: "01", match: "Pizza Margherita" },
  { number: "02", match: "Pizza Broccoli" },
  { number: "03", match: "Pizza Salami" },
  { number: "04", match: "Pizza Prosciutto" },
  { number: "05", match: "Pizza Funghi" },
  { number: "06", match: "Pizza Tonno" },
  { number: "07", match: "Pizza Spinaci" },
  { number: "08", match: "Pizza Scampi" },
  { number: "09", match: "Pizza Frutti di Mare" },
  { number: "10", match: "Pizza Sucuk" },
  { number: "11", match: "Pizza Tonno e Cipolla" },
  { number: "12", match: "Pizza Prosciutto Funghi" },
  { number: "13", match: "Pizza Hawaii" },
  { number: "14", match: "Pizza Mozzarella" },
  { number: "15", match: "Pizza Bolognese" },
  { number: "16", match: "Pizza Spaghetti Bolognese" },
  { number: "17", match: "Pizza Milano" },
  { number: "18", match: "Pizza Lachs" },
  { number: "19", match: "Pizza Quattro Stagioni" },
  { number: "20", match: "Pizza Quattro Formaggi" },
  { number: "21", match: "Pizza Spargel" },
  { number: "22", match: "Pizza Rustica" },
  { number: "23", match: "Pizza Bruno" },
  { number: "24", match: "Pizza Enzo" },
  { number: "25", match: "Pizza Hähnchen" },
  { number: "26", match: "Pizza Chef" },
  { number: "27", match: "Pizza Italia" },
  // Pizzen 28–40
  { number: "28", match: "Pizza Vegetaria A" },
  { number: "29", match: "Pizza Vegetaria B" },
  { number: "30", match: "Pizza Vegetaria C" },
  { number: "31", match: "Pizza Vegetaria D" },
  { number: "32", match: "Pizza Mexico" },
  { number: "33", match: "Pizza Concordia" },
  { number: "34", match: "Pizza Bella" },
  { number: "35", match: "Pizza Vegas" },
  { number: "36", match: "Calzone Spezial" },
  { number: "37", match: "Calzone Concordia" },
  { number: "38", match: "Calzone Döner" },
  { number: "39", match: "Pizza Parma" },
  { number: "40", match: "Pizza Diavolo" },
  // Party
  { number: "200", match: "Partyblech" },
  { number: "201", match: "Familien-Pizza" },
  // Pizzabrötchen
  { number: "45", match: "Pizzabrötchen 10 Stück" },
  { number: "45a", match: "Kräuterbutter" },
  { number: "46", match: "Pizzabrötchen mit Käse" },
  { number: "53", match: "mit Thunfisch, Zwiebeln" },
  { number: "47", match: "Pizzabrötchen mit Thunfisch" },
  { number: "48", match: "Pizzabrötchen mit Salami" },
  { number: "49", match: "Pizzabrötchen mit Hinterschinken" },
  { number: "50", match: "Pizzabrötchen mit Bolognese" },
  { number: "51", match: "Pizzabrötchen mit Sucuk" },
  { number: "52", match: "Pizzabrötchen mit Spinat" },
  { number: "54", match: "Pizzabrötchen mit Dönerfleisch" },
  // Schnitzel 60–68
  { number: "60", match: "Schnitzel Wiener Art" },
  { number: "61", match: "Jägerschnitzel" },
  { number: "62", match: "Paprikaschnitzel" },
  { number: "63", match: "Champignonschnitzel" },
  { number: "64", match: "Schnitzel Hawaii" },
  { number: "65", match: "Broccoli Schnitzel" },
  { number: "66", match: "Spinat Schnitzel" },
  { number: "67", match: "Zwiebel Schnitzel" },
  { number: "68", match: "Hollandaise Schnitzel" },
  // Burger 70–75
  { number: "70", match: "Burger Klassik" },
  { number: "71", match: "Doppel-Burger" },
  { number: "72", match: "Cheese Burger" },
  { number: "72", match: "Chess Burger" },
  { number: "73", match: "Doppel Cheese Burger" },
  { number: "73", match: "Doppel Chess Burger" },
  { number: "74", match: "Chicken Burger" },
  { number: "75", match: "Chicken Nugget Burger" },
  // Imbiss 80–96
  { number: "80", match: "Pommes frites" },
  { number: "81", match: "Pommes Spezial" },
  { number: "84", match: "Bratwurst" },
  { number: "85", match: "Currywurst" },
  { number: "83", match: "Bratrolle Spezial" },
  { number: "82", match: "Bratrolle" },
  { number: "90", match: "Rindfleischkrokette" },
  { number: "87", match: "Chicken Wings" },
  { number: "86", match: "Chicken Nuggets" },
  { number: "88", match: "Kartoffel-Kroketten" },
  { number: "89", match: "Mozzarella Sticks" },
  { number: "95", match: "Mayonnaise" },
  { number: "96", match: "Ketchup" },
  // Pasta 100–110
  { number: "100", match: "Pasta Napoli" },
  { number: "101", match: "Pasta Bolognese" },
  { number: "102", match: "Pasta Carbonara" },
  { number: "103", match: "Pasta Alla Panna" },
  { number: "104", match: "Pasta Toscana" },
  { number: "105", match: "Pasta Gorgonzola" },
  { number: "106", match: "Pasta Salmone" },
  { number: "107", match: "Pasta Vegetarisch" },
  { number: "108", match: "Pasta Alla Chef" },
  { number: "109", match: "Pasta Concordia" },
  { number: "110", match: "Pasta Formaggi" },
  // Al Forno 120–124
  { number: "120", match: "Gemüse Auflauf" },
  { number: "121", match: "Döner Auflauf" },
  { number: "122", match: "Penne Auflauf" },
  { number: "123", match: "Spaghetti Auflauf" },
  { number: "124", match: "Tortellini Auflauf" },
  // Salate 151–160
  { number: "151", match: "Salat Mista" },
  { number: "152", match: "Salat Fantasia" },
  { number: "153", match: "Salat Tonno" },
  { number: "154", match: "Salat Concordia" },
  { number: "155", match: "Salat Primavera" },
  { number: "156", match: "Salat Caprese" },
  { number: "157", match: "Salat Capricciosa" },
  { number: "158", match: "Salat Hawaii" },
  { number: "159", match: "Salat Casa" },
  { number: "160", match: "Salat Hähnchen" },
  // Baguettes 161–167
  { number: "161", match: "Baguette mit Salami" },
  { number: "162", match: "Baguette mit Hinterschinken" },
  { number: "164", match: "Baguette mit Thunfisch und Ei" },
  { number: "166", match: "Baguette mit Sucuk und Ei" },
  { number: "167", match: "Baguette mit Mozzarella" },
  { number: "163", match: "Baguette mit Thunfisch" },
  { number: "165", match: "Baguette mit Sucuk" }
];

const sortedEntries = [...MENU_NUMBER_ENTRIES].sort(
  (a, b) => b.match.length - a.match.length
);

function normalize(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveItemNumber(name) {
  const n = normalize(name);
  for (const entry of sortedEntries) {
    if (n.includes(normalize(entry.match))) {
      return entry.number;
    }
  }
  return null;
}

export function numberSortKey(itemNumber) {
  if (!itemNumber) return 99999;
  const match = String(itemNumber).match(/^(\d+)([a-z])?$/i);
  if (!match) return 99999;
  const base = Number.parseInt(match[1], 10);
  const suffix = match[2] ? match[2].toLowerCase().charCodeAt(0) - 96 : 0;
  return base * 10 + suffix;
}
