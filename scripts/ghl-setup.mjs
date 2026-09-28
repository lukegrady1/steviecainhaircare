#!/usr/bin/env node
/*
  GoHighLevel setup for Stevie Cain Haircare.

  Creates, in Stevie's sub-account:
    1. A calendar group ("service menu") named "Stevie Cain Haircare".
    2. One service-booking calendar per service in src/lib/site.ts, with the
       placeholder duration, the price in the description, and availability
       matching the salon hours (closed Mon/Tue).
    3. Email + SMS confirmations to the client, a 24-hour reminder by email
       and SMS, and a booked notification to Stevie.
  Then writes the slug -> calendarId map to src/lib/ghl-calendars.json so the
  site's booking section starts embedding the real calendars.

  Idempotent: re-running finds existing group/calendars by name and updates
  them instead of duplicating. Safe to run after changing a duration.

  Usage:
    GHL_PRIVATE_TOKEN=pit-... GHL_LOCATION_ID=... node scripts/ghl-setup.mjs
    (or put them in .env.local and run:  node --env-file=.env.local scripts/ghl-setup.mjs)

  Options:
    --dry-run   print what would be created, make no changes
    --user-id   Stevie's GHL user id (or set GHL_USER_ID); auto-picked if the
                sub-account has exactly one user

  API reference: https://marketplace.gohighlevel.com/docs/ (Calendars, v2021-04-15).
  Token: sub-account Settings > Private Integrations, scopes
  calendars.write, calendars.readonly, users.readonly.

  Not in the public API (do once in the UI, see docs/GHL-SETUP.md):
    - the "Service Price" field on each service calendar
    - a custom booking form with the optional "Tell me about the look" notes field
*/

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MAP_PATH = resolve(ROOT, "src/lib/ghl-calendars.json");

const API = "https://services.leadconnectorhq.com";
const VERSION = "2021-04-15";
const TOKEN = process.env.GHL_PRIVATE_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const DRY = process.argv.includes("--dry-run");
const argUser = process.argv.indexOf("--user-id");
let USER_ID = argUser > -1 ? process.argv[argUser + 1] : process.env.GHL_USER_ID || "";

if (!TOKEN || !LOCATION_ID) {
  console.error("Set GHL_PRIVATE_TOKEN and GHL_LOCATION_ID (see .env.example).");
  process.exit(1);
}

/* ------------------------------------------------------------------ data */

const BUSINESS = {
  name: "Stevie Cain Haircare",
  slug: "stevie-cain-haircare",
  description: "Good Hair for All Y'all! Personalized haircuts, styling, color, and facial waxing in Oklahoma City.",
  address: "3000 West Memorial Road, Suite 112 (inside Salons by JC), Oklahoma City, OK 73120",
  phone: "(512) 701-4520",
  alertEmail: process.env.GHL_ALERT_EMAIL || "",
};

/*
  Standard availability. GHL days: 0 = Sunday ... 6 = Saturday.
  Sun 11-4, Wed/Thu/Fri 10-6, Sat 10-4, closed Mon/Tue.
*/
const OPEN_HOURS = [
  { daysOfTheWeek: [0], hours: [{ openHour: 11, openMinute: 0, closeHour: 16, closeMinute: 0 }] },
  { daysOfTheWeek: [3, 4, 5], hours: [{ openHour: 10, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
  { daysOfTheWeek: [6], hours: [{ openHour: 10, openMinute: 0, closeHour: 16, closeMinute: 0 }] },
];

/*
  Services mirror src/lib/site.ts. Durations are the brief's placeholders
  until Stevie confirms them. Price goes in the description because the
  public API has no price field for service calendars.
*/
const SERVICES = [
  ["short-haircut", "Short Haircut", "from $45", 45, "Tailored cut for chin-length and shorter styles; includes wash and styling."],
  ["long-haircut", "Long Haircut", "$60", 60, "Tailored cut for chin-length or longer hair; includes wash and dry."],
  ["bald-fade", "Bald Fade", "from $55", 45, "Smooth transition from longer on top to skin at the sides/back."],
  ["buzz-cut", "Buzz Cut", "$25", 20, "Short, uniform clipper cut; clean and low-maintenance."],
  ["kids-haircut", "Kid's Haircut (10 & under)", "$30", 30, ""],
  ["beard-trim", "Beard Trim", "$20", 15, "Tailored beard grooming with precision lining."],
  ["bang-trim", "Bang Trim", "from $15", 15, ""],
  ["neck-clean-up", "Neck Clean Up", "$15", 10, ""],
  ["designs", "Designs", "$15", 15, "Clipper/trimmer designs on short cuts."],
  ["blow-out", "Blow Out / Diffuse", "from $40", 45, ""],
  ["hot-tool-styling", "Hot Tool Styling", "$40", 45, "Flat iron / curling iron finish."],
  ["up-dos", "Special Occasions / Up-Dos", "from $60", 75, ""],
  ["gray-blending", "Camouflage Gray Blending", "$35", 30, "For short hair."],
  ["color-consultation", "Color Consultation", "Free", 15, ""],
  ["color-application", "Hair Color Application", "$75", 120, "Root touch-ups, balayage, and more."],
  ["wax-eyebrow", "Eyebrow Wax", "from $12", 10, ""],
  ["wax-nose", "Nose Wax", "from $12", 10, ""],
  ["wax-ears", "Ears Wax", "from $12", 10, ""],
  ["wax-double", "Double Wax (any two areas)", "from $20", 15, ""],
  ["wax-triple", "Triple Wax (brow + ears + nose)", "from $40", 20, ""],
].map(([slug, name, price, minutes, blurb]) => ({ slug, name, price, minutes, blurb }));

/* ------------------------------------------------------------------ http */

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json).slice(0, 600)}`);
  }
  return json;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ steps */

async function resolveUser() {
  if (USER_ID) return USER_ID;
  const data = await api("GET", `/users/?locationId=${LOCATION_ID}`);
  const users = data.users ?? [];
  if (users.length === 1) {
    console.log(`Using the only user in the sub-account: ${users[0].name} <${users[0].email}>`);
    return users[0].id;
  }
  console.error("Set GHL_USER_ID (or --user-id) to Stevie's user. Users in this sub-account:");
  for (const u of users) console.error(`  ${u.id}  ${u.name}  <${u.email}>`);
  process.exit(1);
}

async function ensureGroup() {
  const existing = (await api("GET", `/calendars/groups?locationId=${LOCATION_ID}`)).groups ?? [];
  const found = existing.find((g) => g.name === BUSINESS.name);
  if (found) {
    console.log(`Group exists: ${found.name} (${found.id})`);
    return found.id;
  }
  if (DRY) { console.log(`[dry-run] would create group "${BUSINESS.name}"`); return "DRY_GROUP"; }
  const created = await api("POST", "/calendars/groups", {
    locationId: LOCATION_ID,
    name: BUSINESS.name,
    description: BUSINESS.description,
    slug: BUSINESS.slug,
    isActive: true,
  });
  const id = created.group?.id ?? created.id;
  console.log(`Created group: ${BUSINESS.name} (${id})`);
  return id;
}

function calendarPayload(svc, groupId, userId) {
  const desc = [`${svc.price}${svc.minutes ? ` · ${svc.minutes} min` : ""}`, svc.blurb].filter(Boolean).join("\n");
  return {
    locationId: LOCATION_ID,
    groupId,
    name: svc.name,
    description: desc,
    slug: svc.slug,
    widgetSlug: svc.slug,
    calendarType: "service_booking",
    widgetType: "default",
    eventTitle: `{{contact.name}} – ${svc.name}`,
    eventColor: "#c2603e",
    isActive: true,
    teamMembers: [
      {
        userId,
        priority: 0.5,
        isPrimary: true,
        locationConfigurations: [{ kind: "physical", location: BUSINESS.address }],
      },
    ],
    locationConfigurations: [{ kind: "physical", location: BUSINESS.address }],
    slotDuration: svc.minutes,
    slotDurationUnit: "mins",
    slotInterval: 15,
    slotIntervalUnit: "mins",
    slotBuffer: 0,
    slotBufferUnit: "mins",
    preBuffer: 0,
    preBufferUnit: "mins",
    appoinmentPerSlot: 1,
    appoinmentPerDay: 0,
    allowBookingAfter: 2,
    allowBookingAfterUnit: "hours",
    allowBookingFor: 2,
    allowBookingForUnit: "months",
    availabilityType: 0,
    openHours: OPEN_HOURS,
    enableRecurring: false,
    stickyContact: true,
    autoConfirm: true,
    allowReschedule: true,
    allowCancellation: true,
    shouldAssignContactToTeamMember: true,
    shouldSkipAssigningContactForExisting: false,
    shouldSendAlertEmailsToAssignedMember: true,
    ...(BUSINESS.alertEmail ? { alertEmail: BUSINESS.alertEmail } : {}),
    googleInvitationEmails: false,
    formSubmitType: "ThankYouMessage",
    formSubmitThanksMessage:
      "You're booked! You'll get a confirmation by text and email, and a reminder the day before. See you soon. – Stevie",
    guestType: "count_only",
    notes: `Booked from steviecainhaircare.com · ${svc.name} · ${svc.price}`,
  };
}

async function ensureCalendars(groupId, userId) {
  const existing = (await api("GET", `/calendars/?locationId=${LOCATION_ID}&showDrafted=true`)).calendars ?? [];
  const byName = new Map(existing.map((c) => [c.name, c]));
  const map = {};

  for (const svc of SERVICES) {
    const payload = calendarPayload(svc, groupId, userId);
    const found = byName.get(svc.name);
    if (DRY) {
      console.log(`[dry-run] ${found ? "update" : "create"} calendar "${svc.name}" ${svc.minutes} min ${svc.price}`);
      map[svc.slug] = found?.id ?? "DRY";
      continue;
    }
    let id;
    if (found) {
      const { locationId: _l, ...update } = payload;
      await api("PUT", `/calendars/${found.id}`, update);
      id = found.id;
      console.log(`Updated  ${svc.name.padEnd(34)} ${id}`);
    } else {
      const created = await api("POST", "/calendars/", payload);
      id = created.calendar?.id ?? created.id;
      console.log(`Created  ${svc.name.padEnd(34)} ${id}`);
    }
    map[svc.slug] = id;
    await ensureNotifications(id);
    await sleep(250); // stay well under the 100 req / 10 s burst limit
  }
  return map;
}

/*
  Notifications. GHL's "Calendar Notifications" API replaces the deprecated
  `notifications` array on the calendar. One set per calendar:
    - booked confirmation to the contact, email + SMS
    - 24-hour reminder to the contact, email + SMS
    - booked alert to Stevie (assigned user), email
  Default GHL templates are used when no body/subject is passed.
*/
function notificationSet() {
  const contact = (channel, notificationType, extra = {}) => ({
    receiverType: "contact",
    channel,
    notificationType,
    isActive: true,
    ...extra,
  });
  const reminder = { beforeTime: [{ timeOffset: 24, unit: "hours" }] };
  return [
    contact("email", "booked"),
    contact("sms", "booked"),
    contact("email", "reminder", reminder),
    contact("sms", "reminder", reminder),
    contact("email", "cancellation"),
    contact("sms", "cancellation"),
    contact("email", "reschedule"),
    contact("sms", "reschedule"),
    { receiverType: "assignedUser", channel: "email", notificationType: "booked", isActive: true },
    { receiverType: "assignedUser", channel: "inApp", notificationType: "booked", isActive: true },
  ];
}

async function ensureNotifications(calendarId) {
  const existing = (await api("GET", `/calendars/${calendarId}/notifications?isActive=true`)) ?? [];
  const list = Array.isArray(existing) ? existing : existing.notifications ?? [];
  const key = (n) => `${n.receiverType}|${n.channel}|${n.notificationType}`;
  const have = new Set(list.filter((n) => !n.deleted).map(key));
  const missing = notificationSet().filter((n) => !have.has(key(n)));
  if (missing.length === 0) return;
  await api("POST", `/calendars/${calendarId}/notifications`, missing);
  console.log(`         + ${missing.length} notification(s)`);
}

function writeMap(map) {
  const current = JSON.parse(readFileSync(MAP_PATH, "utf8"));
  current.calendars = { ...current.calendars, ...map };
  if (DRY) {
    console.log("[dry-run] would write", MAP_PATH, JSON.stringify(current.calendars, null, 2));
    return;
  }
  writeFileSync(MAP_PATH, JSON.stringify(current, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(map).length} calendar IDs to ${MAP_PATH}`);
}

/* ------------------------------------------------------------------ main */

(async () => {
  console.log(`${DRY ? "[dry-run] " : ""}Setting up "${BUSINESS.name}" in location ${LOCATION_ID}\n`);
  const userId = await resolveUser();
  const groupId = await ensureGroup();
  const map = await ensureCalendars(groupId, userId);
  writeMap(map);
  console.log("\nDone. Next: rebuild the site (npm run build). Then in GHL set each calendar's");
  console.log("Service Price and attach the booking form with the notes field (docs/GHL-SETUP.md).");
})().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
