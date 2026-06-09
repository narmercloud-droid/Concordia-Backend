/**
 * Straelen printed menu (owner photos, June 2026).
 * Used by import-straelen-menu.mjs — branch stays coming_soon until activated.
 */

import {
  PASTA_CHEESE_EXTRA,
  PASTA_NOODLE_OPTIONS
} from "./kempen-flyer-data.mjs";

export const STRAELEN_BRANCH = {
  id: "concordia-straelen",
  name: "Concordia Straelen",
  status: "coming_soon",
  city: "Straelen",
  address: "Venloer Straße 22",
  postalCode: "47638",
  lat: 51.4412,
  lng: 6.2684,
  terminalCode: "STRAELEN",
  websiteUrl: "https://www.pizzaconcordia2.de/",
  lieferandoUrl: "https://www.lieferando.de/speisekarte/pizzeria-concordia-ll"
};

export const STRAELEN_CATEGORIES = [
  {
    name: "Pizzen",
    sortOrder: 10,
    description: "Alle Pizzen mit Tomatensauce, Käse und Oregano · Klein 24 cm · Groß 30 cm"
  },
  {
    name: "Calzone",
    sortOrder: 20,
    description: "Groß 30 cm · zugeklappte Pizza"
  },
  {
    name: "Pizzabrötchen",
    sortOrder: 30,
    description: "Mit Kräuterbutter"
  },
  {
    name: "Gefüllte Pizzabrötchen",
    sortOrder: 40,
    description: "Mit Tomatensauce und Käse, dazu Kräuterbutter"
  },
  {
    name: "Baguettes",
    sortOrder: 50,
    description: "Alle Baguettes mit Eisbergsalat, Tomaten, Gurken und Remoulade"
  },
  {
    name: "Döner-Gerichte",
    sortOrder: 60,
    description: "Kalb- oder Hähnchenfleisch vom Drehspieß · Sauce nach Wahl"
  },
  {
    name: "Schnitzel",
    sortOrder: 70,
    description: "Alle Schnitzel paniert, mit Pommes und Salat · Hähnchen oder Schwein"
  },
  { name: "Imbiss", sortOrder: 80, description: "" },
  {
    name: "Burger",
    sortOrder: 90,
    description: "Alle Burger mit Eisbergsalat, Gurke, Tomaten, Zwiebeln und Sauce"
  },
  {
    name: "Pasta",
    sortOrder: 100,
    description: "Mit 5 Pizzabrötchen und Kräuterbutter · Wahlweise Spaghetti, Penne oder Tortellini"
  },
  {
    name: "Al Forno Gerichte",
    sortOrder: 110,
    description: "Mit Käse überbacken · Mit 5 Pizzabrötchen und Kräuterbutter"
  },
  {
    name: "Grill-Gerichte",
    sortOrder: 120,
    description: "Mit Grilltomate-Paprika und Pommes oder Reis und Salat"
  },
  {
    name: "Salate",
    sortOrder: 130,
    description: "Mit Dressing nach Wahl · Mit 5 Pizzabrötchen und Kräuterbutter"
  },
  { name: "Getränke", sortOrder: 140, description: "" }
];

const STRAELEN_SALAD_DRESSINGS = [
  { name: "French Dressing", price: 0 },
  { name: "Joghurtsauce", price: 0 },
  { name: "Honig-Senf-Sauce", price: 0 },
  { name: "Granatapfel-Dressing", price: 0 },
  { name: "Essig & Öl", price: 0 }
];

function sizes(klein, gross) {
  return [
    {
      externalId: "klein",
      name: "klein 24 cm",
      priceDelivery: klein,
      pricePickup: klein
    },
    {
      externalId: "gross",
      name: "groß 30 cm",
      priceDelivery: gross,
      pricePickup: gross
    }
  ];
}

function grossOnly(price) {
  return [
    {
      externalId: "gross",
      name: "groß 30 cm",
      priceDelivery: price,
      pricePickup: price
    }
  ];
}

function pastaOptions() {
  return {
    requiredGroups: [
      {
        name: "Nudelsorte",
        required: true,
        options: PASTA_NOODLE_OPTIONS.map((opt, index) => ({
          externalId: `noodle-${index}`,
          name: opt.name,
          priceDelivery: opt.price,
          pricePickup: opt.price
        }))
      }
    ],
    extraGroups: [
      {
        name: "Extras",
        required: false,
        min: 0,
        max: 1,
        options: [
          {
            externalId: "cheese-gratin",
            name: PASTA_CHEESE_EXTRA.name,
            priceDelivery: PASTA_CHEESE_EXTRA.price,
            pricePickup: PASTA_CHEESE_EXTRA.price
          }
        ]
      }
    ]
  };
}

function saladOptions() {
  return {
    requiredGroups: [
      {
        name: "Dressing",
        required: true,
        options: STRAELEN_SALAD_DRESSINGS.map((opt, index) => ({
          externalId: `dressing-${index}`,
          name: opt.name,
          priceDelivery: opt.price,
          pricePickup: opt.price
        }))
      }
    ]
  };
}

function schnitzelOptions(chicken, pork) {
  return {
    requiredGroups: [
      {
        name: "Fleisch",
        required: true,
        options: [
          {
            externalId: "haehnchen",
            name: "Hähnchen",
            priceDelivery: chicken,
            pricePickup: chicken
          },
          {
            externalId: "schwein",
            name: "Schwein",
            priceDelivery: pork,
            pricePickup: pork
          }
        ]
      }
    ]
  };
}

function product({
  itemNumber,
  categoryName,
  name,
  description = null,
  price,
  sizes: sizeList = [],
  requiredGroups = [],
  extraGroups = [],
  kitchen
}) {
  const isPizza =
    categoryName === "Pizzen" ||
    categoryName === "Calzone" ||
    name.toLowerCase().includes("pizza") ||
    name.toLowerCase().includes("calzone");

  return {
    itemNumber: String(itemNumber),
    categoryName,
    name,
    description,
    priceDelivery: price,
    pricePickup: price,
    sizes: sizeList,
    requiredGroups,
    extraGroups,
    kitchen: kitchen ?? (isPizza ? "A" : "B")
  };
}

function pizza(itemNumber, name, description, klein, gross) {
  return product({
    itemNumber,
    categoryName: "Pizzen",
    name: `Pizza ${name}`,
    description,
    price: klein,
    sizes: sizes(klein, gross)
  });
}

function calzone(itemNumber, name, description, price) {
  return product({
    itemNumber,
    categoryName: "Calzone",
    name,
    description,
    price,
    sizes: grossOnly(price)
  });
}

function schnitzel(itemNumber, name, description, chicken, pork) {
  return product({
    itemNumber,
    categoryName: "Schnitzel",
    name,
    description,
    price: pork,
    ...schnitzelOptions(chicken, pork)
  });
}

function pasta(itemNumber, name, description, price) {
  return product({
    itemNumber,
    categoryName: "Pasta",
    name: `Pasta ${name}`,
    description,
    price,
    ...pastaOptions()
  });
}

function salad(itemNumber, name, description, price) {
  return product({
    itemNumber,
    categoryName: "Salate",
    name,
    description,
    price,
    ...saladOptions()
  });
}

function simple(categoryName, itemNumber, name, description, price) {
  return product({ itemNumber, categoryName, name, description, price });
}

export const STRAELEN_PRODUCTS = [
  // —— Pizzen ——
  pizza("01", "Margherita", "Tomatensauce und Käse (keine weitere Zutat möglich)", 5, 7),
  pizza("02", "Salami", "Salami", 6.5, 8.5),
  pizza("03", "Prosciutto", "Hinterschinken", 6.5, 8.5),
  pizza("04", "Funghi", "frische Champignons", 6.5, 8.5),
  pizza("05", "Tonno", "Thunfisch", 7, 9),
  pizza("06", "Spinaci", "Spinat und Knoblauch", 6.5, 8.5),
  pizza("07", "Bolognese", "Hackfleischsauce und Zwiebeln", 7, 9),
  pizza("08", "Frutti di Mare", "Meeresfrüchte und Knoblauch", 8, 10),
  pizza("09", "Scampi", "Krabben und Knoblauch", 8, 10),
  pizza("10", "Sucuk", "türk. Knoblauchwurst", 7, 9),
  pizza("11", "Prosciutto Funghi", "Hinterschinken und Champignons", 7.5, 9.5),
  pizza("12", "Hawaii", "Hinterschinken und Ananas", 7.5, 9.5),
  pizza("13", "Spaghetti Bolognese", "Spaghetti und Hackfleischsauce", 7.5, 9.5),
  pizza("14", "Lachs", "Spinat, Lachs und Knoblauch", 8, 10),
  pizza("15", "Vegetaria", "Spinat, Paprika, Broccoli, frische Champignons", 8.5, 10.5),
  pizza("16", "Quattro Formaggi", "Gorgonzola, Gouda, Fetakäse, Mozzarella", 8.5, 10.5),
  pizza("17", "Quattro Stagioni", "Salami, Hinterschinken, Thunfisch, rote Zwiebeln", 8.5, 10.5),
  pizza("18", "Hähnchen", "Hähnchenbruststreifen, Broccoli, Sauce Hollandaise", 8.5, 10.5),
  pizza("19", "Döner", "Hähnchen- oder Kalbfleisch und rote Zwiebeln", 8.5, 10.5),
  pizza("20", "Concordia Döner", "Dönerfleisch, Zwiebeln, Paprika, Broccoli, Sauce Hollandaise", 8.5, 11),
  pizza("21", "Botan Döner", "Dönerfleisch, Tomaten, Paprika, Sauce Hollandaise", 8.5, 11),
  pizza("22", "Parma", "Rucola, Parmaschinken, Parmesankäse, Cherrytomaten", 8.5, 12),
  pizza("23", "Diavolo", "Salami, Thunfisch, Paprika, Peperoni", 8, 10),
  pizza("24", "Rustica", "Hinterschinken, Thunfisch, Zwiebeln, Paprika, scharfe Peperoni", 8.5, 10.5),
  pizza("25", "Roma", "Krabben, Spinat, Broccoli, Thunfisch, Knoblauch", 8.5, 11),
  simple(
    "Pizzen",
    "200",
    "Partyblech 40 x 60 cm Margherita",
    "Jede weitere Zutat ab 5,00 €",
    26
  ),

  // —— Calzone ——
  calzone(
    "30",
    "Calzone Spezial",
    "Thunfisch, rote Zwiebeln, Fetakäse, scharfe Peperoni",
    10.5
  ),
  calzone(
    "31",
    "Calzone Concordia",
    "Hinterschinken, Salami, Thunfisch, rote Zwiebeln, Peperoni",
    10.5
  ),
  calzone(
    "32",
    "Calzone Döner",
    "Dönerfleisch (Hähnchen oder Kalb), Fetakäse, Peperoni",
    10.5
  ),

  // —— Pizzabrötchen ——
  simple("Pizzabrötchen", "40", "Pizzabrötchen (10 Stück)", "mit Kräuterbutter", 3.5),
  simple("Pizzabrötchen", "45", "Portion Kräuterbutter", null, 1.5),

  // —— Gefüllte Pizzabrötchen ——
  simple("Gefüllte Pizzabrötchen", "50", "Pizzabrötchen mit Käse", null, 6),
  simple("Gefüllte Pizzabrötchen", "51", "Pizzabrötchen mit Thunfisch", null, 7),
  simple("Gefüllte Pizzabrötchen", "52", "Pizzabrötchen mit Salami", null, 7),
  simple("Gefüllte Pizzabrötchen", "53", "Pizzabrötchen mit Hinterschinken", null, 7),
  simple("Gefüllte Pizzabrötchen", "54", "Pizzabrötchen mit Bolognese", null, 7),
  simple("Gefüllte Pizzabrötchen", "55", "Pizzabrötchen mit Sucuk", null, 7),
  simple("Gefüllte Pizzabrötchen", "56", "Pizzabrötchen mit Spinat und Fetakäse", null, 7.5),
  simple(
    "Gefüllte Pizzabrötchen",
    "57",
    "Pizzabrötchen mit Thunfisch, Zwiebeln und Fetakäse",
    null,
    8
  ),
  simple(
    "Gefüllte Pizzabrötchen",
    "58",
    "Pizzabrötchen mit Dönerfleisch",
    "Kalb- oder Hähnchen-Dönerfleisch",
    8
  ),
  simple(
    "Gefüllte Pizzabrötchen",
    "59",
    "Pizzabrötchen mit Mozzarella und Tomaten",
    null,
    8.5
  ),
  simple(
    "Gefüllte Pizzabrötchen",
    "60",
    "Pizzabrötchen mit Dönerfleisch, Paprika und Zwiebeln",
    null,
    8.5
  ),

  // —— Baguettes ——
  simple("Baguettes", "70", "Baguette mit Salami", null, 7),
  simple("Baguettes", "71", "Baguette mit Hinterschinken", null, 7),
  simple("Baguettes", "72", "Baguette mit Thunfisch", null, 7),
  simple("Baguettes", "73", "Baguette mit Thunfisch und Ei", null, 7.5),
  simple("Baguettes", "74", "Baguette mit Sucuk", null, 7),
  simple("Baguettes", "75", "Baguette mit Mozzarella", null, 7.5),

  // —— Döner ——
  simple("Döner-Gerichte", "80", "Dönertasche klein", "Fleisch, Salat, Sauce", 8),
  simple("Döner-Gerichte", "81", "Dönertasche groß", "Fleisch, Salat, Sauce", 11.5),
  simple("Döner-Gerichte", "82", "Döner-Teller", "Fleisch, Pommes oder Reis und Salat", 12.5),
  simple(
    "Döner-Gerichte",
    "83",
    "Concordia-Teller",
    "Fleisch, Currywurst, Pommes oder Reis und Salat",
    12.5
  ),
  simple(
    "Döner-Gerichte",
    "84",
    "New York-Teller",
    "Fleisch, Sauce Hollandaise, Pommes mit Käse überbacken und Salat",
    13.5
  ),
  simple("Döner-Gerichte", "87", "Lahmacun", "mit Fleisch und Salat", 8.5),
  simple("Döner-Gerichte", "88", "Lahmacun", "nur mit Salat", 7.5),
  simple("Döner-Gerichte", "89", "Dürüm", "mit Fleisch und Salat", 8.5),
  simple("Döner-Gerichte", "90", "Döner-Box", "mit Fleisch und Pommes", 8),
  simple("Döner-Gerichte", "91", "Salatbrot klein", "Salat und Sauce", 6.5),
  simple("Döner-Gerichte", "92", "Salatbrot groß", "Salat und Sauce", 8.5),
  simple("Döner-Gerichte", "93", "Falafel-Tasche", "Falafel im Brot mit Salat und Sauce", 8),
  simple("Döner-Gerichte", "94", "Falafel-Teller", "Falafel mit Pommes und Salat", 11),

  // —— Schnitzel ——
  schnitzel("100", "Schnitzel Wiener Art", "mit Zitronenscheibe", 10.5, 10),
  schnitzel("101", "Jägerschnitzel", "mit Jägersauce", 11, 10.5),
  schnitzel("102", "Paprikaschnitzel", "mit Balkansauce", 11, 10.5),
  schnitzel("103", "Champignonschnitzel", "Champignons und Sahnesauce", 12, 11.5),
  schnitzel("104", "Schnitzel Hawaii", "Hinterschinken, Ananas und Sahnesauce", 12, 11.5),
  schnitzel("105", "Broccoli Schnitzel", "Broccoli und Sahnesauce", 12, 11.5),
  schnitzel("106", "Spinat Schnitzel", "Spinat, Knoblauch und Sahnesauce", 12, 11.5),
  schnitzel("107", "Zwiebel Schnitzel", "gebratene Zwiebeln und Sahnesauce", 12, 11.5),
  schnitzel("108", "Spargel Schnitzel", "Spargel und Sauce Hollandaise", 12, 11.5),
  schnitzel(
    "109",
    "Hollandaise Schnitzel",
    "Broccoli, Champignons, rote Zwiebeln und Sauce Hollandaise",
    12.5,
    12
  ),

  // —— Imbiss ——
  simple("Imbiss", "115", "Pommes frites", null, 3),
  simple("Imbiss", "116", "Pommes Spezial", null, 4.5),
  simple("Imbiss", "117", "Bratrolle mit Pommes", "Geflügelseparatorenfleisch", 6),
  simple("Imbiss", "118", "Bratrolle Spezial mit Pommes", "Geflügelseparatorenfleisch", 7.5),
  simple("Imbiss", "119", "Currywurst mit Pommes", null, 6.5),
  simple("Imbiss", "120", "Chicken Nuggets (6 Stück) mit Pommes", null, 6),
  simple("Imbiss", "121", "Chicken Wings (8 Stück) mit Pommes", null, 8.5),
  simple("Imbiss", "122", "Kartoffel-Kroketten (6 Stück)", null, 3.5),
  simple("Imbiss", "123", "Mozzarella Sticks (6 Stück) mit Pommes", null, 8),
  simple("Imbiss", "124", "Mozzarella Chili Sticks (6 Stück) mit Pommes", null, 8),
  simple("Imbiss", "125", "Bami mit Pommes", null, 6),
  simple("Imbiss", "126", "Rindfleischkrokette mit Pommes", null, 6),
  simple(
    "Imbiss",
    "127",
    "Mix-Teller",
    "4 Nuggets, 4 Chicken Wings, 1 Bratrolle, 4 Mozzarella Sticks",
    12
  ),
  simple("Imbiss", "128", "Mayonnaise", null, 1),
  simple("Imbiss", "129", "Ketchup", null, 1),

  // —— Burger ——
  simple("Burger", "131", "Hamburger", "180 g Rinderhackfleisch", 8.5),
  simple("Burger", "132", "Cheese Burger", "180 g Rinderhackfleisch und Käse", 9),
  simple("Burger", "133", "Doppel Burger", "2 x 180 g Rinderhackfleisch", 12),
  simple("Burger", "134", "Doppel Cheese Burger", "2 x 180 g Rinderhackfleisch und Käse", 13),
  simple("Burger", "135", "Chicken Burger", "135 g Hähnchenfleisch", 8),

  // —— Pasta ——
  pasta("140", "Napoli", "mit Tomatensauce", 9),
  pasta("141", "Bolognese", "mit Hackfleischsauce", 10),
  pasta("142", "Carbonara", "mit Schinken, Ei und Sahnesauce", 10),
  pasta("143", "Alla Panna", "mit Schinken, Champignons und Sahnesauce", 10.5),
  pasta("144", "Toscana", "mit Schinken, Krabben, Champignons, Knoblauch und Tomaten-Sahnesauce", 11),
  pasta("145", "Gorgonzola", "Broccoli, Champignons, Gorgonzola und Sahnesauce", 10),
  pasta("146", "Lachs", "Spinat, Lachs, Knoblauch und Sahnesauce", 11),
  pasta(
    "147",
    "Vegetarisch",
    "Broccoli, Paprika, Champignons, Zwiebeln und Tomaten-Sahnesauce",
    11
  ),
  pasta(
    "148",
    "Alla Chef",
    "Hähnchenbruststreifen, Champignons, Mais, Gouda und Tomaten-Sahnesauce",
    11
  ),
  pasta("149", "Capri", "Hähnchenbruststreifen, Champignons, Ananas und Curry-Sahnesauce", 10.5),
  pasta("150", "Formaggi", "vier Käsesorten und Sahnesauce", 10.5),
  pasta(
    "151",
    "Döner",
    "Kalb- oder Hähnchen-Döner, Zwiebeln, Paprika, Champignons und Sahnesauce",
    11.5
  ),

  // —— Al Forno ——
  simple(
    "Al Forno Gerichte",
    "155",
    "Mozzarella Auflauf",
    "Penne, Mozzarella, Champignons, Spinat, Broccoli, Paprika, Zwiebeln, Cherrytomaten",
    12
  ),
  simple(
    "Al Forno Gerichte",
    "156",
    "Döner Auflauf",
    "Dönerfleisch, Tomaten, Zwiebeln, Feta, Paprika und Sahnesauce",
    12
  ),
  simple(
    "Al Forno Gerichte",
    "157",
    "Penne Auflauf",
    "Champignons, Broccoli, Mais und Sahnesauce",
    12
  ),
  simple(
    "Al Forno Gerichte",
    "158",
    "Tortellini Auflauf",
    "Schinken, Broccoli und Sahnesauce",
    12
  ),

  // —— Grill ——
  simple("Grill-Gerichte", "160", "Rinderhackfleisch-Spieß (2 Stück)", null, 14),
  simple("Grill-Gerichte", "161", "Rindfleisch-Spieß (2 Stück)", null, 14),
  simple("Grill-Gerichte", "162", "Hähnchenbrust-Spieß (2 Stück)", null, 14),
  simple("Grill-Gerichte", "163", "Lammkoteletts (4 Stück)", null, 17.5),
  simple(
    "Grill-Gerichte",
    "164",
    "Gemischter Teller",
    "1 Hackspieß, 1 Rindspieß, 1 Hähnchenspieß, 2 Lammkoteletts",
    20
  ),

  // —— Salate ——
  salad("171", "Salat Mista", "gemischter Salat, Mais und Paprika", 7.5),
  salad("172", "Salat Primavera", "gemischter Salat, Oliven, Feta, Artischocken und Ei", 10),
  salad("173", "Salat Tonno", "gemischter Salat, Thunfisch, Oliven und Mais", 10),
  salad("174", "Salat Concordia", "gemischter Salat, Krabben, Champignons und Rucola", 10),
  salad("175", "Salat Caprese", "Tomaten, Mozzarella und Rucola", 9),
  salad("176", "Salat Capricciosa", "gemischter Salat, Thunfisch, Ei, Schinken und Käse", 10),
  salad("177", "Salat Hawaii", "gemischter Salat, Schinken, Ananas und Käse", 9.5),
  salad("178", "Salat Döner", "gemischter Salat mit Kalb- oder Hähnchen-Döner", 11),
  salad("179", "Salat Casa", "gemischter Salat, Mais, Paprika, Oliven und Feta", 10.5),
  salad(
    "180",
    "Salat Hähnchen",
    "gemischter Salat, Hähnchenbruststreifen, Paprika und Rucola",
    11
  ),

  // —— Getränke ——
  simple(
    "Getränke",
    "190",
    "Cola / Cola Zero / Fanta / Sprite / Apfelschorle",
    "Flasche 0,33 l",
    2.5
  ),
  simple("Getränke", "191", "Mineralwasser", "still oder medium, 0,25 l", 2),
  simple("Getränke", "192", "Uludag oder Fanta Exotik", "Dose 0,33 l", 2),
  simple("Getränke", "193", "Ayran", "Becher 0,25 l", 2),
  simple("Getränke", "194", "Durstlöscher", "verschiedene Sorten, 0,5 l", 2),
  simple(
    "Getränke",
    "195",
    "Coca-Cola / Cola Zero / Fanta",
    "nur außer Haus, Flasche 1,0 l",
    3
  ),
  simple(
    "Getränke",
    "196",
    "Sprite / Mezzo-Mix / Apfelschorle",
    "nur außer Haus, Flasche 1,0 l",
    3
  ),
  simple("Getränke", "197", "Krombacher Pils oder Radler", "Flasche 0,33 l", 3),
  simple("Getränke", "198", "Weizenbier", "Flasche 0,5 l", 4)
];

export const STRAELEN_MENU_STATS = {
  categories: STRAELEN_CATEGORIES.length,
  products: STRAELEN_PRODUCTS.length
};
