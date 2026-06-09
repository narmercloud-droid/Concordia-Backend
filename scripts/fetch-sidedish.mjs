const params = new URLSearchParams({
  action: "add",
  menucat: process.argv[3] || "331QQ77PN",
  product: process.argv[2] || "350OP1QPQO",
  rest: "3R11R77PN",
  template: "templaterevamped"
});

const res = await fetch("https://www.pizzeria-concordia-kempen.de/basket/api/add-sidedish", {
  method: "POST",
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache"
  },
  body: params.toString()
});

console.log("status", res.status);
const text = await res.text();
console.log(text.slice(0, 3000));
