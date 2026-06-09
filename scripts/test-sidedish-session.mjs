const BASE = "https://www.pizzeria-concordia-kempen.de";
const jar = new Map();

function storeCookies(res) {
  for (const line of res.headers.getSetCookie?.() ?? []) {
    const [pair] = line.split(";");
    const [name, value] = pair.split("=");
    if (name) jar.set(name.trim(), value?.trim() ?? "");
  }
}

async function req(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "User-Agent": "Mozilla/5.0",
      Cookie: [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; "),
      ...(opts.headers ?? {})
    }
  });
  storeCookies(res);
  return res;
}

const r1 = await req(`${BASE}/basket/api/restaurant`);
const restaurant = await r1.json();
console.log("restaurant products", restaurant.MenucardJson.products.length);

const body = new URLSearchParams({
  action: "add",
  menucat: "331QQ77PN",
  product: "350OP1QPQO",
  rest: "3R11R77PN",
  template: "templaterevamped"
});

const r2 = await req(`${BASE}/basket/api/add-sidedish`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body
});

const sidedish = await r2.json();
console.log("json items", sidedish.json?.length);
if (sidedish.json?.[0]) {
  console.log(JSON.stringify(sidedish.json[0], null, 2).slice(0, 2500));
}
