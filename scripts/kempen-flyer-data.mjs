/** Flyer prices from printed Kempen menu (owner source of truth). */

export const FLYER_PROMOTIONS = {
  freeDrinkMinOrder: 35,
  freeDrinkMessage:
    "Ab 35 € Bestellwert erhalten Sie ein Getränk gratis (0,33 l Softdrink oder 0,5 l Durstlöscher)."
};

/** name suffix match → { basePrice?, klein?, groß?, single? } */
export const FLYER_PRICES = [
  // Pizzen 01–27
  { match: "Pizza Margherita", klein: 5, groß: 7 },
  { match: "Pizza Broccoli", klein: 6.5, groß: 8.5 },
  { match: "Pizza Salami", klein: 6.5, groß: 8.5 },
  { match: "Pizza Prosciutto", klein: 6.5, groß: 8.5 },
  { match: "Pizza Funghi", klein: 6.5, groß: 8.5 },
  { match: "Pizza Tonno", klein: 7, groß: 9 },
  { match: "Pizza Spinaci", klein: 6.5, groß: 8.5 },
  { match: "Pizza Scampi", klein: 8, groß: 10 },
  { match: "Pizza Frutti di Mare", klein: 8, groß: 10 },
  { match: "Pizza Sucuk", klein: 7, groß: 9 },
  { match: "Pizza Tonno e Cipolla", klein: 7.5, groß: 9.5 },
  { match: "Pizza Prosciutto Funghi", klein: 7.5, groß: 9.5 },
  { match: "Pizza Hawaii", klein: 7.5, groß: 9.5 },
  { match: "Pizza Mozzarella", klein: 7.5, groß: 9.5 },
  { match: "Pizza Bolognese", klein: 7, groß: 9 },
  { match: "Pizza Spaghetti Bolognese", klein: 7.5, groß: 9.5 },
  { match: "Pizza Milano", klein: 8, groß: 10 },
  { match: "Pizza Lachs", klein: 8, groß: 10 },
  { match: "Pizza Quattro Stagioni", klein: 8.5, groß: 10.5 },
  { match: "Pizza Quattro Formaggi", klein: 8.5, groß: 10.5 },
  { match: "Pizza Spargel", klein: 8.5, groß: 10.5 },
  { match: "Pizza Rustica", klein: 8.5, groß: 10.5 },
  { match: "Pizza Bruno", klein: 8.5, groß: 10.5 },
  { match: "Pizza Hähnchen", klein: 8.5, groß: 10.5 },
  { match: "Pizza Chef", klein: 8.5, groß: 11 },
  { match: "Pizza Italia", klein: 8, groß: 10 },
  // Pizzen 28–40
  { match: "Pizza Vegetaria A", klein: 8.5, groß: 10.5 },
  { match: "Pizza Vegetaria B", klein: 8.5, groß: 10.5 },
  { match: "Pizza Vegetaria C", klein: 8.5, groß: 10.5 },
  { match: "Pizza Vegetaria D", klein: 8.5, groß: 11 },
  { match: "Pizza Mexico", klein: 8.5, groß: 10.5 },
  { match: "Pizza Concordia", klein: 8.5, groß: 11 },
  { match: "Pizza Bella", klein: 8.5, groß: 10.5 },
  { match: "Pizza Vegas", klein: 8.5, groß: 11 },
  { match: "Calzone Spezial", groß: 10.5 },
  { match: "Calzone Concordia", groß: 10.5 },
  { match: "Calzone Döner", groß: 10.5 },
  { match: "Pizza Parma", klein: 8.5, groß: 12 },
  { match: "Pizza Diavolo", klein: 8, groß: 10 },
  // Party / family
  { match: "Partyblech", single: 26 },
  { match: "Familien-Pizza", single: 17 },
  // Pizzabrötchen — specific names before generic (longest-match resolver)
  { match: "Pizzabrötchen mit Thunfisch, Zwiebeln", single: 8 },
  { match: "Pizzabrötchen mit Dönerfleisch, Paprika und Zwiebeln", single: 8.5 },
  { match: "Pizzabrötchen mit Mozzarella und Tomaten", single: 8.5 },
  { match: "Pizzabrötchen mit Dönerfleisch", single: 8 },
  { match: "Pizzabrötchen mit Spinat", single: 7.5 },
  { match: "Pizzabrötchen mit Käse", single: 6 },
  { match: "Pizzabrötchen mit Thunfisch", single: 7 },
  { match: "Pizzabrötchen mit Salami", single: 7 },
  { match: "Pizzabrötchen mit Hinterschinken", single: 7 },
  { match: "Pizzabrötchen mit Bolognese", single: 7 },
  { match: "Pizzabrötchen mit Sucuk", single: 7 },
  { match: "Pizzabrötchen 10", single: 3.5 },
  { match: "Pizzabrötchen", single: 3.5 },
  { match: "Kräuterbutter", single: 1.5 },
  // Schnitzel (variants: Hähnchen / Schwein)
  { match: "Schnitzel Wiener Art", hähnchen: 10.5, schwein: 10 },
  { match: "Jägerschnitzel", hähnchen: 11, schwein: 10.5 },
  { match: "Paprikaschnitzel", hähnchen: 11, schwein: 10.5 },
  { match: "Champignonschnitzel", hähnchen: 12, schwein: 11.5 },
  { match: "Schnitzel Hawaii", hähnchen: 12, schwein: 11.5 },
  { match: "Broccoli Schnitzel", hähnchen: 12, schwein: 11.5 },
  { match: "Spinat Schnitzel", hähnchen: 12, schwein: 11.5 },
  { match: "Zwiebel Schnitzel", hähnchen: 12, schwein: 11.5 },
  { match: "Hollandaise Schnitzel", hähnchen: 12.5, schwein: 12 },
  // Burger
  { match: "Burger Klassik", single: 8.5 },
  { match: "Doppel-Burger", single: 11.5 },
  { match: "Cheese Burger", single: 9 },
  { match: "Doppel Cheese Burger", single: 12 },
  { match: "Chicken Burger", single: 8 },
  { match: "Chicken Nugget Burger", single: 8 },
  // Pasta
  { match: "Pasta Napoli", single: 9 },
  { match: "Pasta Bolognese", single: 10 },
  { match: "Pasta Carbonara", single: 10 },
  { match: "Pasta Alla Panna", single: 10.5 },
  { match: "Pasta Toscana", single: 11 },
  { match: "Pasta Gorgonzola", single: 10 },
  { match: "Pasta Salmone", single: 11 },
  { match: "Pasta Vegetarisch", single: 11 },
  { match: "Pasta Alla Chef", single: 11 },
  { match: "Pasta Concordia", single: 10.5 },
  { match: "Pasta Formaggi", single: 10.5 },
  // Al Forno
  { match: "Gemüse Auflauf", single: 12 },
  { match: "Döner Auflauf", single: 12 },
  { match: "Penne Auflauf", single: 12 },
  { match: "Spaghetti Auflauf", single: 12 },
  { match: "Tortellini Auflauf", single: 12 },
  // Salate
  { match: "Salat Mista", single: 7.5 },
  { match: "Salat Fantasia", single: 10 },
  { match: "Salat Tonno", single: 9 },
  { match: "Salat Concordia", single: 10 },
  { match: "Salat Primavera", single: 10 },
  { match: "Salat Caprese", single: 9 },
  { match: "Salat Capricciosa", single: 10 },
  { match: "Salat Hawaii", single: 9.5 },
  { match: "Salat Casa", single: 10.5 },
  { match: "Salat Hähnchen", single: 11 },
  // Baguettes
  { match: "Baguette mit Salami", single: 7 },
  { match: "Baguette mit Hinterschinken", single: 7 },
  { match: "Baguette mit Thunfisch und Ei", single: 7.5 },
  { match: "Baguette mit Sucuk und Ei", single: 7.5 },
  { match: "Baguette mit Mozzarella", single: 7.5 },
  { match: "Baguette mit Thunfisch", single: 7 },
  { match: "Baguette mit Sucuk", single: 7 }
];

export function normalizeFlyerName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Longest substring match so "Pizzabrötchen mit Käse" beats bare "Pizzabrötchen". */
export function findFlyerPrice(name) {
  const n = normalizeFlyerName(name);
  let best = null;
  let bestLen = 0;
  for (const entry of FLYER_PRICES) {
    const m = normalizeFlyerName(entry.match);
    if (n.includes(m) && m.length > bestLen) {
      best = entry;
      bestLen = m.length;
    }
  }
  return best;
}

export const PASTA_NOODLE_OPTIONS = [
  { name: "Spaghetti", price: 0 },
  { name: "Penne", price: 0 },
  { name: "Tortellini", price: 0 }
];

export const PASTA_CHEESE_EXTRA = { name: "Mit Käse überbacken", price: 1.5 };

export const SALAD_DRESSING_OPTIONS = [
  { name: "French Dressing", price: 0 },
  { name: "Joghurtsauce", price: 0 },
  { name: "Essig & Öl", price: 0 }
];

export const SCHNITZEL_MEAT_OPTIONS = [
  { name: "Hähnchen", price: 0 },
  { name: "Schwein", price: 0 }
];

/** Free sauce choice for Beilagensalat on schnitzel dishes. */
export const SCHNITZEL_SALAD_SAUCE_OPTIONS = [
  { name: "Cocktail Sauce", price: 0 },
  { name: "Tzatziki Sauce", price: 0 },
  { name: "Joghurt Sauce", price: 0 },
  { name: "Spezial Sauce", price: 0 }
];
