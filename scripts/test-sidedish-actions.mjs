const BASE = "https://www.pizzeria-concordia-kempen.de";
const jar = new Map();

async function req(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json, text/html, */*",
      Referer: `${BASE}/`,
      Cookie: [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; "),
      ...(opts.headers ?? {})
    }
  });
  for (const line of res.headers.getSetCookie?.() ?? []) {
    const [pair] = line.split(";");
    const [name, value] = pair.split("=");
    if (name) jar.set(name.trim(), value?.trim() ?? "");
  }
  return res;
}

await req(`${BASE}/`);
console.log("cookies after home", [...jar.keys()]);

const restaurantRes = await req(`${BASE}/basket/api/restaurant`);
const restaurant = await restaurantRes.json();
console.log("cookies after restaurant", [...jar.keys()]);
console.log("products", restaurant.MenucardJson.products.length);

for (const action of ["add", "show", "get"]) {
  const body = new URLSearchParams({
    action,
    menucat: "331QQ77PN",
    product: "350OP1QPQO",
    rest: "3R11R77PN",
    template: "templaterevamped"
  });
  const res = await req(`${BASE}/basket/api/add-sidedish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
      "X-Requested-With": "XMLHttpRequest"
    },
    body
  });
  const data = await res.json();
  console.log(action, "json len", data.json?.length ?? 0, "html len", data.html?.length ?? 0);
  if (data.json?.length) {
    console.log(JSON.stringify(data.json[0], null, 2).slice(0, 2000));
  }
}
