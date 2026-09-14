import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("recharts")) return "charts";

          if (id.includes("lucide-react") || id.includes("react-icons")) {
            return "icons";
          }

          if (id.includes("axios")) return "http";

          if (
            id.includes("react/") ||
            id.includes("react-dom") ||
            id.includes("react-router")
          ) {
            return "react";
          }

          return "vendor";
        },
      },
    },
  },
});
