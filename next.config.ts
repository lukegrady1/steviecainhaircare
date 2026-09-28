import type { NextConfig } from "next";

/*
  Static export, same as the other Grady Digital client sites. Netlify serves
  the `out/` folder directly (see netlify.toml); there is no server runtime.
  Booking is handled entirely by the embedded GoHighLevel widget, so nothing
  here needs an API route.
*/
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
