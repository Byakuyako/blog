import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [tailwind()],
  site: "https://byakuyako.com",
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
});
