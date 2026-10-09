// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// User GitHub Pages site → served at the domain root, so no `base` needed.
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },
  site: "https://maxiozonas.github.io",
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    server: { watch: { ignored: ["**/artifacts/**", "**/dist/**"] } },
    plugins: [tailwindcss()],
  },
});
