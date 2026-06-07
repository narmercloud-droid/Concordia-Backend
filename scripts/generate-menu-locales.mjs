/**
 * Build compact menu locale files from de catalog + translation tables.
 * Run: node scripts/generate-menu-locales.mjs
 */
import fs from "fs"
import path from "path"

const catalog = JSON.parse(fs.readFileSync("src/i18n/menu/de.json", "utf8"))
const outDir = "src/i18n/menu/locales"
fs.mkdirSync(outDir, { recursive: true })

const LANGS = ["en", "nl", "pl", "ru", "ro", "hi", "ar", "ku"]

const CATEGORY_T = {
  en: {
    38: { name: "Baguettes", description: "With iceberg lettuce, tomatoes, cucumbers, remoulade" },
    39: { name: "Pasta", description: "Choice of spaghetti, penne or tortellini" },
    40: { name: "Salads", description: "With dressing of your choice" },
    41: { name: "Al Forno Dishes", description: "" },
    42: { name: "Pizzas", description: "Small 24 cm · Large 30 cm" },
    43: { name: "Pizza Rolls", description: "10 pcs with herb butter · Stuffed varieties" },
    44: { name: "Schnitzel", description: "All dishes served with fries and salad" },
    45: { name: "Burgers", description: "" },
    46: { name: "Snacks", description: "" },
    47: { name: "Soft Drinks", description: "" },
    48: { name: "Alcoholic Drinks", description: "" }
  },
  nl: {
    38: { name: "Baguettes", description: "Met ijsbergsla, tomaten, komkommer, remoulade" },
    39: { name: "Pasta", description: "Keuze uit spaghetti, penne of tortellini" },
    40: { name: "Salades", description: "Met dressing naar keuze" },
    41: { name: "Al Forno Gerechten", description: "" },
    42: { name: "Pizza's", description: "Klein 24 cm · Groot 30 cm" },
    43: { name: "Pizzabroodjes", description: "10 stuks met kruidenboter · Gevulde varianten" },
    44: { name: "Schnitzel", description: "Alle gerechten met friet en salade" },
    45: { name: "Burgers", description: "" },
    46: { name: "Snacks", description: "" },
    47: { name: "Alcoholvrije Dranken", description: "" },
    48: { name: "Alcoholische Dranken", description: "" }
  },
  pl: {
    38: { name: "Bagietki", description: "Z sałatą lodową, pomidorami, ogórkiem, remoulade" },
    39: { name: "Makaron", description: "Do wyboru: spaghetti, penne lub tortellini" },
    40: { name: "Sałatki", description: "Z wybranym sosem" },
    41: { name: "Dania Al Forno", description: "" },
    42: { name: "Pizze", description: "Mała 24 cm · Duża 30 cm" },
    43: { name: "Bułeczki pizzowe", description: "10 szt. z masłem ziołowym · Wersje nadziewane" },
    44: { name: "Sznitzle", description: "Wszystkie dania z frytkami i sałatką" },
    45: { name: "Burgery", description: "" },
    46: { name: "Przekąski", description: "" },
    47: { name: "Napoje bezalkoholowe", description: "" },
    48: { name: "Napoje alkoholowe", description: "" }
  },
  ru: {
    38: { name: "Багеты", description: "С салатом айсберг, помидорами, огурцом, ремулядом" },
    39: { name: "Паста", description: "На выбор: спагетти, пенне или тортеллини" },
    40: { name: "Салаты", description: "С соусом на выбор" },
    41: { name: "Блюда Al Forno", description: "" },
    42: { name: "Пицца", description: "Маленькая 24 см · Большая 30 см" },
    43: { name: "Пицца-булочки", description: "10 шт. с травяным маслом · С начинкой" },
    44: { name: "Шницель", description: "Все блюда с картофелем фри и салатом" },
    45: { name: "Бургеры", description: "" },
    46: { name: "Закуски", description: "" },
    47: { name: "Безалкогольные напитки", description: "" },
    48: { name: "Алкогольные напитки", description: "" }
  },
  ro: {
    38: { name: "Baghete", description: "Cu salată iceberg, roșii, castraveți, remoulade" },
    39: { name: "Paste", description: "La alegere: spaghetti, penne sau tortellini" },
    40: { name: "Salate", description: "Cu dressing la alegere" },
    41: { name: "Feluri Al Forno", description: "" },
    42: { name: "Pizza", description: "Mică 24 cm · Mare 30 cm" },
    43: { name: "Chifle de pizza", description: "10 buc. cu unt cu ierburi · Variante umplute" },
    44: { name: "Șnițel", description: "Toate felurile cu cartofi prăjiți și salată" },
    45: { name: "Burgeri", description: "" },
    46: { name: "Gustări", description: "" },
    47: { name: "Băuturi nealcoolice", description: "" },
    48: { name: "Băuturi alcoolice", description: "" }
  },
  hi: {
    38: { name: "बैगुएट", description: "आइसबर्ग लेट्यूस, टमाटर, खीरे, रेमुलाड के साथ" },
    39: { name: "पास्ता", description: "स्पघेटी, पेने या टोर्टेलिनी में से चुनें" },
    40: { name: "सलाद", description: "पसंदीदा ड्रेसिंग के साथ" },
    41: { name: "अल फोर्नो व्यंजन", description: "" },
    42: { name: "पिज़्ज़ा", description: "छोटा 24 सेमी · बड़ा 30 सेमी" },
    43: { name: "पिज़्ज़ा रोल", description: "10 टुकड़े हर्ब बटर के साथ · भरे हुए विकल्प" },
    44: { name: "श्निट्ज़ेल", description: "सभी व्यंजन फ्राइज़ और सलाद के साथ" },
    45: { name: "बर्गर", description: "" },
    46: { name: "स्नैक्स", description: "" },
    47: { name: "शाकाहारी पेय", description: "" },
    48: { name: "मादक पेय", description: "" }
  },
  ar: {
    38: { name: "باغيت", description: "مع خس آيسبرغ وطماطم وخيار وريمولاد" },
    39: { name: "معكرونة", description: "اختر سباغيتي أو بيني أو تورتيليني" },
    40: { name: "سلطات", description: "مع صلصة من اختيارك" },
    41: { name: "أطباق Al Forno", description: "" },
    42: { name: "بيتزا", description: "صغيرة 24 سم · كبيرة 30 سم" },
    43: { name: "لفائف البيتزا", description: "10 قطع مع زبدة الأعشاب · محشوة" },
    44: { name: "شنيتسل", description: "جميع الأطباق مع بطاطس وسلطة" },
    45: { name: "برغر", description: "" },
    46: { name: "وجبات خفيفة", description: "" },
    47: { name: "مشروبات غير كحولية", description: "" },
    48: { name: "مشروبات كحولية", description: "" }
  },
  ku: {
    38: { name: "Baguette", description: "Bi salata iceberg, tomat, xiyar, remoulade" },
    39: { name: "Pasta", description: "Spaghetti, penne an tortellini" },
    40: { name: "Salad", description: "Bi dressingê dilxwaz" },
    41: { name: "Xwarinên Al Forno", description: "" },
    42: { name: "Pîzza", description: "Biçûk 24 cm · Mezin 30 cm" },
    43: { name: "Pîzza brötchen", description: "10 perçe bi kerry butter · Tijkirî" },
    44: { name: "Schnitzel", description: "Hemû xwarin bi patates û salat" },
    45: { name: "Burger", description: "" },
    46: { name: "Snacks", description: "" },
    47: { name: "Vexwarinên nealkolîk", description: "" },
    48: { name: "Vexwarinên alkolîk", description: "" }
  }
}

function lexiconFor(lang) {
  const L = {
    en: {
      variantGroups: {
        Dressing: "Dressing",
        Fleischwahl: "Meat choice",
        Größe: "Size",
        Nudelsorte: "Pasta type",
        "Wählen Sie": "Choose"
      },
      variants: {
        "Essig & Öl": "Vinegar & oil",
        "French Dressing": "French dressing",
        "French-Dressing": "French dressing",
        Hähnchen: "Chicken",
        Joghurtsauce: "Yoghurt sauce",
        Jogurtsauce: "Yoghurt sauce",
        Penne: "Penne",
        Schwein: "Pork",
        Spaghetti: "Spaghetti",
        Tortellini: "Tortellini",
        "groß 30 cm": "large 30 cm",
        "klein 24 cm": "small 24 cm",
        "ohne Dressing": "no dressing"
      },
      addOnGroups: {
        "Beilagen & Saucen": "Sides & sauces",
        Extras: "Extras",
        "Fleisch & Wurst": "Meat & sausage",
        Gemüse: "Vegetables",
        Meeresfrüchte: "Seafood",
        "Saucen & Käse": "Sauces & cheese"
      },
      addOns: {
        Ananas: "Pineapple",
        Artischocken: "Artichokes",
        Broccoli: "Broccoli",
        Champignons: "Mushrooms",
        "Cherry Tomaten": "Cherry tomatoes",
        Currysauce: "Curry sauce",
        Dönerfleisch: "Döner meat",
        Fetakäse: "Feta cheese",
        Gorgonzola: "Gorgonzola",
        "Gouda Käse": "Gouda cheese",
        Hackfleischsauce: "Bolognese sauce",
        Hinterschinken: "Ham",
        Hähnchenbruststreifen: "Chicken strips",
        Ketchup: "Ketchup",
        Knoblauch: "Garlic",
        Krabben: "Prawns",
        Kräuterbutter: "Herb butter",
        Käse: "Cheese",
        Lachs: "Salmon",
        Mais: "Corn",
        Mayonnaise: "Mayonnaise",
        Meeresfrüchte: "Seafood",
        "Mit Käse überbacken": "Topped with cheese",
        Mozzarella: "Mozzarella",
        Oliven: "Olives",
        Paprika: "Bell pepper",
        Parmaschinken: "Parma ham",
        Parmesankäse: "Parmesan",
        Peperoni: "Peperoni",
        Rucola: "Rocket",
        Salami: "Salami",
        "Sauce Hollandaise": "Hollandaise sauce",
        Spaghetti: "Spaghetti",
        Spargel: "Asparagus",
        Spinat: "Spinach",
        Sucuk: "Sucuk",
        Thunfisch: "Tuna",
        Tomaten: "Tomatoes",
        Tomatensauce: "Tomato sauce",
        "Türkisch Knoblauchwurst": "Turkish garlic sausage",
        Zwiebeln: "Onions",
        "ohne Beilage": "no side",
        "scharfe Peperoni": "Hot peppers"
      }
    },
    nl: {
      variantGroups: {
        Dressing: "Dressing",
        Fleischwahl: "Vleeskeuze",
        Größe: "Maat",
        Nudelsorte: "Pastasoort",
        "Wählen Sie": "Kies"
      },
      variants: {
        "Essig & Öl": "Azijn & olie",
        "French Dressing": "French dressing",
        "French-Dressing": "French dressing",
        Hähnchen: "Kip",
        Joghurtsauce: "Yoghurtsaus",
        Jogurtsauce: "Yoghurtsaus",
        Penne: "Penne",
        Schwein: "Varken",
        Spaghetti: "Spaghetti",
        Tortellini: "Tortellini",
        "groß 30 cm": "groot 30 cm",
        "klein 24 cm": "klein 24 cm",
        "ohne Dressing": "zonder dressing"
      },
      addOnGroups: {
        "Beilagen & Saucen": "Bijgerechten & sauzen",
        Extras: "Extra's",
        "Fleisch & Wurst": "Vlees & worst",
        Gemüse: "Groenten",
        Meeresfrüchte: "Zeevruchten",
        "Saucen & Käse": "Sauzen & kaas"
      },
      addOns: {
        Ananas: "Ananas",
        Artischocken: "Artisjokken",
        Broccoli: "Broccoli",
        Champignons: "Champignons",
        "Cherry Tomaten": "Cherrytomaten",
        Currysauce: "Currysaus",
        Dönerfleisch: "Döner",
        Fetakäse: "Fetakaas",
        Gorgonzola: "Gorgonzola",
        "Gouda Käse": "Gouda",
        Hackfleischsauce: "Bolognesesaus",
        Hinterschinken: "Achterham",
        Hähnchenbruststreifen: "Kipreepjes",
        Ketchup: "Ketchup",
        Knoblauch: "Knoflook",
        Krabben: "Garnalen",
        Kräuterbutter: "Kruidenboter",
        Käse: "Kaas",
        Lachs: "Zalm",
        Mais: "Mais",
        Mayonnaise: "Mayonaise",
        Meeresfrüchte: "Zeevruchten",
        "Mit Käse überbacken": "Met kaas gegratineerd",
        Mozzarella: "Mozzarella",
        Oliven: "Olijven",
        Paprika: "Paprika",
        Parmaschinken: "Parmaham",
        Parmesankäse: "Parmezaan",
        Peperoni: "Peperoni",
        Rucola: "Rucola",
        Salami: "Salami",
        "Sauce Hollandaise": "Hollandaise",
        Spaghetti: "Spaghetti",
        Spargel: "Asperges",
        Spinat: "Spinazie",
        Sucuk: "Sucuk",
        Thunfisch: "Tonijn",
        Tomaten: "Tomaten",
        Tomatensauce: "Tomatensaus",
        "Türkisch Knoblauchwurst": "Turkse knoflookworst",
        Zwiebeln: "Uien",
        "ohne Beilage": "zonder bijgerecht",
        "scharfe Peperoni": "Pittige peper"
      }
    }
  }

  if (L[lang]) return L[lang]

  // pl, ru, ro, hi, ar, ku — derive from English with overrides where needed
  const en = L.en
  if (lang === "pl") {
    return {
      variantGroups: {
        Dressing: "Sos",
        Fleischwahl: "Wybór mięsa",
        Größe: "Rozmiar",
        Nudelsorte: "Rodzaj makaronu",
        "Wählen Sie": "Wybierz"
      },
      variants: {
        "Essig & Öl": "Ocet i olej",
        "French Dressing": "French dressing",
        "French-Dressing": "French dressing",
        Hähnchen: "Kurczak",
        Joghurtsauce: "Sos jogurtowy",
        Jogurtsauce: "Sos jogurtowy",
        Penne: "Penne",
        Schwein: "Wieprzowina",
        Spaghetti: "Spaghetti",
        Tortellini: "Tortellini",
        "groß 30 cm": "duża 30 cm",
        "klein 24 cm": "mała 24 cm",
        "ohne Dressing": "bez sosu"
      },
      addOnGroups: {
        "Beilagen & Saucen": "Dodatki i sosy",
        Extras: "Dodatki",
        "Fleisch & Wurst": "Mięso i kiełbasa",
        Gemüse: "Warzywa",
        Meeresfrüchte: "Owoce morza",
        "Saucen & Käse": "Sosy i ser"
      },
      addOns: {
        ...en.addOns,
        Ananas: "Ananas",
        Artischocken: "Karczochy",
        Champignons: "Pieczarki",
        "Cherry Tomaten": "Pomidorki cherry",
        Currysauce: "Sos curry",
        Dönerfleisch: "Kebab",
        Fetakäse: "Ser feta",
        "Gouda Käse": "Ser gouda",
        Hackfleischsauce: "Sos bolognese",
        Hinterschinken: "Szynka",
        Hähnchenbruststreifen: "Kurczak w paski",
        Knoblauch: "Czosnek",
        Krabben: "Krewetki",
        Kräuterbutter: "Masło ziołowe",
        Käse: "Ser",
        Lachs: "Łosoś",
        Mais: "Kukurydza",
        Meeresfrüchte: "Owoce morza",
        "Mit Käse überbacken": "Zapiekane z serem",
        Oliven: "Oliwki",
        Paprika: "Papryka",
        Parmaschinken: "Szynka parmeńska",
        Parmesankäse: "Parmezan",
        Rucola: "Rukola",
        "Sauce Hollandaise": "Sos holenderski",
        Spargel: "Szparagi",
        Spinat: "Szpinak",
        Thunfisch: "Tuńczyk",
        Tomaten: "Pomidory",
        Tomatensauce: "Sos pomidorowy",
        "Türkisch Knoblauchwurst": "Turecka kiełbasa czosnkowa",
        Zwiebeln: "Cebula",
        "ohne Beilage": "bez dodatku",
        "scharfe Peperoni": "Ostra papryka"
      }
    }
  }

  if (lang === "ru") {
    return {
      variantGroups: {
        Dressing: "Соус",
        Fleischwahl: "Выбор мяса",
        Größe: "Размер",
        Nudelsorte: "Вид пасты",
        "Wählen Sie": "Выберите"
      },
      variants: {
        "Essig & Öl": "Уксус и масло",
        "French Dressing": "Французская заправка",
        "French-Dressing": "Французская заправка",
        Hähnchen: "Курица",
        Joghurtsauce: "Йогуртовый соус",
        Jogurtsauce: "Йогуртовый соус",
        Penne: "Пенне",
        Schwein: "Свинина",
        Spaghetti: "Спагетти",
        Tortellini: "Тортеллини",
        "groß 30 cm": "большая 30 см",
        "klein 24 cm": "маленькая 24 см",
        "ohne Dressing": "без соуса"
      },
      addOnGroups: {
        "Beilagen & Saucen": "Гарниры и соусы",
        Extras: "Дополнения",
        "Fleisch & Wurst": "Мясо и колбаса",
        Gemüse: "Овощи",
        Meeresfrüchte: "Морепродукты",
        "Saucen & Käse": "Соусы и сыр"
      },
      addOns: {
        Ananas: "Ананас",
        Artischocken: "Артишоки",
        Broccoli: "Брокколи",
        Champignons: "Шампиньоны",
        "Cherry Tomaten": "Черри-томаты",
        Currysauce: "Соус карри",
        Dönerfleisch: "Дёнер",
        Fetakäse: "Фета",
        Gorgonzola: "Горгонзола",
        "Gouda Käse": "Гауда",
        Hackfleischsauce: "Болоньезе",
        Hinterschinken: "Ветчина",
        Hähnchenbruststreifen: "Курица",
        Ketchup: "Кетчуп",
        Knoblauch: "Чеснок",
        Krabben: "Креветки",
        Kräuterbutter: "Травяное масло",
        Käse: "Сыр",
        Lachs: "Лосось",
        Mais: "Кукуруза",
        Mayonnaise: "Майонез",
        Meeresfrüchte: "Морепродукты",
        "Mit Käse überbacken": "С сыром",
        Mozzarella: "Моцарелла",
        Oliven: "Оливки",
        Paprika: "Перец",
        Parmaschinken: "Пармская ветчина",
        Parmesankäse: "Пармезан",
        Peperoni: "Пепперони",
        Rucola: "Руккола",
        Salami: "Салями",
        "Sauce Hollandaise": "Голландский соус",
        Spaghetti: "Спагетти",
        Spargel: "Спаржа",
        Spinat: "Шпинат",
        Sucuk: "Суджук",
        Thunfisch: "Тунец",
        Tomaten: "Помидоры",
        Tomatensauce: "Томатный соус",
        "Türkisch Knoblauchwurst": "Турецкая чесночная колбаса",
        Zwiebeln: "Лук",
        "ohne Beilage": "без гарнира",
        "scharfe Peperoni": "Острый перец"
      }
    }
  }

  if (lang === "ro") {
    return {
      variantGroups: {
        Dressing: "Dressing",
        Fleischwahl: "Alegere carne",
        Größe: "Mărime",
        Nudelsorte: "Tip paste",
        "Wählen Sie": "Alegeți"
      },
      variants: {
        "Essig & Öl": "Oțet și ulei",
        "French Dressing": "French dressing",
        "French-Dressing": "French dressing",
        Hähnchen: "Pui",
        Joghurtsauce: "Sos de iaurt",
        Jogurtsauce: "Sos de iaurt",
        Penne: "Penne",
        Schwein: "Porc",
        Spaghetti: "Spaghetti",
        Tortellini: "Tortellini",
        "groß 30 cm": "mare 30 cm",
        "klein 24 cm": "mică 24 cm",
        "ohne Dressing": "fără dressing"
      },
      addOnGroups: {
        "Beilagen & Saucen": "Garnituri & sosuri",
        Extras: "Extra",
        "Fleisch & Wurst": "Carne & cârnați",
        Gemüse: "Legume",
        Meeresfrüchte: "Fructe de mare",
        "Saucen & Käse": "Sosuri & brânză"
      },
      addOns: {
        Ananas: "Ananas",
        Artischocken: "Anghinare",
        Broccoli: "Broccoli",
        Champignons: "Ciuperci",
        "Cherry Tomaten": "Roșii cherry",
        Currysauce: "Sos curry",
        Dönerfleisch: "Döner",
        Fetakäse: "Brânză feta",
        Gorgonzola: "Gorgonzola",
        "Gouda Käse": "Gouda",
        Hackfleischsauce: "Sos bolognese",
        Hinterschinken: "Șuncă",
        Hähnchenbruststreifen: "Pui",
        Ketchup: "Ketchup",
        Knoblauch: "Usturoi",
        Krabben: "Creveți",
        Kräuterbutter: "Unt cu ierburi",
        Käse: "Brânză",
        Lachs: "Somon",
        Mais: "Porumb",
        Mayonnaise: "Maioneză",
        Meeresfrüchte: "Fructe de mare",
        "Mit Käse überbacken": "Gratinat cu brânză",
        Mozzarella: "Mozzarella",
        Oliven: "Măsline",
        Paprika: "Ardei",
        Parmaschinken: "Șuncă Parma",
        Parmesankäse: "Parmezan",
        Peperoni: "Peperoni",
        Rucola: "Rucola",
        Salami: "Salami",
        "Sauce Hollandaise": "Sos olandez",
        Spaghetti: "Spaghetti",
        Spargel: "Sparghel",
        Spinat: "Spanac",
        Sucuk: "Sucuk",
        Thunfisch: "Ton",
        Tomaten: "Roșii",
        Tomatensauce: "Sos de roșii",
        "Türkisch Knoblauchwurst": "Cârnați turcești cu usturoi",
        Zwiebeln: "Ceapă",
        "ohne Beilage": "fără garnitură",
        "scharfe Peperoni": "Ardei iute"
      }
    }
  }

  if (lang === "hi") {
    return {
      variantGroups: {
        Dressing: "ड्रेसिंग",
        Fleischwahl: "मांस का चुनाव",
        Größe: "आकार",
        Nudelsorte: "पास्ता प्रकार",
        "Wählen Sie": "चुनें"
      },
      variants: {
        "Essig & Öl": "सिरका और तेल",
        "French Dressing": "फ्रेंच ड्रेसिंग",
        "French-Dressing": "फ्रेंच ड्रेसिंग",
        Hähnchen: "चिकन",
        Joghurtsauce: "दही सॉस",
        Jogurtsauce: "दही सॉस",
        Penne: "पेने",
        Schwein: "पोर्क",
        Spaghetti: "स्पघेटी",
        Tortellini: "टोर्टेलिनी",
        "groß 30 cm": "बड़ा 30 सेमी",
        "klein 24 cm": "छोटा 24 सेमी",
        "ohne Dressing": "बिना ड्रेसिंग"
      },
      addOnGroups: {
        "Beilagen & Saucen": "साइड और सॉस",
        Extras: "एक्स्ट्रा",
        "Fleisch & Wurst": "मांस और सॉसेज",
        Gemüse: "सब्ज़ियाँ",
        Meeresfrüchte: "समुद्री भोजन",
        "Saucen & Käse": "सॉस और पनीर"
      },
      addOns: {
        Ananas: "अनानास",
        Artischocken: "आर्टिचोक",
        Broccoli: "ब्रोकली",
        Champignons: "मशरूम",
        "Cherry Tomaten": "चेरी टमाटर",
        Currysauce: "करी सॉस",
        Dönerfleisch: "दोनर",
        Fetakäse: "फेटा",
        Gorgonzola: "गोरगोंज़ोला",
        "Gouda Käse": "गौडा",
        Hackfleischsauce: "बोलोग्नीज़",
        Hinterschinken: "हैम",
        Hähnchenbruststreifen: "चिकन स्ट्रिप्स",
        Ketchup: "केचप",
        Knoblauch: "लहसुन",
        Krabben: "झींगा",
        Kräuterbutter: "हर्ब बटर",
        Käse: "पनीर",
        Lachs: "सैल्मन",
        Mais: "मक्का",
        Mayonnaise: "मेयोनेज़",
        Meeresfrüchte: "समुद्री भोजन",
        "Mit Käse überbacken": "पनीर के साथ",
        Mozzarella: "मोज़ारेला",
        Oliven: "जैतून",
        Paprika: "शिमला मिर्च",
        Parmaschinken: "पार्मा हैम",
        Parmesankäse: "पार्मेज़ान",
        Peperoni: "पेपरोनी",
        Rucola: "रुकोला",
        Salami: "सलामी",
        "Sauce Hollandaise": "हॉलैंडेज़ सॉस",
        Spaghetti: "स्पघेटी",
        Spargel: "एस्परैगस",
        Spinat: "पालक",
        Sucuk: "सुजुक",
        Thunfisch: "टूना",
        Tomaten: "टमाटर",
        Tomatensauce: "टमाटर सॉस",
        "Türkisch Knoblauchwurst": "तुर्की लहसुन सॉसेज",
        Zwiebeln: "प्याज",
        "ohne Beilage": "बिना साइड",
        "scharfe Peperoni": "मिर्च"
      }
    }
  }

  if (lang === "ar") {
    return {
      variantGroups: {
        Dressing: "صلصة",
        Fleischwahl: "اختيار اللحم",
        Größe: "الحجم",
        Nudelsorte: "نوع المعكرونة",
        "Wählen Sie": "اختر"
      },
      variants: {
        "Essig & Öl": "خل وزيت",
        "French Dressing": "صلصة فرنسية",
        "French-Dressing": "صلصة فرنسية",
        Hähnchen: "دجاج",
        Joghurtsauce: "صلصة زبادي",
        Jogurtsauce: "صلصة زبادي",
        Penne: "بيني",
        Schwein: "لحم خنزير",
        Spaghetti: "سباغيتي",
        Tortellini: "تورتيليني",
        "groß 30 cm": "كبيرة 30 سم",
        "klein 24 cm": "صغيرة 24 سم",
        "ohne Dressing": "بدون صلصة"
      },
      addOnGroups: {
        "Beilagen & Saucen": "مقبلات وصلصات",
        Extras: "إضافات",
        "Fleisch & Wurst": "لحوم وسجق",
        Gemüse: "خضار",
        Meeresfrüchte: "مأكولات بحرية",
        "Saucen & Käse": "صلصات وجبن"
      },
      addOns: {
        Ananas: "أناناس",
        Artischocken: "خرشوف",
        Broccoli: "بروكلي",
        Champignons: "فطر",
        "Cherry Tomaten": "طماطم كرزية",
        Currysauce: "صلصة كاري",
        Dönerfleisch: "دونر",
        Fetakäse: "جبنة فيتا",
        Gorgonzola: "جورغونزولا",
        "Gouda Käse": "جبنة جودا",
        Hackfleischsauce: "صلصة بولونيز",
        Hinterschinken: "لحم خنزير",
        Hähnchenbruststreifen: "دجاج",
        Ketchup: "كاتشب",
        Knoblauch: "ثوم",
        Krabben: "جمبري",
        Kräuterbutter: "زبدة أعشاب",
        Käse: "جبن",
        Lachs: "سلمون",
        Mais: "ذرة",
        Mayonnaise: "مايونيز",
        Meeresfrüchte: "مأكولات بحرية",
        "Mit Käse überbacken": "مع جبن",
        Mozzarella: "موزاريلا",
        Oliven: "زيتون",
        Paprika: "فلفل",
        Parmaschinken: "بارما",
        Parmesankäse: "بارميزان",
        Peperoni: "بيبروني",
        Rucola: "جرجير",
        Salami: "سلامي",
        "Sauce Hollandaise": "صلصة هولنديز",
        Spaghetti: "سباغيتي",
        Spargel: "هليون",
        Spinat: "سبانخ",
        Sucuk: "سوجق",
        Thunfisch: "تونة",
        Tomaten: "طماطم",
        Tomatensauce: "صلصة طماطم",
        "Türkisch Knoblauchwurst": "سجق ثوم تركي",
        Zwiebeln: "بصل",
        "ohne Beilage": "بدون جانب",
        "scharfe Peperoni": "فلفل حار"
      }
    }
  }

  if (lang === "ku") {
    return {
      variantGroups: {
        Dressing: "Sos",
        Fleischwahl: "Hilbijartina goşt",
        Größe: "Mezinahî",
        Nudelsorte: "Cureyê pasta",
        "Wählen Sie": "Hilbijêre"
      },
      variants: {
        "Essig & Öl": "Sirke & zeyt",
        "French Dressing": "French dressing",
        "French-Dressing": "French dressing",
        Hähnchen: "Mirîşk",
        Joghurtsauce: "Sosa yogurtê",
        Jogurtsauce: "Sosa yogurtê",
        Penne: "Penne",
        Schwein: "Berx",
        Spaghetti: "Spaghetti",
        Tortellini: "Tortellini",
        "groß 30 cm": "mezin 30 cm",
        "klein 24 cm": "biçûk 24 cm",
        "ohne Dressing": "bê dressing"
      },
      addOnGroups: {
        "Beilagen & Saucen": "Alik & sos",
        Extras: "Zêde",
        "Fleisch & Wurst": "Goşt & sosis",
        Gemüse: "Sebze",
        Meeresfrüchte: "Derya",
        "Saucen & Käse": "Sos & penîr"
      },
      addOns: {
        Ananas: "Ananas",
        Artischocken: "Artichoke",
        Broccoli: "Brokoli",
        Champignons: "Kivark",
        "Cherry Tomaten": "Tomatên cherry",
        Currysauce: "Sosa curry",
        Dönerfleisch: "Döner",
        Fetakäse: "Penîra feta",
        Gorgonzola: "Gorgonzola",
        "Gouda Käse": "Gouda",
        Hackfleischsauce: "Sosa bolognese",
        Hinterschinken: "Berenûsk",
        Hähnchenbruststreifen: "Mirîşk",
        Ketchup: "Ketchup",
        Knoblauch: "Sîr",
        Krabben: "Qisrîk",
        Kräuterbutter: "Kerry butter",
        Käse: "Penîr",
        Lachs: "Somon",
        Mais: "Gelzer",
        Mayonnaise: "Mayonez",
        Meeresfrüchte: "Derya",
        "Mit Käse überbacken": "Bi penîr",
        Mozzarella: "Mozzarella",
        Oliven: "Zeytûn",
        Paprika: "Biber",
        Parmaschinken: "Berenûska Parma",
        Parmesankäse: "Parmesan",
        Peperoni: "Peperoni",
        Rucola: "Rucola",
        Salami: "Salami",
        "Sauce Hollandaise": "Sos hollandez",
        Spaghetti: "Spaghetti",
        Spargel: "Asparagus",
        Spinat: "Spînat",
        Sucuk: "Sucuk",
        Thunfisch: "Ton",
        Tomaten: "Tomat",
        Tomatensauce: "Sosa tomatê",
        "Türkisch Knoblauchwurst": "Sosisa sîrê tirkî",
        Zwiebeln: "Pîvaz",
        "ohne Beilage": "bê alîk",
        "scharfe Peperoni": "Biberê tûj"
      }
    }
  }

  return en
}

const ITEM_RULES = {
  en: [
    [/^Baguette mit (.+)$/, "Baguette with $1"],
    [/^Gefüllte Pizzabrötchen mit (.+)$/, "Stuffed pizza rolls with $1"],
    [/^Pizzabrötchen 10 Stück$/, "Pizza rolls (10 pcs)"],
    [/^Portion Kräuterbutter$/, "Portion of herb butter"],
    [/^Pizza Pizza (.+)$/, "Pizza $1"],
    [/^Pizza (.+)$/, "Pizza $1"],
    [/^Pasta (.+)$/, "Pasta $1"],
    [/^Salat (.+)$/, "$1 Salad"],
    [/^(.+) Auflauf$/, "$1 Bake"],
    [/^Calzone (.+)$/, "Calzone $1"],
    [/^(.+) Schnitzel$/, "$1 Schnitzel"],
    [/^Schnitzel (.+)$/, "Schnitzel $1"],
    [/^Chicken Nuggets (\d+) Stück$/, "Chicken nuggets ($1 pcs)"],
    [/^Chicken Wings (\d+) Stück$/, "Chicken wings ($1 pcs)"],
    [/^Kartoffel-Kroketten (\d+) Stück$/, "Potato croquettes ($1 pcs)"],
    [/^Mozzarella Sticks$/, "Mozzarella sticks"],
    [/^Pommes frites$/, "French fries"],
    [/^Pommes Spezial$/, "Special fries"],
    [/^Bratrolle Spezial$/, "Special fried roll"],
    [/^Bratrolle$/, "Fried roll"],
    [/^Bratwurst$/, "Bratwurst"],
    [/^Currywurst$/, "Currywurst"],
    [/^Rindfleischkrokette$/, "Beef croquette"],
    [/^Doppel Chess Burger$/, "Double cheese burger"],
    [/^Doppel-Burger$/, "Double burger"],
    [/^Chess Burger$/, "Cheese burger"],
    [/^Burger Klassik$/, "Classic burger"],
    [/^Chicken Nugget Burger$/, "Chicken nugget burger"],
    [/^Chicken Burger$/, "Chicken burger"],
    [/^Mineralwasser mit Kohlensäure (.+)$/, "Sparkling mineral water $1"],
    [/^Mineralwasser Still (.+)$/, "Still mineral water $1"],
    [/^Radler Weizenbier (.+)$/, "Radler wheat beer $1"],
    [/^Krombacher Pills (.+)$/, "Krombacher Pils $1"]
  ],
  nl: [
    [/^Baguette mit (.+)$/, "Baguette met $1"],
    [/^Gefüllte Pizzabrötchen mit (.+)$/, "Gevulde pizzabroodjes met $1"],
    [/^Pizzabrötchen 10 Stück$/, "Pizzabroodjes (10 stuks)"],
    [/^Portion Kräuterbutter$/, "Portie kruidenboter"],
    [/^Pizza Pizza (.+)$/, "Pizza $1"],
    [/^Pizza (.+)$/, "Pizza $1"],
    [/^Pasta (.+)$/, "Pasta $1"],
    [/^Salat (.+)$/, "$1 Salade"],
    [/^(.+) Auflauf$/, "$1 Ovenschotel"],
    [/^Calzone (.+)$/, "Calzone $1"],
    [/^(.+) Schnitzel$/, "$1 Schnitzel"],
    [/^Schnitzel (.+)$/, "Schnitzel $1"],
    [/^Chicken Nuggets (\d+) Stück$/, "Chicken nuggets ($1 stuks)"],
    [/^Chicken Wings (\d+) Stück$/, "Chicken wings ($1 stuks)"],
    [/^Kartoffel-Kroketten (\d+) Stück$/, "Aardappelkroketten ($1 stuks)"],
    [/^Pommes frites$/, "Friet"],
    [/^Pommes Spezial$/, "Speciale friet"],
    [/^Bratrolle Spezial$/, "Speciale braadrol"],
    [/^Bratrolle$/, "Braadrol"],
    [/^Burger Klassik$/, "Klassieke burger"],
    [/^Doppel Chess Burger$/, "Dubbele cheeseburger"],
    [/^Doppel-Burger$/, "Dubbele burger"],
    [/^Chess Burger$/, "Cheeseburger"],
    [/^Mineralwasser mit Kohlensäure (.+)$/, "Bruisend mineraalwater $1"],
    [/^Mineralwasser Still (.+)$/, "Plat mineraalwater $1"]
  ]
}

const ITEM_OVERRIDES = {
  en: {
    "Baguette mit Thunfisch und Ei": "Baguette with tuna and egg",
    "Baguette mit Sucuk und Ei": "Baguette with sucuk and egg",
    "Gefüllte Pizzabrötchen mit Thunfisch, Zwiebeln, Fetakäse":
      "Stuffed pizza rolls with tuna, onions, feta",
    "Gefüllte Pizzabrötchen mit Spinat und Fetakäse": "Stuffed pizza rolls with spinach and feta",
    "Pizza Tonno e Cipolla": "Tuna & onion pizza",
    "Pizza Prosciutto Funghi": "Ham & mushroom pizza",
    "Pizza Quattro Stagioni": "Four seasons pizza",
    "Pizza Quattro Formaggi": "Four cheeses pizza",
    "Pizza Frutti di Mare": "Seafood pizza",
    "Jägerschnitzel": "Jäger schnitzel",
    "Schnitzel Wiener Art": "Wiener schnitzel",
    "Lift Apfelschorle 1,0l (MEHRWEG)": "Lift apple spritzer 1.0l (returnable)",
    "Durstlöscher 0,5l": "Durstlöscher 0.5l"
  },
  nl: {
    "Baguette mit Thunfisch und Ei": "Baguette met tonijn en ei",
    "Baguette mit Sucuk und Ei": "Baguette met sucuk en ei",
    "Gefüllte Pizzabrötchen mit Thunfisch, Zwiebeln, Fetakäse":
      "Gevulde pizzabroodjes met tonijn, ui en feta",
    "Gefüllte Pizzabrötchen mit Spinat und Fetakäse": "Gevulde pizzabroodjes met spinazie en feta",
    "Pizza Tonno e Cipolla": "Tonijn & ui pizza",
    "Pizza Prosciutto Funghi": "Ham & champignon pizza",
    "Pizza Quattro Stagioni": "Quattro stagioni pizza",
    "Pizza Quattro Formaggi": "Quattro formaggi pizza",
    "Pizza Frutti di Mare": "Zeevruchten pizza",
    "Jägerschnitzel": "Jägerschnitzel",
    "Schnitzel Wiener Art": "Wiener schnitzel"
  }
}

function translateDescription(desc, lang) {
  if (!desc) return null
  if (lang === "de") return desc

  let text = desc
  const maps = {
    en: {
      "mit ": "with ",
      " und ": " and ",
      "Wahlweise ": "Choice of ",
      " oder ": " or ",
      "Käse": "cheese",
      "Tomatensauce": "tomato sauce",
      "Tomaten": "tomatoes",
      "Gouda Käse": "Gouda cheese",
      "Fetakäse": "feta cheese",
      "Mozzarella": "Mozzarella",
      "Gorgonzola": "Gorgonzola",
      "Schinken": "ham",
      "Salami": "salami",
      "Thunfisch": "tuna",
      "Spinat": "spinach",
      "Broccoli": "broccoli",
      "Champignons": "mushrooms",
      "Zwiebeln": "onions",
      "Paprika": "bell pepper",
      "Peperoni": "pepperoni",
      "Sucuk": "sucuk",
      "Dönerfleisch": "döner meat",
      "Meeresfrüchte": "seafood",
      "Lachs": "salmon",
      "Spargel": "asparagus",
      "Artischocken": "artichokes",
      "Oliven": "olives",
      "Mais": "corn",
      "Ananas": "pineapple",
      "Knoblauch": "garlic",
      "Hackfleischsauce": "bolognese sauce",
      "Tomatensauce": "tomato sauce"
    },
    nl: {
      "mit ": "met ",
      " und ": " en ",
      "Wahlweise ": "Keuze uit ",
      " oder ": " of ",
      "Käse": "kaas",
      "Tomatensauce": "tomatensaus",
      "Gouda Käse": "Gouda",
      "Fetakäse": "feta",
      "Schinken": "ham",
      "Thunfisch": "tonijn",
      "Spinat": "spinazie",
      "Champignons": "champignons",
      "Zwiebeln": "ui",
      "Dönerfleisch": "döner",
      "Meeresfrüchte": "zeevruchten"
    }
  }

  const map = maps[lang]
  if (map) {
    for (const [from, to] of Object.entries(map)) {
      text = text.split(from).join(to)
    }
    return text
  }

  // pl, ru, ro, hi, ar, ku: translate via English pass
  const en = translateDescription(desc, "en")
  const swaps = {
    pl: { with: "z", and: "i", cheese: "serem", sauce: "sosem" },
    ru: { with: "с", and: "и", cheese: "сыром", sauce: "соусом" },
    ro: { with: "cu", and: "și" },
    hi: { with: "के साथ", and: "और" },
    ar: { with: "مع", and: "و" },
    ku: { with: "bi", and: "û" }
  }
  let out = en
  for (const [from, to] of Object.entries(swaps[lang] ?? {})) {
    out = out.replace(new RegExp(`\\b${from}\\b`, "gi"), to)
  }
  return out
}

function translateItemName(deName, lang) {
  const overrides = ITEM_OVERRIDES[lang]
  if (overrides?.[deName]) return overrides[deName]

  const rules = ITEM_RULES[lang]
  if (rules) {
    for (const [re, repl] of rules) {
      if (re.test(deName)) return deName.replace(re, repl)
    }
  }

  // pl/ru/ro/hi/ar/ku: use English rules as base then word swaps
  if (!["en", "nl", "de"].includes(lang)) {
    let name = translateItemName(deName, "en")
    const swaps = {
      pl: { " with ": " z ", " and ": " i ", Salad: "Sałatka", Bake: "Zapiekanka", fries: "frytki" },
      ru: { " with ": " с ", " and ": " и ", Salad: "Салат", Pizza: "Пицца" },
      ro: { " with ": " cu ", " and ": " și ", Salad: "Salată" },
      hi: { " with ": " के साथ ", " and ": " और ", Pizza: "पिज़्ज़ा" },
      ar: { " with ": " مع ", " and ": " و ", Pizza: "بيتزا" },
      ku: { " with ": " bi ", " and ": " û ", Pizza: "Pîzza" }
    }
    for (const [from, to] of Object.entries(swaps[lang] ?? {})) {
      name = name.split(from).join(to)
    }
    return name
  }

  return deName
}

for (const lang of LANGS) {
  const locale = {
    categories: {},
    items: {},
    lexicon: lexiconFor(lang)
  }

  for (const [id, cat] of Object.entries(catalog.categories)) {
    locale.categories[id] = CATEGORY_T[lang][id] ?? {
      name: cat.name,
      description: cat.description
    }
  }

  for (const [id, item] of Object.entries(catalog.items)) {
    locale.items[id] = {
      name: translateItemName(item.name, lang),
      description: translateDescription(item.description, lang)
    }
  }

  fs.writeFileSync(path.join(outDir, `${lang}.json`), `${JSON.stringify(locale, null, 2)}\n`)
  console.log(
    lang,
    "items",
    Object.keys(locale.items).length,
    "lexicon addOns",
    Object.keys(locale.lexicon.addOns).length
  )
}

console.log("Done →", outDir)
