import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Page2Pixel",
    description: "Transform webpage content into AI-generated images",
    version: "1.0.0",
    icons: {
      16: "origami.svg",
      32: "origami.svg",
      48: "origami.svg",
      128: "origami.svg",
    },
    action: {
      default_icon: {
        16: "origami.svg",
        32: "origami.svg",
        48: "origami.svg",
        128: "origami.svg",
      },
    },
    side_panel: {
      default_path: "sidepanel.html",
      enabled: true,
    },
  },
});
