import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import portChecker from "vite-plugin-port-checker"
import { Mode, plugin as markdown } from "vite-plugin-markdown"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), portChecker(), markdown({ mode: [Mode.HTML, Mode.TOC] })],
  base: "/",
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return
          }

          if (id.includes("react-router")) {
            return "router-vendor"
          }

          if (id.includes("redux") || id.includes("immer")) {
            return "redux-vendor"
          }

          if (id.includes("/node_modules/@ant-design/")) {
            return "ant-design-vendor"
          }

          if (id.includes("/node_modules/rc-")) {
            return "antd-rc-vendor"
          }

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/")
          ) {
            return "react-vendor"
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
