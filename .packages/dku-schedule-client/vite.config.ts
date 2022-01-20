import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "/data": path.resolve(process.cwd(), "../../data"),
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [path.join(process.cwd(), "../../")],
    },
  },
  base: "./",
  build: {
    outDir: path.resolve(process.cwd(), "../../."),
  },
});
