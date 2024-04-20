import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
    site: SITE.website,
    integrations: [tailwind(), sitemap()],
    output: "server",
    adapter: vercel({
        webAnalytics: {
            enabled: true,
        },
    }),
});
