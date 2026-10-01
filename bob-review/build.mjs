// Inlines questions.json into dashboard.template.html -> dashboard.html (the file published as the artifact).
import { readFileSync, writeFileSync } from "node:fs";
const dir = new URL(".", import.meta.url);
const q = JSON.parse(readFileSync(new URL("questions.json", dir), "utf8"));
const json = JSON.stringify(q).replace(/</g, "\\u003c");
const html = readFileSync(new URL("dashboard.template.html", dir), "utf8").replace("/*QDATA*/null", json);
writeFileSync(new URL("dashboard.html", dir), html);
const n = q.sections.flatMap((s) => s.questions).length;
console.log(`dashboard.html built: ${n} items`);
