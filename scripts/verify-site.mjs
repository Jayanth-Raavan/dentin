import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../dist/", import.meta.url));
const indexUrl = new URL("../dist/index.html", import.meta.url);
const html = await readFile(indexUrl, "utf8");

if (!html.includes("DENTIN Oral Experts") || html.includes("Your site is taking shape")) {
  throw new Error("The DENTIN page is missing or a starter page was included.");
}

const localPaths = new Set(
  [...html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)]
    .map((match) => match[1]),
);

for (const path of localPaths) {
  await access(new URL(`.${path}`, new URL("../dist/", import.meta.url)));
}

console.log(`DENTIN site is ready in ${siteRoot}; verified ${localPaths.size} local assets.`);
