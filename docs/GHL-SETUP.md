# GoHighLevel booking setup

> **Status (2026-09-27):** the 20 service calendars already exist in the Stevie Cain Hair Care sub-account (location `xIfkb7Kg1NAczAtcfybd`, group `1lWrH7rBiTdUtMO3Fh7G`, group widget slug `stevie-cain-hair-care`). Their IDs are in `src/lib/ghl-calendars.json` and the site embeds them. The script below is only needed if the calendars are ever recreated.
>
> The sub-account's "Claude Code" Private Integration token lives in `.env.local` (git-ignored). `scripts/ghl-colors.mjs` uses it to set meeting colors by group: Hair `#6b7a5e` (sage), Facial Waxing `#d99a2b` (amber), Color `#7b5ea7` (purple). Re-run it after adding a calendar.

Booking on steviecainhaircare.com is the GoHighLevel calendar widget, white-labelled on `api.gradydigital.com`, one calendar per service. This is the full setup, in order.

## 1. Sub-account

Create (or open) the **Stevie Cain Haircare** sub-account in the Grady Digital agency.

- Business Profile: name, `3000 West Memorial Road, Suite 112, Oklahoma City, OK 73120`, phone `(512) 701-4520`, timezone **America/Chicago**.
- Add Stevie as a user (she is the only team member every calendar assigns to).
- Phone number: SMS confirmations and reminders need an LC Phone number on the sub-account with A2P 10DLC registration done. Until that's approved, SMS notifications are created but won't send.

## 2. Private Integration token (one time)

Settings > Private Integrations > **Create**. Name it `Website setup script`, scopes:

- `calendars.write`, `calendars.readonly`
- `users.readonly`

Copy the token (`pit-...`) into `.env.local` as `GHL_PRIVATE_TOKEN`, and the location ID (Settings > Business Profile) as `GHL_LOCATION_ID`. `.env.local` is git-ignored.

## 3. Run the script

```bash
node --env-file=.env.local scripts/ghl-setup.mjs --dry-run   # preview
node --env-file=.env.local scripts/ghl-setup.mjs             # create
```

It creates the **Stevie Cain Haircare** calendar group and 20 service calendars with these placeholder durations (from the brief, pending Stevie's confirmation):

| Service | Duration | Price |
| --- | --- | --- |
| Short Haircut | 45 min | from $45 |
| Long Haircut | 60 min | $60 |
| Bald Fade | 45 min | from $55 |
| Buzz Cut | 20 min | $25 |
| Kid's Haircut (10 & under) | 30 min | $30 |
| Beard Trim | 15 min | $20 |
| Bang Trim | 15 min | from $15 |
| Neck Clean Up | 10 min | $15 |
| Designs | 15 min | $15 |
| Blow Out / Diffuse | 45 min | from $40 |
| Hot Tool Styling | 45 min | $40 |
| Special Occasions / Up-Dos | 75 min | from $60 |
| Camouflage Gray Blending | 30 min | $35 |
| Color Consultation | 15 min | Free |
| Hair Color Application | 120 min | $75 |
| Eyebrow Wax | 10 min | from $12 |
| Nose Wax | 10 min | from $12 |
| Ears Wax | 10 min | from $12 |
| Double Wax | 15 min | from $20 |
| Triple Wax | 20 min | from $40 |

Every calendar gets: availability Sun 11–4, Wed–Fri 10–6, Sat 10–4 (closed Mon/Tue); 15-minute slot interval; 2-hour minimum notice; bookable 2 months out; auto-confirm; reschedule and cancel allowed; and these notifications:

- Contact: booked confirmation (email + SMS), 24-hour reminder (email + SMS), cancellation and reschedule (email + SMS)
- Stevie: booked alert (email + in-app)

The script then writes each calendar's ID into `src/lib/ghl-calendars.json`. Rebuild and deploy, and the site's Book Online section starts embedding the real calendars. Re-running the script is safe: it updates by name rather than duplicating, so change a duration in the script and run it again once Stevie confirms times.

## 4. Two things the public API can't set (do in the GHL UI)

1. **Service Price.** Calendars > each service > Service Details > Price. The price is already in each calendar's description, so the widget shows it either way; this field is only needed if payments are ever turned on.
2. **Booking form with the notes field.** Sites > Forms > Builder > create `Stevie Cain Haircare Booking` with: First Name, Last Name, Phone, Email (all required) and a Multi-line Text field labelled **"Tell me about the look you're going for"** (optional). Then Calendars > each service > Forms & Payments > select that form. Doing it on one calendar and using "Copy settings" (or the calendar duplicate flow) is the quick way across all 20. Without this, the widget uses GHL's default form: first name, last name, phone, email. That still satisfies every required field, only the optional notes box is missing.

## 5. Verify

Open the site, tap **Book** on Bald Fade, confirm the calendar shows Bald Fade, pick a Wednesday slot, and book a test appointment with your own phone. You should receive the SMS and email confirmation within a minute. Delete the test appointment afterward.

## Changing durations later

Edit `minutes` in `src/lib/site.ts` (the card chip) and the matching row in `scripts/ghl-setup.mjs`, run the script, rebuild.
