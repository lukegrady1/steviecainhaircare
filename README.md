# Stevie Cain Haircare

Multi-page marketing site with embedded online booking for Stevie Cain Haircare, a solo stylist inside Salons by JC in Oklahoma City. Built by Grady Digital.

**"Good Hair for All Y'all!"**

## Stack

- Next.js 16 (App Router, static export) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Phosphor icons
- GoHighLevel calendar embed for booking (`docs/GHL-SETUP.md`)

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
npm run lint
```

## Where things live

- `src/lib/site.ts` — every business fact: address, phone, hours, services and prices, reviews, gallery slots. Change it here and every section follows.
- `src/lib/ghl-calendars.json` — service slug → GoHighLevel calendar ID. Filled in 2026-09-27 from the live sub-account (location `xIfkb7Kg1NAczAtcfybd`). If a slug is missing, the booking page shows a click-to-call card for that service.
- `src/components/` — one file per section; each takes a `compact` prop for its home-page teaser form. `BookButton.tsx` links to the booking page with the service preselected.
- `scripts/ghl-setup.mjs` — creates the GHL calendar group, 20 service calendars, availability and notifications (not needed; they exist).
- `scripts/ghl-colors.mjs` — sets each calendar's meeting color by service group. Needs `.env.local`.
- `docs/GHL-SETUP.md` — full booking setup walkthrough.

## Pages

`/` home (hero, about teaser, service preview, reviews, four gallery tiles, visit teaser) · `/about/` · `/services/` · `/gallery/` · `/book/` · `/visit/`. Every Book button links to `/book/?service=<slug>`, which preselects that service in the calendar picker.

## Logo

`public/images/logo.png` is Stevie's SC logo with the white background knocked out to alpha (source PNG from Luke). It renders with `mix-blend-multiply` so any residual white edge disappears on the beige header. `src/app/icon.png`, `apple-icon.png`, and `favicon.ico` are generated from it on the beige ground; regenerate them if the logo changes.

## Photos

Client originals (HEIC + MOV from Stevie's Google Drive folder) live in `_source-photos/`, which is git-ignored. Web copies are in `public/images/`:

- `studio/` — the suite (hero, About page, Visit page strip)
- `gallery/` — twelve client photos, 1200px, chosen from the Old Photos folder

Slots are set in `src/lib/site.ts` (`photos`, `gallery`). There is no portrait of Stevie in the client folder yet; the About page shows the suite until one arrives. To convert more originals: `sips -s format jpeg -s formatOptions 80 --resampleHeightWidthMax 1200 in.HEIC --out out.jpg`.

## Deploy (Netlify)

`netlify.toml` builds with `npm run build` and publishes `out/`. Set `NEXT_PUBLIC_SITE_URL` to the production origin in Netlify's environment variables.

## Content rules

- Services, prices, hours, and reviews are the client's exact words. Don't invent or tidy them.
- Durations are placeholders from the brief until Stevie confirms them.
