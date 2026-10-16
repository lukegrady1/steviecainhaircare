#!/usr/bin/env node
/*
  Sync the service menu in GoHighLevel's *Services* module (Calendars >
  Services tab: categories, services with staff, price and duration) from
  the list below, which mirrors src/lib/site.ts. Idempotent: matches by slug,
  creates what is missing, updates the rest. Writes the service IDs to
  src/lib/ghl-calendars.json under "services".

    node --env-file=.env.local scripts/ghl-services.mjs --dry-run
    node --env-file=.env.local scripts/ghl-services.mjs
*/
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAP_PATH = resolve(ROOT, "src/lib/ghl-calendars.json");
const API = "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_PRIVATE_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const STEVIE = "ibUDEQXkEMvMsx3WA8Zc";
const DRY = process.argv.includes("--dry-run");
if (!TOKEN || !LOCATION_ID) { console.error("Set GHL_PRIVATE_TOKEN and GHL_LOCATION_ID"); process.exit(1); }

const CATEGORIES = [
  { slug: "hair-services", name: "Hair Services", description: "Cuts, fades, and styling tailored to you." },
  { slug: "facial-waxing", name: "Facial Waxing", description: "Quick, tidy, and easy to add on to any cut." },
  { slug: "color", name: "Color", description: "Every color service starts with a free, required consultation." },
];

/* slug (site.ts), category, name, price (starting price for "from"), minutes, description */
const SERVICES = [
  ["short-haircut", "hair-services", "Short Haircut", 45, 45, "Starting at $45. Tailored cut for chin-length and shorter styles. Includes wash and styling."],
  ["long-haircut", "hair-services", "Long Haircut", 60, 60, "Tailored cut for chin-length or longer hair. Includes wash and dry."],
  ["beard-trim", "hair-services", "Beard Trim", 20, 30, "Tailored beard grooming with precision lining."],
  ["bang-trim", "hair-services", "Bang Trim", 15, 15, "Starting at $15. Precise fringe trim to keep bangs polished and fresh."],
  ["bald-fade", "hair-services", "Bald Fade", 55, 45, "Starting at $55. Smooth transition from longer on top down to skin on the sides and back."],
  ["blow-out", "hair-services", "Blow Out / Diffuse", 40, 45, "Starting at $40. Professional blow out or diffuse to highlight your hair's natural beauty."],
  ["neck-clean-up", "hair-services", "Neck Clean Up", 15, 10, "Quick clean-up of the neckline and hairline between cuts."],
  ["hot-tool-styling", "hair-services", "Hot Tool Styling", 40, 45, "Finished style using flat and curling irons."],
  ["kids-haircut", "hair-services", "Kid's Haircut (10 & under)", 30, 30, "Tailored haircut for kids 10 and under."],
  ["designs", "hair-services", "Designs", 15, 15, "Custom clipper/trimmer designs for short haircuts."],
  ["up-dos", "hair-services", "Special Occasions / Up-Dos", 60, 75, "Starting at $60. Polished up-dos and event styling."],
  ["buzz-cut", "hair-services", "Buzz Cut", 25, 20, "Short, uniform clipper cut. Clean and low-maintenance."],
  ["gray-blending", "hair-services", "Camouflage Gray Blending", 35, 30, "Gray blending color service for short hair."],
  ["wax-eyebrow", "facial-waxing", "Eyebrows", 12, 15, "Shapes and defines your brows."],
  ["wax-nose", "facial-waxing", "Nose", 12, 15, "Quick, effective nose hair removal."],
  ["wax-ears", "facial-waxing", "Ears", 12, 15, "Comfortable ear hair removal."],
  ["wax-double", "facial-waxing", "Double", 20, 20, "Any two facial waxing areas."],
  ["wax-triple", "facial-waxing", "Triple", 30, 30, "Eyebrows, nose and ears waxed together."],
  ["color-consultation", "color", "Color Consultation", 0, 15, "Free. Required before any color appointment. We plan the look and the time it needs."],
  ["color-application", "color", "Hair Color Application", 75, 120, "$75 per hour, about 2 hours. Root touch-ups, balayage and more. Book a free color consultation first."],
].map(([slug, category, name, price, minutes, description]) => ({ slug, category, name, price, minutes, description }));

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, Version: "2021-04-15", "Content-Type": "application/json", Accept: "application/json", "User-Agent": "curl/8.0" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  return json;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const cats = (await api("GET", `/calendars/service-categories?locationId=${LOCATION_ID}`));
  const catList = cats.serviceCategories ?? cats.categories ?? cats;
  const catBySlug = new Map(catList.map((c) => [c.slug, c]));
  for (const c of CATEGORIES) {
    if (catBySlug.has(c.slug)) continue;
    if (DRY) { console.log(`[dry-run] create category ${c.name}`); continue; }
    const r = await api("POST", "/calendars/service-categories", { locationId: LOCATION_ID, ...c, isActive: true });
    const created = r.serviceCategory ?? r.category ?? r;
    catBySlug.set(c.slug, created);
    console.log(`Category created ${c.name} ${created._id ?? created.id}`);
  }
  const catId = (slug) => { const c = catBySlug.get(slug); return c?._id ?? c?.id; };

  const existing = (await api("GET", `/calendars/services?locationId=${LOCATION_ID}`)).services ?? [];
  const bySlug = new Map(existing.map((s) => [s.slug, s]));
  const ids = {};
  for (const s of SERVICES) {
    const payload = {
      name: s.name,
      description: `<p>${s.description}</p>`,
      slug: s.slug,
      serviceDuration: s.minutes,
      serviceDurationUnit: "mins",
      payment: { amount: s.price, description: "" },
      serviceCategoryId: catId(s.category),
      teamMembers: [{ id: STEVIE, price: s.price, serviceDuration: s.minutes, serviceDurationUnit: "mins" }],
      isActive: true,
      isPrivate: false,
      industryType: "service",
    };
    const found = bySlug.get(s.slug);
    if (DRY) { console.log(`[dry-run] ${found ? "update" : "create"} ${s.name} $${s.price} ${s.minutes}m -> ${s.category}`); ids[s.slug] = found?._id ?? "DRY"; continue; }
    if (found) {
      await api("PUT", `/calendars/services/${found._id}`, payload);
      ids[s.slug] = found._id;
      console.log(`Updated ${s.name.padEnd(28)} ${found._id}`);
    } else {
      const r = await api("POST", "/calendars/services", { locationId: LOCATION_ID, ...payload });
      const created = r.service ?? r;
      ids[s.slug] = created._id;
      console.log(`Created ${s.name.padEnd(28)} ${created._id}`);
    }
    await sleep(250);
  }
  if (DRY) return;
  const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
  map.services = ids;
  map.serviceCategories = Object.fromEntries(CATEGORIES.map((c) => [c.slug, catId(c.slug)]));
  writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(ids).length} service IDs to src/lib/ghl-calendars.json`);
})().catch((e) => { console.error("\nFailed:", e.message); process.exit(1); });
