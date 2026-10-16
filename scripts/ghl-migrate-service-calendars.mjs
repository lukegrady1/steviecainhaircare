#!/usr/bin/env node
/*
  Recreate the Stevie Cain calendars as GoHighLevel *service booking*
  calendars (the "Services" calendar section, with staff assignment and
  add-ons), because event calendars cannot have a team member and so cannot
  block Stevie's time across services.

  For every active calendar in the sub-account whose ID appears in
  src/lib/ghl-calendars.json:
    1. POST a new service_booking calendar copying name, description,
       duration, interval, color, thank-you message, booking window, group.
    2. Add the three email notifications (client confirmation, client
       24-hour reminder, booked alert to Stevie's email). No SMS.
    3. Rewrite src/lib/ghl-calendars.json with the new IDs (old IDs kept
       under "previousCalendars").
  With --deactivate-old, the old event calendars are set inactive after the
  new ones exist, so the group widget shows only the new set.

  Usage:
    node --env-file=.env.local scripts/ghl-migrate-service-calendars.mjs --dry-run
    node --env-file=.env.local scripts/ghl-migrate-service-calendars.mjs --only bang-trim
    node --env-file=.env.local scripts/ghl-migrate-service-calendars.mjs
    node --env-file=.env.local scripts/ghl-migrate-service-calendars.mjs --deactivate-old
*/
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAP_PATH = resolve(ROOT, "src/lib/ghl-calendars.json");
const API = "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_PRIVATE_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const STEVIE_USER_ID = "ibUDEQXkEMvMsx3WA8Zc";
const STEVIE_EMAIL = "steviecain.haircare@gmail.com";
const DRY = process.argv.includes("--dry-run");
const DEACTIVATE_OLD = process.argv.includes("--deactivate-old");
const onlyIdx = process.argv.indexOf("--only");
const ONLY = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;

if (!TOKEN || !LOCATION_ID) {
  console.error("Set GHL_PRIVATE_TOKEN and GHL_LOCATION_ID in .env.local");
  process.exit(1);
}

/* Salon hours as calendar availability. GHL days: 0 = Sunday; one entry per day (the API rejects multi-day arrays). */
const day = (d, open, close) => ({ daysOfTheWeek: [d], hours: [{ openHour: open, openMinute: 0, closeHour: close, closeMinute: 0 }] });
const OPEN_HOURS = [day(0, 11, 16), day(3, 10, 18), day(4, 10, 18), day(5, 10, 18), day(6, 10, 16)];

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: "2021-04-15",
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "curl/8.0",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  return json;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function newPayload(old) {
  return {
    locationId: LOCATION_ID,
    groupId: old.groupId,
    name: old.name,
    description: old.description,
    /* Widget slugs are unique across GHL; old ones are "stevie-<name>", new ones "stevie-cain-<name>". */
    widgetSlug: old.widgetSlug.replace(/^stevie-/, "stevie-cain-"),
    calendarType: "service_booking",
    widgetType: old.widgetType || "classic",
    eventTitle: old.eventTitle,
    eventColor: old.eventColor,
    isActive: true,
    teamMembers: [{ userId: STEVIE_USER_ID, priority: 0.5, isPrimary: true }],
    slotDuration: old.slotDuration,
    slotDurationUnit: old.slotDurationUnit || "mins",
    slotInterval: old.slotInterval,
    slotIntervalUnit: old.slotIntervalUnit || "mins",
    slotBuffer: old.slotBuffer ?? 0,
    slotBufferUnit: old.slotBufferUnit || "mins",
    preBuffer: old.preBuffer ?? 0,
    preBufferUnit: old.preBufferUnit || "mins",
    appoinmentPerSlot: 1,
    allowBookingAfter: old.allowBookingAfter ?? 2,
    allowBookingAfterUnit: old.allowBookingAfterUnit || "hours",
    allowBookingFor: old.allowBookingFor ?? 60,
    allowBookingForUnit: old.allowBookingForUnit || "days",
    availabilityType: 0,
    openHours: OPEN_HOURS,
    enableRecurring: false,
    autoConfirm: old.autoConfirm ?? true,
    allowReschedule: old.allowReschedule ?? true,
    allowCancellation: old.allowCancellation ?? true,
    googleInvitationEmails: old.googleInvitationEmails ?? true,
    shouldAssignContactToTeamMember: true,
    formSubmitType: old.formSubmitType || "ThankYouMessage",
    formSubmitThanksMessage: old.formSubmitThanksMessage,
    guestType: old.guestType || "collect_detail",
    consentLabel: old.consentLabel,
  };
}

const NOTIFICATIONS = [
  { receiverType: "contact", channel: "email", notificationType: "confirmation", isActive: true },
  { receiverType: "contact", channel: "email", notificationType: "reminder", isActive: true, beforeTime: [{ timeOffset: 24, unit: "hours" }] },
  { receiverType: "emails", additionalEmailIds: [STEVIE_EMAIL], channel: "email", notificationType: "booked", isActive: true },
];

(async () => {
  const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
  const oldIdToSlug = new Map(Object.entries(map.calendars).map(([slug, id]) => [id, slug]));
  const all = (await api("GET", `/calendars/?locationId=${LOCATION_ID}`)).calendars ?? [];
  const olds = all.filter((c) => c.isActive && oldIdToSlug.has(c.id) && c.calendarType === "event");
  console.log(`${DRY ? "[dry-run] " : ""}${olds.length} event calendars to migrate${ONLY ? ` (only ${ONLY})` : ""}\n`);

  if (DEACTIVATE_OLD) {
    const prev = map.previousCalendars ?? {};
    for (const [slug, id] of Object.entries(prev)) {
      if (DRY) { console.log(`[dry-run] deactivate ${slug} ${id}`); continue; }
      await api("PUT", `/calendars/${id}`, { isActive: false });
      console.log(`Deactivated ${slug.padEnd(22)} ${id}`);
      await sleep(200);
    }
    return;
  }

  const created = {};
  for (const old of olds) {
    const slug = oldIdToSlug.get(old.id);
    if (ONLY && slug !== ONLY) continue;
    const payload = newPayload(old);
    if (DRY) { console.log(`[dry-run] create ${old.name} (${old.slotDuration} min, ${payload.widgetSlug})`); continue; }
    const res = await api("POST", "/calendars/", payload);
    const cal = res.calendar ?? res;
    created[slug] = cal.id;
    console.log(`Created  ${old.name.padEnd(28)} ${cal.id}  type=${cal.calendarType} team=${(cal.teamMembers ?? []).map((t) => t.userId).join(",")} dur=${cal.slotDuration} int=${cal.slotInterval}`);
    await api("POST", `/calendars/${cal.id}/notifications`, NOTIFICATIONS);
    await sleep(300);
  }
  if (DRY || Object.keys(created).length === 0) return;

  map.previousCalendars = { ...(map.previousCalendars ?? {}) };
  for (const slug of Object.keys(created)) map.previousCalendars[slug] = map.calendars[slug];
  map.calendars = { ...map.calendars, ...created };
  map._comment = `Service slug -> GoHighLevel service_booking calendar ID in the Stevie Cain Hair Care sub-account (location ${LOCATION_ID}), group ${olds[0]?.groupId} (widget slug ${map.groupSlug}). Recreated as service calendars with Stevie assigned on 2026-10-16 by scripts/ghl-migrate-service-calendars.mjs; previousCalendars holds the retired event calendar IDs.`;
  writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(created).length} new ID(s) to src/lib/ghl-calendars.json`);
})().catch((e) => { console.error("\nFailed:", e.message); process.exit(1); });
