# Kempen menu review

Generated: 2026-06-13
Branch: `concordia-kempen`
Source: https://concordia-restaurant-de.vercel.app/api/branches/concordia-kempen/menu + per-item detail API

---

## How extras pricing works

### Item types
| Type | Detection | Extra pricing |
|------|-----------|---------------|
| **Pizza / Calzone** | Name starts with "Pizza " or "Calzone" | Size-based (see table below) |
| **Partyblech / Familien** | Name contains "Partyblech" or "Familien" | Fixed price from menu (no size scaling) |
| **Everything else** | Snacks, drinks, pastas, etc. | Fixed price from menu per extra |

### Pizza size-based extra rates (standard vs premium)

| Size | Standard extras | Premium extras |
|------|-----------------|----------------|
| **klein** (24 cm) | €1.00 | €1.50 |
| **groß** (30 cm) | €1.50 | €2.00 |

**Premium extras** (always premium tier on pizzas): Krabben, Meeresfrüchte, Hähnchenbruststreifen, Mit Käse überbacken — plus any option whose menu base price is ≥ €1.50.

### Order total calculation (website + server)

1. **Base price** = selected size variant price if any paid variant chosen; otherwise category list price.
2. **+ Extras** = sum of each selected extra (using rules above for pizzas).
3. **= Line subtotal** per item × quantity.
4. **− 10% website discount** on Kempen (automatic).
5. **+ Delivery fee** if Lieferung (minimum order €15 before discount).

The server **recalculates prices from the menu** and ignores any price sent by the client.

---

## Full menu by category

### Pizzen — Klein 24 cm · Groß 30 cm

#### #01 Pizza Margherita — list from €5.00
_mit Tomatensauce und Käse_

- Item ID: `10065`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€5.00** `size-concordia-kempen-10065-klein`
    - groß 30 cm: **€7.00** `size-concordia-kempen-10065-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10065-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10065-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10065-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10065-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10065-saucen-0`

#### #02 Pizza Broccoli — list from €6.50
_mit Broccoli_

- Item ID: `10066`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€6.50** `size-concordia-kempen-10066-klein`
    - groß 30 cm: **€8.50** `size-concordia-kempen-10066-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10066-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10066-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10066-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10066-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10066-saucen-0`

#### #03 Pizza Salami — list from €6.50
_mit Salami_

- Item ID: `10067`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€6.50** `size-concordia-kempen-10067-klein`
    - groß 30 cm: **€8.50** `size-concordia-kempen-10067-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10067-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10067-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10067-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10067-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10067-saucen-0`

#### #04 Pizza Prosciutto — list from €6.50
_mit Hinterschinken_

- Item ID: `10068`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€6.50** `size-concordia-kempen-10068-klein`
    - groß 30 cm: **€8.50** `size-concordia-kempen-10068-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10068-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10068-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10068-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10068-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10068-saucen-0`

#### #05 Pizza Funghi — list from €6.50
_mit frische Champignons_

- Item ID: `10069`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€6.50** `size-concordia-kempen-10069-klein`
    - groß 30 cm: **€8.50** `size-concordia-kempen-10069-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10069-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10069-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10069-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10069-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10069-saucen-0`

#### #06 Pizza Tonno e Cipolla — list from €7.00
_mit Thunfisch und Zwiebeln_

- Item ID: `10055`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.00** `size-concordia-kempen-10055-klein`
    - groß 30 cm: **€9.00** `size-concordia-kempen-10055-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10055-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10055-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10055-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10055-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10055-saucen-0`

#### #07 Pizza Tonno — list from €7.00
_mit Thunfisch_

- Item ID: `10070`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.00** `size-concordia-kempen-10070-klein`
    - groß 30 cm: **€9.00** `size-concordia-kempen-10070-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10070-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10070-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10070-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10070-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10070-saucen-0`

#### #08 Pizza Spinaci — list from €6.50
_mit Spinat und Knoblauch_

- Item ID: `10071`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€6.50** `size-concordia-kempen-10071-klein`
    - groß 30 cm: **€8.50** `size-concordia-kempen-10071-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10071-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10071-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10071-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10071-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10071-saucen-0`

#### #09 Pizza Scampi — list from €8.00
_mit Krabben und Knoblauch_

- Item ID: `10072`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.00** `size-concordia-kempen-10072-klein`
    - groß 30 cm: **€10.00** `size-concordia-kempen-10072-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10072-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10072-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10072-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10072-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10072-saucen-0`

#### #10 Pizza Frutti di Mare — list from €8.00
_mit Meeresfrüchte und Knoblauch_

- Item ID: `10073`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.00** `size-concordia-kempen-10073-klein`
    - groß 30 cm: **€10.00** `size-concordia-kempen-10073-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10073-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10073-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10073-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10073-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10073-saucen-0`

#### #11 Pizza Sucuk — list from €7.00
_mit türkisch Knoblauchwurst_

- Item ID: `10074`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.00** `size-concordia-kempen-10074-klein`
    - groß 30 cm: **€9.00** `size-concordia-kempen-10074-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10074-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10074-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10074-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10074-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10074-saucen-0`

#### #12 Pizza Prosciutto Funghi — list from €6.50
_mit Hinterschinken und Champignons_

- Item ID: `10056`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€6.50** `size-concordia-kempen-10056-klein`
    - groß 30 cm: **€8.50** `size-concordia-kempen-10056-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10056-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10056-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10056-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10056-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10056-saucen-0`

#### #13 Pizza Hawaii — list from €7.50
_mit Hinterschinken und Ananas_

- Item ID: `10057`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.50** `size-concordia-kempen-10057-klein`
    - groß 30 cm: **€9.50** `size-concordia-kempen-10057-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10057-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10057-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10057-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10057-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10057-saucen-0`

#### #14 Pizza Mozzarella — list from €7.50
_mit Mozzarella und Cherry Tomaten_

- Item ID: `10058`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.50** `size-concordia-kempen-10058-klein`
    - groß 30 cm: **€9.50** `size-concordia-kempen-10058-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10058-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10058-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10058-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10058-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10058-saucen-0`

#### #15 Pizza Bolognese — list from €7.00
_mit Hackfleischsauce und Zwiebeln_

- Item ID: `10059`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.00** `size-concordia-kempen-10059-klein`
    - groß 30 cm: **€9.00** `size-concordia-kempen-10059-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10059-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10059-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10059-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10059-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10059-saucen-0`

#### #16 Pizza Spaghetti Bolognese — list from €7.50
_mit Spaghetti und Hackfleischsauce_

- Item ID: `10060`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.50** `size-concordia-kempen-10060-klein`
    - groß 30 cm: **€9.50** `size-concordia-kempen-10060-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10060-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10060-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10060-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10060-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10060-saucen-0`

#### #17 Pizza Milano — list from €8.00
_mit Spinat, Krabben, Champignons und Knoblauch_

- Item ID: `10061`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.00** `size-concordia-kempen-10061-klein`
    - groß 30 cm: **€10.00** `size-concordia-kempen-10061-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10061-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10061-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10061-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10061-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10061-saucen-0`

#### #18 Pizza Lachs — list from €8.00
_mit Spinat, Lachs und Knoblauch_

- Item ID: `10062`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.00** `size-concordia-kempen-10062-klein`
    - groß 30 cm: **€10.00** `size-concordia-kempen-10062-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10062-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10062-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10062-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10062-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10062-saucen-0`

#### #19 Pizza Quattro Stagioni — list from €8.50
_mit Salami, Hinterschinken, Thunfisch und Zwiebeln_

- Item ID: `10063`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10063-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10063-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10063-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10063-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10063-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10063-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10063-saucen-0`

#### #20 Pizza Quattro Formaggi — list from €8.50
_mit Gorgonzola, Gouda Käse, Fetakäse und Mozzarella_

- Item ID: `10064`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10064-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10064-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10064-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10064-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10064-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10064-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10064-saucen-0`

#### #21 Pizza Pizza Spargel — list from €8.50
_mit Hinterschinken, Salami, Spargel und Sauce Hollandaise_

- Item ID: `10035`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10035-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10035-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10035-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10035-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10035-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10035-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10035-saucen-0`

#### #22 Pizza Rustica — list from €8.50
_mit Hinterschinken, Thunfisch, Zwiebeln, Paprika und scharfe Peperoni_

- Item ID: `10036`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10036-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10036-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10036-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10036-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10036-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10036-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10036-saucen-0`

#### #23 Pizza Bruno — list from €8.50
_mit Spinat, Hähnchenbruststreifen und Sauce Hollandaise_

- Item ID: `10037`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10037-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10037-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10037-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10037-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10037-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10037-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10037-saucen-0`

#### #24 Pizza Hähnchen — list from €8.50
_mit Hähnchenbruststreifen, Broccoli und Sauce Hollandaise_

- Item ID: `10039`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10039-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10039-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10039-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10039-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10039-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10039-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10039-saucen-0`

#### #25 Pizza Chef — list from €8.50
_mit Krabben, Spinat, Broccoli, Thunfisch und Knoblauch_

- Item ID: `10040`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10040-klein`
    - groß 30 cm: **€11.00** `size-concordia-kempen-10040-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10040-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10040-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10040-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10040-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10040-saucen-0`

#### #26 Pizza Italia — list from €8.00
_mit Spinat, Paprika und Zwiebeln_

- Item ID: `10041`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.00** `size-concordia-kempen-10041-klein`
    - groß 30 cm: **€10.00** `size-concordia-kempen-10041-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10041-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10041-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10041-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10041-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10041-saucen-0`

#### #27 Pizza Enzo — list from €7.50
_mit Salami und frische Champignons_

- Item ID: `10038`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€7.50** `size-concordia-kempen-10038-3P77O1QPQO`
    - groß 30 cm: **€9.50** `size-concordia-kempen-10038-31P7O1QPQO`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10038-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10038-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10038-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10038-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10038-saucen-0`

#### #28 Pizza Vegetaria A — list from €8.50
_mit Spinat, Paprika, Broccoli und frische Champignons_

- Item ID: `10042`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10042-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10042-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10042-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10042-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10042-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10042-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10042-saucen-0`

#### #29 Pizza Vegetaria B — list from €8.50
_mit Spinat, Zwiebeln, Paprika und Mais_

- Item ID: `10043`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10043-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10043-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10043-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10043-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10043-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10043-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10043-saucen-0`

#### #30 Pizza Vegetaria C — list from €8.50
_mit frische Champignons, Zwiebeln und Oliven_

- Item ID: `10044`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10044-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10044-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10044-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10044-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10044-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10044-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10044-saucen-0`

#### #31 Pizza Vegetaria D — list from €8.50
_mit Cherry Tomaten, frische Champignons, Mozzarella, Spinat und Knoblauch_

- Item ID: `10045`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10045-klein`
    - groß 30 cm: **€11.00** `size-concordia-kempen-10045-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10045-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10045-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10045-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10045-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10045-saucen-0`

#### #32 Pizza Mexico — list from €8.50
_mit Dönerfleisch, Zwiebeln und Sauce Hollandaise_

- Item ID: `10046`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10046-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10046-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10046-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10046-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10046-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10046-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10046-saucen-0`

#### #33 Pizza Concordia — list from €8.50
_mit Dönerfleisch, Zwiebeln, Paprika, Broccoli und Sauce Hollandaise_

- Item ID: `10047`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10047-klein`
    - groß 30 cm: **€11.00** `size-concordia-kempen-10047-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10047-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10047-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10047-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10047-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10047-saucen-0`

#### #34 Pizza Bella — list from €8.50
_mit Zwiebeln, Paprika, Mais und Hähnchenbruststreifen_

- Item ID: `10048`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10048-klein`
    - groß 30 cm: **€10.50** `size-concordia-kempen-10048-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10048-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10048-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10048-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10048-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10048-saucen-0`

#### #35 Pizza Vegas — list from €8.50
_mit frische Champignons, Cherry Tomaten, Sauce Hollandaise, Oliven und Hähnchenbruststreifen_

- Item ID: `10049`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10049-klein`
    - groß 30 cm: **€11.00** `size-concordia-kempen-10049-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10049-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10049-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10049-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10049-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10049-saucen-0`

#### #36 Calzone Spezial — list from €10.50
_zugeklappte Pizza gefüllt mit Thunfisch, Zwiebeln, Fetakäse und scharfe Peperoni_

- Item ID: `10050`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - groß 30 cm: **€10.50** `size-concordia-kempen-10050-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10050-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10050-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10050-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10050-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10050-saucen-0`

#### #37 Calzone Concordia — list from €10.50
_zugeklappte Pizza gefüllt mit Hinterschinken, Salami, Thunfisch, Zwiebeln und Peperoni_

- Item ID: `10051`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - groß 30 cm: **€10.50** `size-concordia-kempen-10051-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10051-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10051-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10051-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10051-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10051-saucen-0`

#### #38 Calzone Döner — list from €10.50
_zugeklappte Pizza gefüllt mit Dönerfleisch, Fetakäse und Peperoni_

- Item ID: `10052`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - groß 30 cm: **€10.50** `size-concordia-kempen-10052-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10052-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10052-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10052-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10052-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10052-saucen-0`

#### #39 Pizza Parma — list from €8.50
_mit Rucola, Parmaschinken, Parmesankäse und frische Tomaten_

- Item ID: `10053`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.50** `size-concordia-kempen-10053-klein`
    - groß 30 cm: **€12.00** `size-concordia-kempen-10053-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10053-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10053-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10053-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10053-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10053-saucen-0`

#### #40 Pizza Diavolo — list from €8.00
_mit Salami, Thunfisch, Paprika und Peperoni_

- Item ID: `10054`
- **Variants:**
  - **Größe** (required, pick 1–1)
    - klein 24 cm: **€8.00** `size-concordia-kempen-10054-klein`
    - groß 30 cm: **€10.00** `size-concordia-kempen-10054-gross`
- **Extras / add-ons:**
  - _Pizza: extra prices depend on selected size (klein/groß)._
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-fleisch-4`
    - Hackfleischsauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-fleisch-6`
    - Hinterschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-fleisch-0`
    - Hähnchenbruststreifen: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10054-fleisch-5`
    - Parmaschinken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-fleisch-1`
    - Salami: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-fleisch-2`
    - Sucuk: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-fleisch-3`
  - **Gemüse** (optional, max 99)
    - Ananas: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-11`
    - Artischocken: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-15`
    - Broccoli: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-5`
    - Champignons: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-6`
    - Cherry Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-10`
    - Knoblauch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-14`
    - Mais: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-8`
    - Oliven: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-7`
    - Paprika: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-0`
    - Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-1`
    - Rucola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-13`
    - Spargel: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-12`
    - Spinat: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-4`
    - Tomaten: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-9`
    - Zwiebeln: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-3`
    - scharfe Peperoni: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-gemuese-2`
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10054-meeresfruechte-1`
    - Lachs: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-meeresfruechte-3`
    - Meeresfrüchte: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10054-meeresfruechte-2`
    - Thunfisch: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-meeresfruechte-0`
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-4`
    - Gorgonzola: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-5`
    - Gouda Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-7`
    - Käse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-2`
    - Mit Käse überbacken: klein **€1.50**, groß **€2.00** `extra-concordia-kempen-10054-saucen-8`
    - Mozzarella: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-3`
    - Parmesankäse: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-6`
    - Sauce Hollandaise: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-1`
    - Tomatensauce: klein **€1.00**, groß **€1.50** `extra-concordia-kempen-10054-saucen-0`

### Pizzabrötchen — 10 Stück mit Kräuterbutter · Gefüllte Varianten

#### #45 Pizzabrötchen 10 Stück — list from €3.50
_mit Kräuterbutter_

- Item ID: `10084`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10084-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10084-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10084-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10084-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10084-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10084-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10084-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10084-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10084-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10084-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10084-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10084-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10084-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10084-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10084-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10084-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10084-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10084-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10084-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10084-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10084-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10084-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10084-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10084-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10084-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10084-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10084-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10084-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10084-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10084-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10084-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10084-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #45a Portion Kräuterbutter — list from €1.50

- Item ID: `10085`
- **Variants:** none (uses list price €1.50)
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10085-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10085-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10085-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10085-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10085-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10085-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10085-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10085-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10085-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10085-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10085-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10085-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10085-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10085-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10085-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10085-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10085-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10085-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10085-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10085-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10085-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10085-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10085-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10085-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10085-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #46 Gefüllte Pizzabrötchen mit Käse — list from €3.50

- Item ID: `10081`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10081-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10081-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10081-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10081-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10081-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10081-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10081-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10081-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10081-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10081-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10081-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10081-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10081-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10081-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10081-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10081-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10081-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10081-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10081-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10081-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10081-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10081-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10081-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10081-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10081-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10081-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10081-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10081-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10081-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10081-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10081-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10081-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #47 Gefüllte Pizzabrötchen mit Thunfisch, Zwiebeln, Fetakäse — list from €3.50

- Item ID: `10078`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10078-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10078-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10078-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10078-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10078-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10078-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10078-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10078-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10078-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10078-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10078-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10078-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10078-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10078-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10078-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10078-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10078-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10078-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10078-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10078-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10078-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10078-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10078-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10078-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10078-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10078-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10078-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10078-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10078-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10078-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10078-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10078-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #48 Gefüllte Pizzabrötchen mit Thunfisch — list from €3.50

- Item ID: `10082`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10082-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10082-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10082-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10082-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10082-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10082-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10082-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10082-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10082-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10082-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10082-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10082-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10082-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10082-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10082-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10082-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10082-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10082-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10082-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10082-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10082-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10082-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10082-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10082-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10082-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10082-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10082-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10082-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10082-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10082-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10082-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10082-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #49 Gefüllte Pizzabrötchen mit Salami — list from €3.50

- Item ID: `10083`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10083-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10083-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10083-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10083-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10083-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10083-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10083-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10083-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10083-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10083-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10083-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10083-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10083-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10083-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10083-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10083-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10083-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10083-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10083-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10083-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10083-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10083-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10083-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10083-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10083-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10083-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10083-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10083-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10083-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10083-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10083-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10083-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #50 Gefüllte Pizzabrötchen mit Hinterschinken — list from €3.50

- Item ID: `10077`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10077-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10077-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10077-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10077-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10077-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10077-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10077-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10077-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10077-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10077-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10077-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10077-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10077-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10077-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10077-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10077-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10077-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10077-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10077-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10077-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10077-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10077-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10077-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10077-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10077-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10077-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10077-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10077-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10077-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10077-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10077-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10077-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #51 Gefüllte Pizzabrötchen mit Bolognese — list from €3.50

- Item ID: `10075`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10075-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10075-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10075-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10075-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10075-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10075-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10075-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10075-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10075-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10075-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10075-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10075-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10075-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10075-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10075-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10075-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10075-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10075-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10075-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10075-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10075-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10075-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10075-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10075-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10075-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10075-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10075-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10075-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10075-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10075-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10075-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10075-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #52 Gefüllte Pizzabrötchen mit Sucuk — list from €3.50

- Item ID: `10076`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10076-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10076-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10076-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10076-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10076-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10076-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10076-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10076-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10076-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10076-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10076-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10076-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10076-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10076-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10076-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10076-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10076-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10076-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10076-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10076-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10076-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10076-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10076-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10076-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10076-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10076-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10076-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10076-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10076-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10076-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10076-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10076-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #53 Gefüllte Pizzabrötchen mit Spinat und Fetakäse — list from €3.50

- Item ID: `10080`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10080-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10080-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10080-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10080-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10080-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10080-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10080-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10080-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10080-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10080-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10080-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10080-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10080-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10080-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10080-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10080-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10080-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10080-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10080-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10080-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10080-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10080-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10080-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10080-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10080-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10080-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10080-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10080-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10080-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10080-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10080-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10080-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #54 Gefüllte Pizzabrötchen mit Dönerfleisch — list from €3.50

- Item ID: `10079`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10079-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10079-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10079-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10079-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10079-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10079-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10079-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10079-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10079-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10079-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10079-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10079-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10079-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10079-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10079-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10079-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10079-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10079-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10079-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10079-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10079-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10079-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10079-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10079-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10079-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10079-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10079-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10079-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10079-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10079-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10079-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10079-saucen-0` — Fixed menu price €1.00 (non-pizza item)

### Schnitzel — Alle Gerichte mit Pommes und Salat

#### #60 Schnitzel Wiener Art — list from €10.50
_mit Zitronenscheibe_

- Item ID: `10093`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€10.00** `size-concordia-kempen-10093-schwein`
    - Hähnchen: **€10.50** `size-concordia-kempen-10093-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10093-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10093-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10093-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10093-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10093-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10093-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10093-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10093-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10093-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10093-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10093-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10093-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10093-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10093-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10093-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10093-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10093-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10093-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10093-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10093-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10093-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10093-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10093-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10093-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10093-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #61 Jägerschnitzel — list from €11.00
_mit Jägersauce_

- Item ID: `10094`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€10.50** `size-concordia-kempen-10094-schwein`
    - Hähnchen: **€11.00** `size-concordia-kempen-10094-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10094-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10094-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10094-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10094-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10094-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10094-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10094-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10094-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10094-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10094-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10094-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10094-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10094-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10094-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10094-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10094-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10094-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10094-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10094-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10094-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10094-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10094-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10094-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10094-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10094-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #62 Paprikaschnitzel — list from €11.00
_mit Balkansauce_

- Item ID: `10091`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€10.50** `size-concordia-kempen-10091-schwein`
    - Hähnchen: **€11.00** `size-concordia-kempen-10091-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10091-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10091-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10091-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10091-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10091-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10091-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10091-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10091-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10091-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10091-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10091-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10091-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10091-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10091-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10091-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10091-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10091-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10091-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10091-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10091-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10091-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10091-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10091-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10091-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10091-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #63 Champignonschnitzel — list from €12.00
_mit Champignons und Sahnesauce_

- Item ID: `10092`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€11.50** `size-concordia-kempen-10092-schwein`
    - Hähnchen: **€12.00** `size-concordia-kempen-10092-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10092-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10092-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10092-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10092-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10092-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10092-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10092-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10092-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10092-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10092-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10092-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10092-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10092-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10092-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10092-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10092-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10092-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10092-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10092-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10092-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10092-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10092-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10092-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10092-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10092-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #64 Schnitzel Hawaii — list from €12.00
_mit Hinterschinken, Ananas und Sahnesauce_

- Item ID: `10086`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€11.50** `size-concordia-kempen-10086-schwein`
    - Hähnchen: **€12.00** `size-concordia-kempen-10086-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10086-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10086-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10086-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10086-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10086-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10086-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10086-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10086-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10086-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10086-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10086-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10086-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10086-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10086-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10086-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10086-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10086-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10086-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10086-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10086-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10086-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10086-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10086-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10086-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10086-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #65 Broccoli Schnitzel — list from €12.00
_mit Broccoli und Sahnesauce_

- Item ID: `10087`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€11.50** `size-concordia-kempen-10087-schwein`
    - Hähnchen: **€12.00** `size-concordia-kempen-10087-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10087-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10087-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10087-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10087-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10087-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10087-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10087-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10087-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10087-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10087-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10087-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10087-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10087-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10087-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10087-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10087-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10087-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10087-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10087-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10087-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10087-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10087-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10087-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10087-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10087-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #66 Spinat Schnitzel — list from €12.00
_mit Spinat, Knoblauch und Sahnesauce_

- Item ID: `10090`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€11.50** `size-concordia-kempen-10090-schwein`
    - Hähnchen: **€12.00** `size-concordia-kempen-10090-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10090-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10090-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10090-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10090-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10090-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10090-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10090-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10090-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10090-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10090-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10090-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10090-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10090-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10090-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10090-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10090-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10090-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10090-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10090-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10090-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10090-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10090-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10090-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10090-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10090-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #67 Zwiebel Schnitzel — list from €12.00
_mit gebratene Zwiebeln und Sahnesauce_

- Item ID: `10088`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€11.50** `size-concordia-kempen-10088-schwein`
    - Hähnchen: **€12.00** `size-concordia-kempen-10088-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10088-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10088-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10088-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10088-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10088-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10088-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10088-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10088-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10088-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10088-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10088-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10088-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10088-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10088-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10088-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10088-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10088-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10088-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10088-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10088-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10088-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10088-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10088-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10088-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10088-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #68 Hollandaise Schnitzel — list from €12.50
_mit Broccoli, frische Champignons, Zwiebeln und Sauce Hollandaise_

- Item ID: `10089`
- **Variants:**
  - **Fleischwahl** (required, pick 1–1)
    - Schwein: **€12.00** `size-concordia-kempen-10089-schwein`
    - Hähnchen: **€12.50** `size-concordia-kempen-10089-haehnchen`
- **Extras / add-ons:**
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10089-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10089-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10089-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10089-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10089-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10089-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10089-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10089-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10089-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10089-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10089-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10089-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10089-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10089-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10089-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10089-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10089-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10089-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10089-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10089-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10089-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10089-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10089-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10089-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10089-saucen-0` — Fixed menu price €1.00 (non-pizza item)

### Burger

#### #70 Burger Klassik — list from €8.50
_mit 180g Rinderhackfleisch, Eisbergsalat, Gurken, Tomaten, Zwiebeln und Sauce_

- Item ID: `10100`
- **Variants:** none (uses list price €8.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10100-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10100-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10100-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10100-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10100-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10100-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10100-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10100-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10100-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10100-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10100-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10100-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10100-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10100-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10100-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10100-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10100-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10100-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10100-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10100-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10100-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10100-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10100-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10100-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10100-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10100-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10100-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10100-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10100-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10100-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10100-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10100-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #71 Doppel-Burger — list from €11.50
_mit 2 x 180g Rinderhackfleisch, Eisbergsalat, Gurken, Tomaten, Zwiebeln und Sauce_

- Item ID: `10098`
- **Variants:** none (uses list price €11.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10098-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10098-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10098-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10098-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10098-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10098-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10098-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10098-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10098-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10098-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10098-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10098-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10098-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10098-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10098-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10098-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10098-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10098-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10098-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10098-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10098-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10098-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10098-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10098-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10098-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10098-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10098-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10098-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10098-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10098-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10098-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10098-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #72 Chess Burger — list from €9.00
_mit 180g Rinderhackfleisch, Eisbergsalat, Gurken, Tomaten, Zwiebeln, Käse und Sauce_

- Item ID: `10099`
- **Variants:** none (uses list price €9.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10099-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10099-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10099-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10099-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10099-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10099-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10099-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10099-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10099-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10099-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10099-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10099-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10099-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10099-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10099-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10099-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10099-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10099-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10099-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10099-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10099-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10099-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10099-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10099-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10099-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10099-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10099-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10099-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10099-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10099-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10099-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10099-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #73 Doppel Chess Burger — list from €12.00
_mit 2 x 180g Rinderhackfleisch, Eisbergsalat, Gurken, Tomaten, Zwiebeln, Käse undSauce_

- Item ID: `10095`
- **Variants:** none (uses list price €12.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10095-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10095-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10095-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10095-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10095-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10095-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10095-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10095-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10095-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10095-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10095-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10095-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10095-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10095-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10095-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10095-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10095-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10095-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10095-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10095-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10095-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10095-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10095-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10095-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10095-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10095-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10095-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10095-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10095-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10095-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10095-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10095-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #74 Chicken Burger — list from €8.00
_mit 135g Hähnchenfleisch, Eisbergsalat, Gurken, Tomaten, Zwiebeln und Sauce_

- Item ID: `10097`
- **Variants:** none (uses list price €8.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10097-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10097-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10097-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10097-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10097-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10097-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10097-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10097-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10097-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10097-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10097-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10097-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10097-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10097-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10097-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10097-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10097-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10097-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10097-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10097-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10097-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10097-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10097-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10097-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10097-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10097-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10097-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10097-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10097-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10097-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10097-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10097-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #75 Chicken Nugget Burger — list from €8.00
_mit Chicken Nuggets, Eisbergsalat, Gurken, Tomaten, Zwiebeln und Sauce_

- Item ID: `10096`
- **Variants:** none (uses list price €8.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10096-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10096-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10096-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10096-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10096-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10096-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10096-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10096-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10096-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10096-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10096-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10096-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10096-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10096-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10096-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10096-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10096-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10096-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10096-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10096-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10096-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10096-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10096-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10096-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10096-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10096-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10096-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10096-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10096-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10096-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10096-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10096-saucen-0` — Fixed menu price €1.00 (non-pizza item)

### Imbiss

#### #80 Pommes frites — list from €3.00

- Item ID: `10111`
- **Variants:** none (uses list price €3.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10111-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10111-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10111-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10111-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #81 Pommes Spezial — list from €4.50

- Item ID: `10112`
- **Variants:** none (uses list price €4.50)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10112-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10112-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10112-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10112-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #82 Bratwurst — list from €6.00
_mit Pommes_

- Item ID: `10109`
- **Variants:** none (uses list price €6.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10109-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10109-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10109-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10109-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #83 Currywurst — list from €6.50
_mit Pommes_

- Item ID: `10110`
- **Variants:** none (uses list price €6.50)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10110-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10110-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10110-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10110-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #84 Bratrolle Spezial — list from €7.50
_mit Pommes_

- Item ID: `10108`
- **Variants:** none (uses list price €7.50)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10108-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10108-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10108-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10108-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #85 Bratrolle — list from €6.00
_mit Pommes_

- Item ID: `10113`
- **Variants:** none (uses list price €6.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10113-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10113-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10113-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10113-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #86 Rindfleischkrokette — list from €5.00
_mit Pommes_

- Item ID: `10107`
- **Variants:** none (uses list price €5.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10107-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10107-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10107-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10107-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #87 Chicken Nuggets 6 Stück — list from €6.00
_mit Pommes_

- Item ID: `10101`
- **Variants:** none (uses list price €6.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10101-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10101-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10101-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10101-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #88 Chicken Wings 8 Stück — list from €8.50
_mit Pommes_

- Item ID: `10102`
- **Variants:** none (uses list price €8.50)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10102-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10102-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10102-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10102-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #89 Mozzarella Sticks — list from €8.00
_mit Pommes_

- Item ID: `10106`
- **Variants:** none (uses list price €8.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10106-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10106-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10106-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10106-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #90 Kartoffel-Kroketten 6 Stück — list from €3.50

- Item ID: `10103`
- **Variants:** none (uses list price €3.50)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10103-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10103-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10103-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10103-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #91 Mayonnaise — list from €1.00

- Item ID: `10104`
- **Variants:** none (uses list price €1.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10104-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10104-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10104-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10104-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

#### #92 Ketchup — list from €1.00

- Item ID: `10105`
- **Variants:** none (uses list price €1.00)
- **Extras / add-ons:**
  - **Beilagen & Saucen** (optional, max 99)
    - Currysauce: **€1.00** `extra-concordia-kempen-10105-beilagen-2` — Fixed menu price €1.00 (non-pizza item)
    - Ketchup: **€1.00** `extra-concordia-kempen-10105-beilagen-1` — Fixed menu price €1.00 (non-pizza item)
    - Kräuterbutter: **€1.50** `extra-concordia-kempen-10105-beilagen-3` — Fixed menu price €1.50 (non-pizza item)
    - Mayonnaise: **€1.00** `extra-concordia-kempen-10105-beilagen-0` — Fixed menu price €1.00 (non-pizza item)

### Pasta — Wahlweise Spaghetti, Penne oder Tortellini

#### #100 Pasta Napoli — list from €9.00
_mit Tomatensauce_

- Item ID: `10018`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10018-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10018-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10018-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10018-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10018-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10018-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10018-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10018-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10018-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10018-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10018-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10018-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10018-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10018-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10018-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10018-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10018-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10018-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10018-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10018-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10018-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10018-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10018-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10018-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10018-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10018-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10018-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10018-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10018-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10018-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10018-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10018-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10018-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10018-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10018-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10018-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10018-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10018-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10018-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #101 Pasta Bolognese — list from €10.00
_mit Hackfleischsauce_

- Item ID: `10019`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10019-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10019-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10019-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10019-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10019-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10019-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10019-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10019-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10019-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10019-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10019-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10019-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10019-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10019-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10019-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10019-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10019-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10019-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10019-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10019-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10019-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10019-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10019-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10019-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10019-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10019-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10019-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10019-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10019-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10019-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10019-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10019-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10019-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10019-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10019-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10019-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10019-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10019-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10019-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #102 Pasta Carbonara — list from €10.00
_mit Hinterschinken, Ei und Sahnesauce_

- Item ID: `10015`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10015-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10015-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10015-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10015-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10015-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10015-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10015-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10015-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10015-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10015-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10015-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10015-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10015-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10015-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10015-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10015-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10015-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10015-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10015-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10015-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10015-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10015-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10015-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10015-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10015-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10015-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10015-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10015-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10015-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10015-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10015-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10015-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10015-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10015-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10015-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10015-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10015-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10015-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10015-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #103 Pasta Alla Panna — list from €10.50
_mit Hinterschinken, frischen Champignons und Sahnesauce_

- Item ID: `10016`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10016-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10016-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10016-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10016-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10016-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10016-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10016-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10016-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10016-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10016-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10016-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10016-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10016-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10016-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10016-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10016-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10016-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10016-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10016-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10016-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10016-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10016-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10016-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10016-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10016-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10016-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10016-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10016-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10016-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10016-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10016-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10016-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10016-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10016-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10016-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10016-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10016-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10016-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10016-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #104 Pasta Toscana — list from €11.00
_mit Hinterschinken, Krabben, frischen Champignons, Knoblauch, Tomaten und Sahnesauce_

- Item ID: `10017`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10017-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10017-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10017-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10017-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10017-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10017-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10017-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10017-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10017-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10017-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10017-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10017-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10017-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10017-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10017-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10017-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10017-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10017-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10017-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10017-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10017-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10017-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10017-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10017-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10017-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10017-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10017-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10017-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10017-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10017-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10017-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10017-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10017-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10017-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10017-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10017-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10017-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10017-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10017-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #105 Pasta Gorgonzola — list from €10.00
_mit Broccoli, frischen Champignons, Gorgonzolakäse und Sahnesauce_

- Item ID: `10011`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10011-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10011-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10011-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10011-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10011-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10011-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10011-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10011-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10011-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10011-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10011-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10011-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10011-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10011-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10011-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10011-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10011-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10011-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10011-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10011-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10011-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10011-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10011-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10011-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10011-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10011-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10011-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10011-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10011-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10011-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10011-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10011-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10011-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10011-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10011-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10011-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10011-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10011-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10011-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #106 Pasta Salmone — list from €11.00
_mit Spinat, Lachs, Knoblauch und Sahnesauce_

- Item ID: `10009`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10009-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10009-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10009-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10009-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10009-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10009-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10009-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10009-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10009-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10009-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10009-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10009-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10009-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10009-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10009-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10009-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10009-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10009-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10009-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10009-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10009-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10009-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10009-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10009-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10009-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10009-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10009-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10009-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10009-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10009-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10009-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10009-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10009-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10009-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10009-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10009-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10009-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10009-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10009-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #107 Pasta Vegetarisch — list from €11.00
_mit Broccoli, Paprika, frischen Champignons, Zwiebeln und Tomaten-Sahnesauce_

- Item ID: `10010`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10010-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10010-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10010-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10010-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10010-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10010-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10010-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10010-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10010-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10010-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10010-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10010-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10010-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10010-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10010-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10010-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10010-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10010-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10010-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10010-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10010-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10010-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10010-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10010-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10010-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10010-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10010-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10010-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10010-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10010-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10010-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10010-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10010-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10010-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10010-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10010-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10010-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10010-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10010-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #108 Pasta Alla Chef — list from €11.00
_mit Hähnchenbruststreifen, frischen Champignons, Mais, Goudakäse, Tomaten und Sahnesauce_

- Item ID: `10014`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10014-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10014-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10014-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10014-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10014-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10014-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10014-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10014-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10014-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10014-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10014-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10014-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10014-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10014-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10014-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10014-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10014-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10014-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10014-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10014-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10014-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10014-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10014-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10014-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10014-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10014-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10014-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10014-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10014-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10014-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10014-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10014-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10014-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10014-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10014-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10014-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10014-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10014-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10014-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #109 Pasta Pasta Concordia — list from €10.50
_mit Hähnchenbruststreifen, Champignons, Broccoli, scharfen Peperonis, Knoblauch und Tomaten-Sahnesauce_

- Item ID: `10012`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Tortellini: **€0.00** `choice-concordia-kempen-10012-req-0-0`
    - Penne: **€0.00** `choice-concordia-kempen-10012-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10012-req-0-2`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10012-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10012-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10012-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10012-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10012-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10012-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10012-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10012-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10012-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10012-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10012-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10012-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10012-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10012-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10012-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10012-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10012-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10012-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10012-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10012-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10012-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10012-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10012-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10012-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10012-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10012-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10012-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10012-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10012-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10012-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10012-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10012-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10012-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10012-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10012-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10012-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #110 Pasta Formaggi — list from €10.50
_mit vier verschiedenen Käsesorten und Sahnesauce_

- Item ID: `10013`
- **Variants:**
  - **Nudelsorte** (optional, pick 0–1)
    - Penne: **€0.00** `choice-concordia-kempen-10013-req-0-1`
    - Spaghetti: **€0.00** `choice-concordia-kempen-10013-req-0-2`
    - Tortellini: **€0.00** `choice-concordia-kempen-10013-req-0-0`
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10013-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10013-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10013-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10013-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10013-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10013-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10013-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10013-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10013-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10013-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10013-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10013-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10013-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10013-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10013-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10013-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10013-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10013-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10013-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10013-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10013-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10013-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10013-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10013-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10013-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10013-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10013-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10013-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10013-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10013-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10013-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10013-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10013-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10013-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10013-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10013-saucen-0` — Fixed menu price €1.00 (non-pizza item)

### Al Forno Gerichte

#### #120 Gemüse Auflauf — list from €12.00
_mit Spaghetti, frischen Champignons, Spinat, Broccoli, Paprika, Zwiebeln und Tomaten-Sahnesauce_

- Item ID: `10034`
- **Variants:**
  - **Nudelsorte** (required, pick 1–1)
    - Spaghetti: **€0.00** `choice-concordia-kempen-10034-noodle-0` [included]
    - Penne: **€0.00** `choice-concordia-kempen-10034-noodle-1` [included]
    - Tortellini: **€0.00** `choice-concordia-kempen-10034-noodle-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10034-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10034-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10034-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10034-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10034-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10034-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10034-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10034-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10034-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10034-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10034-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10034-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10034-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10034-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10034-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10034-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10034-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10034-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10034-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10034-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10034-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10034-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10034-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10034-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10034-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10034-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10034-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10034-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10034-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10034-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10034-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10034-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10034-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10034-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10034-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10034-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #121 Döner Auflauf — list from €12.00
_mit Dönerfleisch, Tomaten, Zwiebeln, Fetakäse, Paprika und Sahnesauce_

- Item ID: `10033`
- **Variants:**
  - **Nudelsorte** (required, pick 1–1)
    - Spaghetti: **€0.00** `choice-concordia-kempen-10033-noodle-0` [included]
    - Penne: **€0.00** `choice-concordia-kempen-10033-noodle-1` [included]
    - Tortellini: **€0.00** `choice-concordia-kempen-10033-noodle-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10033-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10033-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10033-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10033-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10033-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10033-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10033-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10033-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10033-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10033-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10033-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10033-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10033-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10033-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10033-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10033-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10033-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10033-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10033-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10033-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10033-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10033-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10033-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10033-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10033-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10033-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10033-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10033-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10033-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10033-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10033-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10033-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10033-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10033-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10033-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10033-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #122 Penne Auflauf — list from €12.00
_mit Penne, frischen Champignons, Broccoli, Mais und Sahnesauce_

- Item ID: `10030`
- **Variants:**
  - **Nudelsorte** (required, pick 1–1)
    - Spaghetti: **€0.00** `choice-concordia-kempen-10030-noodle-0` [included]
    - Penne: **€0.00** `choice-concordia-kempen-10030-noodle-1` [included]
    - Tortellini: **€0.00** `choice-concordia-kempen-10030-noodle-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10030-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10030-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10030-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10030-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10030-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10030-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10030-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10030-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10030-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10030-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10030-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10030-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10030-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10030-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10030-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10030-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10030-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10030-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10030-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10030-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10030-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10030-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10030-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10030-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10030-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10030-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10030-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10030-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10030-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10030-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10030-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10030-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10030-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10030-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10030-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10030-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #123 Spaghetti Auflauf — list from €12.00
_mit Spaghetti, Zwiebeln, Tomaten, Paprika und Tomaten-Sahnesauce_

- Item ID: `10032`
- **Variants:**
  - **Nudelsorte** (required, pick 1–1)
    - Spaghetti: **€0.00** `choice-concordia-kempen-10032-noodle-0` [included]
    - Penne: **€0.00** `choice-concordia-kempen-10032-noodle-1` [included]
    - Tortellini: **€0.00** `choice-concordia-kempen-10032-noodle-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10032-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10032-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10032-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10032-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10032-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10032-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10032-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10032-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10032-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10032-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10032-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10032-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10032-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10032-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10032-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10032-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10032-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10032-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10032-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10032-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10032-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10032-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10032-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10032-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10032-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10032-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10032-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10032-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10032-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10032-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10032-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10032-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10032-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10032-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10032-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10032-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #124 Tortellini Auflauf — list from €12.00
_mit Tortellini, Hinterschinken, Broccoli und Sahnesauce_

- Item ID: `10031`
- **Variants:**
  - **Nudelsorte** (required, pick 1–1)
    - Spaghetti: **€0.00** `choice-concordia-kempen-10031-noodle-0` [included]
    - Penne: **€0.00** `choice-concordia-kempen-10031-noodle-1` [included]
    - Tortellini: **€0.00** `choice-concordia-kempen-10031-noodle-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10031-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10031-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10031-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10031-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10031-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10031-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10031-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10031-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10031-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10031-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10031-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10031-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10031-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10031-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10031-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10031-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10031-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10031-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10031-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10031-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10031-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10031-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10031-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10031-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10031-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10031-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10031-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10031-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10031-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10031-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10031-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10031-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10031-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10031-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10031-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10031-saucen-0` — Fixed menu price €1.00 (non-pizza item)

### Salate — Mit Dressing nach Wahl

#### #151 Salat Mista — list from €7.50
_gemischter Salat mit Mais und Paprika_

- Item ID: `10028`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10028-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10028-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10028-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10028-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10028-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10028-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10028-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10028-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10028-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10028-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10028-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10028-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10028-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10028-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10028-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10028-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10028-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10028-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10028-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10028-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10028-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10028-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10028-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10028-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10028-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10028-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10028-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10028-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10028-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10028-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #152 Salat Fantasia — list from €10.00
_gemischter Salat mit Thunfisch, Hinterschinken, Artischocken, Fetakäse und Ei_

- Item ID: `10029`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10029-dressing-0`
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10029-dressing-1`
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10029-dressing-2`
  - **Wählen Sie** (optional, pick 0–1)
    - French-Dressing: **€0.00** `choice-concordia-kempen-10029-req-0-0`
    - Jogurtsauce: **€0.00** `choice-concordia-kempen-10029-req-0-1`
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10029-req-0-2`
    - ohne Dressing: **€0.00** `choice-concordia-kempen-10029-req-0-3`
- **Extras / add-ons:**
  - **Extras** (optional, max 99)
    - ohne Beilage: **€0.00** `extra-concordia-kempen-10029-toppings-0-P13Q3R0QOQ7` — Fixed menu price €0.00 (non-pizza item)
  - **Extras** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10029-toppings-1-P37Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10029-toppings-1-PNQQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10029-toppings-1-P07Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10029-toppings-1-P30R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10029-toppings-1-P7NR3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10029-toppings-1-PROQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10029-toppings-1-PR0R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10029-toppings-1-PR7Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10029-toppings-1-PN1R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10029-toppings-1-P0OQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.00** `extra-concordia-kempen-10029-toppings-1-PNOR3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10029-toppings-1-P03R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Krabben: **€1.00** `extra-concordia-kempen-10029-toppings-1-P5QQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10029-toppings-1-P00R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10029-toppings-1-P33R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10029-toppings-1-P51R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.00** `extra-concordia-kempen-10029-toppings-1-P1NR3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10029-toppings-1-PP7Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10029-toppings-1-PN5Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10029-toppings-1-P7PQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10029-toppings-1-PQQQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10029-toppings-1-P55Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10029-toppings-1-POPQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10029-toppings-1-P3OQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10029-toppings-1-PR3R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10029-toppings-1-PP3R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Spaghetti: **€1.00** `extra-concordia-kempen-10029-toppings-1-PQ1R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10029-toppings-1-PONR3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10029-toppings-1-PPOQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10029-toppings-1-P7RQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10029-toppings-1-PORQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10029-toppings-1-PP0R3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Türkisch Knoblauchwurst: **€1.00** `extra-concordia-kempen-10029-toppings-1-PQ5Q3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10029-toppings-1-P1RQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10029-toppings-1-P1PQ3R0QOQ7` — Fixed menu price €1.00 (non-pizza item)

#### #153 Salat Tonno — list from €9.00
_gemischter Salat und Thunfisch_

- Item ID: `10025`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10025-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10025-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10025-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10025-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10025-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10025-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10025-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10025-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10025-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10025-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10025-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10025-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10025-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10025-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10025-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10025-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10025-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10025-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10025-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10025-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10025-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10025-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10025-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10025-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10025-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10025-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10025-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10025-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10025-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10025-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #154 Salat Concordia — list from €10.00
_gemischter Salat mit Krabben, frische Champignons und Rucola_

- Item ID: `10026`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10026-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10026-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10026-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10026-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10026-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10026-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10026-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10026-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10026-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10026-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10026-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10026-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10026-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10026-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10026-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10026-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10026-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10026-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10026-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10026-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10026-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10026-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10026-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10026-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10026-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10026-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10026-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10026-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10026-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10026-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #155 Salat Primavera — list from €10.00
_gemischter Salat mit Oliven, Fetakäse, Artischocken und Ei_

- Item ID: `10027`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10027-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10027-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10027-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10027-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10027-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10027-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10027-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10027-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10027-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10027-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10027-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10027-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10027-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10027-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10027-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10027-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10027-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10027-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10027-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10027-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10027-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10027-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10027-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10027-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10027-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10027-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10027-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10027-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10027-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10027-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #156 Salat Caprese — list from €9.00
_mit Tomaten, Mozzarella und Rucola_

- Item ID: `10020`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10020-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10020-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10020-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10020-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10020-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10020-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10020-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10020-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10020-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10020-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10020-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10020-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10020-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10020-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10020-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10020-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10020-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10020-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10020-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10020-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10020-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10020-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10020-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10020-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10020-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10020-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10020-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10020-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10020-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10020-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #157 Salat Capricciosa — list from €10.00
_gemischter Salat mit Thunfisch, Ei, Hinterschinken und Käse_

- Item ID: `10021`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10021-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10021-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10021-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10021-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10021-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10021-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10021-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10021-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10021-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10021-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10021-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10021-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10021-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10021-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10021-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10021-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10021-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10021-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10021-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10021-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10021-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10021-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10021-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10021-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10021-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10021-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10021-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10021-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10021-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10021-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #158 Salat Hawaii — list from €9.50
_gemischter Salat mit Hinterschinken, Ananas und Käse_

- Item ID: `10024`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10024-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10024-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10024-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10024-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10024-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10024-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10024-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10024-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10024-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10024-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10024-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10024-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10024-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10024-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10024-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10024-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10024-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10024-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10024-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10024-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10024-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10024-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10024-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10024-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10024-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10024-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10024-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10024-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10024-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10024-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #159 Salat Casa — list from €10.50
_gemischter Salat mit Mais, Paprika, Oliven und Fetakäse_

- Item ID: `10022`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10022-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10022-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10022-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10022-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10022-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10022-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10022-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10022-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10022-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10022-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10022-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10022-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10022-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10022-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10022-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10022-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10022-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10022-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10022-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10022-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10022-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10022-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10022-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10022-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10022-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10022-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10022-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10022-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10022-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10022-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

#### #160 Salat Hähnchen — list from €11.00
_gemischter Salat mit gebratene Hähnchenbruststreifen, Paprika und Rucola_

- Item ID: `10023`
- **Variants:**
  - **Dressing** (required, pick 1–1)
    - French Dressing: **€0.00** `choice-concordia-kempen-10023-dressing-0` [included]
    - Joghurtsauce: **€0.00** `choice-concordia-kempen-10023-dressing-1` [included]
    - Essig & Öl: **€0.00** `choice-concordia-kempen-10023-dressing-2` [included]
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10023-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10023-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10023-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10023-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10023-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10023-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10023-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10023-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10023-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10023-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10023-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10023-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10023-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10023-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10023-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10023-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10023-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10023-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10023-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10023-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10023-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10023-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10023-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Meeresfrüchte** (optional, max 99)
    - Krabben: **€1.50** `extra-concordia-kempen-10023-meeresfruechte-1` — Fixed menu price €1.50 (non-pizza item)
    - Lachs: **€1.00** `extra-concordia-kempen-10023-meeresfruechte-3` — Fixed menu price €1.00 (non-pizza item)
    - Meeresfrüchte: **€1.50** `extra-concordia-kempen-10023-meeresfruechte-2` — Fixed menu price €1.50 (non-pizza item)
    - Thunfisch: **€1.00** `extra-concordia-kempen-10023-meeresfruechte-0` — Fixed menu price €1.00 (non-pizza item)

### Baguettes — Mit Eisbergsalat, Tomaten, Gurken, Remoulade

#### #161 Baguette mit Salami — list from €7.00

- Item ID: `10008`
- **Variants:** none (uses list price €7.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10008-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10008-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10008-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10008-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10008-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10008-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10008-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10008-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10008-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10008-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10008-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10008-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10008-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10008-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10008-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10008-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10008-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10008-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10008-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10008-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10008-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10008-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10008-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10008-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10008-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10008-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10008-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10008-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10008-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10008-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10008-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10008-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #162 Baguette mit Hinterschinken — list from €7.00

- Item ID: `10006`
- **Variants:** none (uses list price €7.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10006-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10006-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10006-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10006-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10006-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10006-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10006-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10006-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10006-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10006-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10006-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10006-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10006-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10006-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10006-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10006-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10006-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10006-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10006-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10006-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10006-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10006-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10006-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10006-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10006-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10006-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10006-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10006-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10006-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10006-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10006-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10006-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #163 Baguette mit Thunfisch und Ei — list from €7.50

- Item ID: `10003`
- **Variants:** none (uses list price €7.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10003-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10003-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10003-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10003-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10003-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10003-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10003-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10003-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10003-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10003-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10003-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10003-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10003-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10003-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10003-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10003-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10003-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10003-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10003-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10003-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10003-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10003-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10003-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10003-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10003-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10003-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10003-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10003-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10003-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10003-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10003-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10003-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #164 Baguette mit Sucuk und Ei — list from €7.50

- Item ID: `10005`
- **Variants:** none (uses list price €7.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10005-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10005-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10005-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10005-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10005-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10005-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10005-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10005-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10005-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10005-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10005-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10005-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10005-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10005-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10005-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10005-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10005-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10005-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10005-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10005-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10005-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10005-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10005-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10005-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10005-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10005-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10005-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10005-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10005-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10005-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10005-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10005-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #165 Baguette mit Mozzarella — list from €7.50

- Item ID: `10004`
- **Variants:** none (uses list price €7.50)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10004-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10004-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10004-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10004-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10004-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10004-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10004-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10004-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10004-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10004-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10004-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10004-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10004-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10004-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10004-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10004-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10004-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10004-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10004-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10004-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10004-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10004-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10004-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10004-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10004-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10004-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10004-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10004-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10004-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10004-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10004-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10004-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #166 Baguette mit Thunfisch — list from €7.00

- Item ID: `10007`
- **Variants:** none (uses list price €7.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10007-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10007-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10007-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10007-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10007-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10007-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10007-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10007-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10007-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10007-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10007-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10007-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10007-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10007-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10007-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10007-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10007-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10007-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10007-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10007-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10007-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10007-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10007-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10007-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10007-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10007-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10007-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10007-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10007-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10007-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10007-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10007-saucen-0` — Fixed menu price €1.00 (non-pizza item)

#### #167 Baguette mit Sucuk — list from €7.00

- Item ID: `10002`
- **Variants:** none (uses list price €7.00)
- **Extras / add-ons:**
  - **Fleisch & Wurst** (optional, max 99)
    - Dönerfleisch: **€1.00** `extra-concordia-kempen-10002-fleisch-4` — Fixed menu price €1.00 (non-pizza item)
    - Hackfleischsauce: **€1.00** `extra-concordia-kempen-10002-fleisch-6` — Fixed menu price €1.00 (non-pizza item)
    - Hinterschinken: **€1.00** `extra-concordia-kempen-10002-fleisch-0` — Fixed menu price €1.00 (non-pizza item)
    - Hähnchenbruststreifen: **€1.50** `extra-concordia-kempen-10002-fleisch-5` — Fixed menu price €1.50 (non-pizza item)
    - Parmaschinken: **€1.00** `extra-concordia-kempen-10002-fleisch-1` — Fixed menu price €1.00 (non-pizza item)
    - Salami: **€1.00** `extra-concordia-kempen-10002-fleisch-2` — Fixed menu price €1.00 (non-pizza item)
    - Sucuk: **€1.00** `extra-concordia-kempen-10002-fleisch-3` — Fixed menu price €1.00 (non-pizza item)
  - **Gemüse** (optional, max 99)
    - Ananas: **€1.00** `extra-concordia-kempen-10002-gemuese-11` — Fixed menu price €1.00 (non-pizza item)
    - Artischocken: **€1.00** `extra-concordia-kempen-10002-gemuese-15` — Fixed menu price €1.00 (non-pizza item)
    - Broccoli: **€1.00** `extra-concordia-kempen-10002-gemuese-5` — Fixed menu price €1.00 (non-pizza item)
    - Champignons: **€1.00** `extra-concordia-kempen-10002-gemuese-6` — Fixed menu price €1.00 (non-pizza item)
    - Cherry Tomaten: **€1.00** `extra-concordia-kempen-10002-gemuese-10` — Fixed menu price €1.00 (non-pizza item)
    - Knoblauch: **€1.00** `extra-concordia-kempen-10002-gemuese-14` — Fixed menu price €1.00 (non-pizza item)
    - Mais: **€1.00** `extra-concordia-kempen-10002-gemuese-8` — Fixed menu price €1.00 (non-pizza item)
    - Oliven: **€1.00** `extra-concordia-kempen-10002-gemuese-7` — Fixed menu price €1.00 (non-pizza item)
    - Paprika: **€1.00** `extra-concordia-kempen-10002-gemuese-0` — Fixed menu price €1.00 (non-pizza item)
    - Peperoni: **€1.00** `extra-concordia-kempen-10002-gemuese-1` — Fixed menu price €1.00 (non-pizza item)
    - Rucola: **€1.00** `extra-concordia-kempen-10002-gemuese-13` — Fixed menu price €1.00 (non-pizza item)
    - Spargel: **€1.00** `extra-concordia-kempen-10002-gemuese-12` — Fixed menu price €1.00 (non-pizza item)
    - Spinat: **€1.00** `extra-concordia-kempen-10002-gemuese-4` — Fixed menu price €1.00 (non-pizza item)
    - Tomaten: **€1.00** `extra-concordia-kempen-10002-gemuese-9` — Fixed menu price €1.00 (non-pizza item)
    - Zwiebeln: **€1.00** `extra-concordia-kempen-10002-gemuese-3` — Fixed menu price €1.00 (non-pizza item)
    - scharfe Peperoni: **€1.00** `extra-concordia-kempen-10002-gemuese-2` — Fixed menu price €1.00 (non-pizza item)
  - **Saucen & Käse** (optional, max 99)
    - Fetakäse: **€1.00** `extra-concordia-kempen-10002-saucen-4` — Fixed menu price €1.00 (non-pizza item)
    - Gorgonzola: **€1.00** `extra-concordia-kempen-10002-saucen-5` — Fixed menu price €1.00 (non-pizza item)
    - Gouda Käse: **€1.00** `extra-concordia-kempen-10002-saucen-7` — Fixed menu price €1.00 (non-pizza item)
    - Käse: **€1.00** `extra-concordia-kempen-10002-saucen-2` — Fixed menu price €1.00 (non-pizza item)
    - Mit Käse überbacken: **€1.50** `extra-concordia-kempen-10002-saucen-8` — Fixed menu price €1.50 (non-pizza item)
    - Mozzarella: **€1.00** `extra-concordia-kempen-10002-saucen-3` — Fixed menu price €1.00 (non-pizza item)
    - Parmesankäse: **€1.00** `extra-concordia-kempen-10002-saucen-6` — Fixed menu price €1.00 (non-pizza item)
    - Sauce Hollandaise: **€1.00** `extra-concordia-kempen-10002-saucen-1` — Fixed menu price €1.00 (non-pizza item)
    - Tomatensauce: **€1.00** `extra-concordia-kempen-10002-saucen-0` — Fixed menu price €1.00 (non-pizza item)

### Alkoholfreie Getränke

#### #10114 Lift Apfelschorle 1,0l (MEHRWEG) — list from €4.00
_Die Lift Apfelschorle begeistert mit ihrem einmaligen Geschmack und maximaler Erfrischung._

- Item ID: `10114`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10115 Uludag 0,33l — list from €2.00

- Item ID: `10115`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10116 Sprite 1,0l (MEHRWEG) — list from €4.00
_Bist du bereit für Sprite? Die einzigartige Formel aus grünen Limetten und sonnengelben Zitronen erfrischt dich maximal._

- Item ID: `10116`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10117 Mezzo Mix 1,0l (MEHRWEG) — list from €4.00
_Mixt euch eine gute Zeit mit Mezzo Mix, dem erfrischend-leckeren Kuss aus Cola und Orange._

- Item ID: `10117`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10118 Mineralwasser mit Kohlensäure 0,25l — list from €2.00

- Item ID: `10118`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10119 Durstlöscher 0,5l — list from €2.00

- Item ID: `10119`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10120 Sprite 0,33l (MEHRWEG) — list from €2.00
_Bist du bereit für Sprite? Die einzigartige Formel aus grünen Limetten und sonnengelben Zitronen erfrischt dich maximal._

- Item ID: `10120`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10121 Mineralwasser Still 0,25l — list from €2.00

- Item ID: `10121`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10122 Coca-Cola Zero Sugar 1,0l (MEHRWEG) — list from €4.00
_Keine Kalorien. Null Zucker. Für alle Coke Liebhaber, die beim Geschmack keinen Kompromiss eingehen wollen._

- Item ID: `10122`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10123 Fanta Orange 0,33l (MEHRWEG) — list from €2.00
_Trinke Fanta. Lebe bunter. Spritzig erfrischend begleitet die originale Fanta Orange jede Lebenssituation und macht jetzt noch mehr Spaß._

- Item ID: `10123`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10124 Fanta Orange 1,0l (MEHRWEG) — list from €4.00
_Trinke Fanta. Lebe bunter. Spritzig erfrischend begleitet die originale Fanta Orange jede Lebenssituation und macht jetzt noch mehr Spaß._

- Item ID: `10124`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10125 Coca-Cola 0,33l (MEHRWEG) — list from €2.00
_Coca-Cola steht für einzigartigen Geschmack, Erfrischung und Momente voller Lebensfreude. Die 0,33l Glas-Mehrwegflasche ist unsere Ikone für perfekten Trinkgenuss seit 1886._

- Item ID: `10125`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

#### #10126 Coca-Cola 1,0l (MEHRWEG) — list from €4.00

- Item ID: `10126`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10127 Coca-Cola Zero Sugar 0,33l (MEHRWEG) — list from €2.00
_Keine Kalorien. Null Zucker. Für alle Coke Liebhaber, die beim Geschmack keinen Kompromiss eingehen wollen._

- Item ID: `10127`
- **Variants:** none (uses list price €2.00)
- **Extras:** none

### Alkoholische Getränke

#### #10128 Radler Weizenbier 0,5l — list from €4.00

- Item ID: `10128`
- **Variants:** none (uses list price €4.00)
- **Extras:** none

#### #10129 Krombacher Pills 0,5l — list from €3.00

- Item ID: `10129`
- **Variants:** none (uses list price €3.00)
- **Extras:** none

---

## Summary

| Metric | Count |
|--------|------:|
| Categories | 11 |
| Menu items | 128 |
| Items with size/variants | 75 |
| Items with extras | 112 |
