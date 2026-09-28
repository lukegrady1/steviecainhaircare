#!/usr/bin/env node
/*
  Set each GoHighLevel calendar's meeting color by service group, so Stevie's
  in-app calendar reads at a glance: one color for Hair, one for Facial
  Waxing, one for Color. Calendar IDs come from src/lib/ghl-calendars.json.

  Usage:  node --env-file=.env.local scripts/ghl-colors.mjs [--dry-run]
  Needs GHL_PRIVATE_TOKEN (calendars.write) and GHL_LOCATION_ID.
*/
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(readFileSync(resolve(ROOT, "src/lib/ghl-calendars.json"), "utf8")).calendars;
const API = "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_PRIVATE_TOKEN;
const DRY = process.argv.includes("--dry-run");
if (!TOKEN) { console.error("Set GHL_PRIVATE_TOKEN in .env.local"); process.exit(1); }

/* Three clearly different hues; sage for hair matches the brand. */
const GROUPS = {
  hair: { color: "#6b7a5e", slugs: ["short-haircut","long-haircut","beard-trim","bang-trim","bald-fade","blow-out","neck-clean-up","hot-tool-styling","kids-haircut","designs","up-dos","buzz-cut","gray-blending"] },
  waxing: { color: "#d99a2b", slugs: ["wax-eyebrow","wax-nose","wax-ears","wax-double","wax-triple"] },
  color: { color: "#7b5ea7", slugs: ["color-consultation","color-application"] },
};

const headers = { Authorization: `Bearer ${TOKEN}`, Version: "2021-04-15", "Content-Type": "application/json", Accept: "application/json" };

async function api(method, path, body) {
  const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 300)}`);
  return json;
}

let changed = 0;
for (const [group, { color, slugs }] of Object.entries(GROUPS)) {
  for (const slug of slugs) {
    const id = map[slug];
    if (!id) { console.warn(`no calendar id for ${slug}`); continue; }
    const before = (await api("GET", `/calendars/${id}`)).calendar;
    if (before.eventColor?.toLowerCase() === color) { console.log(`= ${group.padEnd(6)} ${before.name.padEnd(28)} already ${color}`); continue; }
    if (DRY) { console.log(`~ ${group.padEnd(6)} ${before.name.padEnd(28)} ${before.eventColor} -> ${color}`); continue; }
    await api("PUT", `/calendars/${id}`, { eventColor: color });
    const after = (await api("GET", `/calendars/${id}`)).calendar;
    console.log(`${after.eventColor?.toLowerCase() === color ? "✓" : "✗"} ${group.padEnd(6)} ${after.name.padEnd(28)} ${before.eventColor} -> ${after.eventColor}`);
    changed++;
    await new Promise((r) => setTimeout(r, 200));
  }
}
console.log(DRY ? "\n(dry run, nothing changed)" : `\nUpdated ${changed} calendar(s).`);
