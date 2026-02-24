const values = require("../data/values.json").values;
const fs = require("fs");

function toKebabCase(str) {
  return str.toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const ids = values
  .filter((v) => v.tier !== null)
  .map((v) => toKebabCase(v.value.split(":")[0].trim()));

const images = fs
  .readdirSync("./public/images/values/")
  .filter((f) => f.endsWith(".png"))
  .map((f) => f.replace(".png", ""));

const missing = ids.filter((id) => !images.includes(id));
const extra = images.filter((id) => !ids.includes(id));

console.log("Total values:", ids.length);
console.log("Total images:", images.length);
console.log("Missing images:", missing.length ? missing.join(", ") : "NONE");
console.log("Extra images:", extra.length ? extra.join(", ") : "NONE");
