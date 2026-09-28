import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/*
  Open Graph card, rendered at build time (static export). Fraunces (upright 600 only, so the
  headline is not set in the italic face) is fetched from Google Fonts at build; if that fetch fails the card still
  renders with the default sans so a font outage can never break a deploy.
*/
export const dynamic = "force-static";

export const alt = "Stevie Cain Haircare — Good Hair for All Y’all!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@600&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+\.(?:ttf|woff))\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const fraunces = await loadFraunces();
  const display = fraunces ? "Fraunces" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f2ede4",
          color: "#1a1a1a",
          fontFamily: display,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#595955" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#6b7a5e" }} />
          Oklahoma City · Inside Salons by JC
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2 }}>
            Good Hair for
          </div>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2, fontStyle: "italic" }}>
            All Y’all!
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 34 }}>
            <span style={{ fontWeight: 600 }}>{site.name}</span>
            <span style={{ fontSize: 26, color: "#595955" }}>Haircuts · Color · Styling · Facial Waxing</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 30 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="30" height="30" viewBox="0 0 24 24" fill="#6b7a5e">
                <path d="M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.7 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z" />
              </svg>
            ))}
            <span style={{ marginLeft: 8, color: "#1a1a1a", fontWeight: 600 }}>5.0</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fraunces
        ? [{ name: "Fraunces", data: fraunces, weight: 600, style: "normal" }]
        : [],
    },
  );
}
