# Stevie Cain Hair Care

Multi-page marketing site with embedded online booking for Stevie Cain Hair Care, a solo stylist inside Salons by JC in Oklahoma City. Built by Grady Digital.

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
- `src/lib/ghl-calendars.json` — service slug → GoHighLevel Services-module service ID (`services`), plus the module's booking page URL. Older `calendars` / `previousCalendars` entries are retired Meetings-tab calendars, all inactive.
- `src/components/` — one file per section; each takes a `compact` prop for its home-page teaser form. `BookButton.tsx` links to the booking page with the service preselected.
- `scripts/ghl-services.mjs` — syncs the GHL Services tab (categories, services, price, duration, staff) from the list inside it, which mirrors `site.ts`. Idempotent; run it after changing the menu.
- `scripts/ghl-setup.mjs`, `scripts/ghl-migrate-service-calendars.mjs` — earlier calendar-based setups. Obsolete; do not run.
- `scripts/ghl-colors.mjs` — sets each calendar's meeting color by service group. Needs `.env.local`.
- `docs/GHL-SETUP.md` — full booking setup walkthrough.

## Pages

`/` home (hero, about teaser, service preview, reviews, gallery slider, visit teaser) · `/about/` · `/services/` · `/gallery/` · `/book/` · `/visit/` · `/privacy/` · `/terms/` (SMS compliance pages linked from the footer) · custom 404. Every Book button links to `/book/?service=<slug>`; the embedded GHL Services booking page cannot preselect a service, so the page shows a hint naming the service and its category above the menu.

## Logo

`public/images/logo.webp` is Stevie's SC logo with the white background knocked out to alpha (source PNG from Luke). It renders with `mix-blend-multiply` so any residual white edge disappears on the beige header. `src/app/icon.png`, `apple-icon.png`, and `favicon.ico` are generated from it on the beige ground; regenerate them if the logo changes.

## Photos

Client originals (HEIC + MOV from Stevie's Google Drive folder) live in `_source-photos/`, which is git-ignored. Web copies are in `public/images/`:

- `studio/` — the suite (hero, About page, Visit page strip)
- `gallery/` — 24 client photos, 1200px, chosen from the Old Photos folder
- `stevie.webp` — Stevie's headshot (About page)

Slots are set in `src/lib/site.ts` (`photos`, `gallery`). To convert more originals: `sips -s format jpeg -s formatOptions 80 --resampleHeightWidthMax 1200 in.HEIC --out out.jpg`.

## Deploy (Netlify)

`netlify.toml` builds with `npm run build` and publishes `out/`. Environment variables to set in Netlify are listed in `.env.example` (`NEXT_PUBLIC_SITE_URL`, optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).

Google Business Profile links (directions, map embed, "Find us on Google", review link) all use the Place ID in `site.google`; see `src/lib/site.ts`.

## Content rules

- Services, prices, hours, and reviews are the client's exact words. Don't invent or tidy them.
- Durations are placeholders from the brief until Stevie confirms them.
