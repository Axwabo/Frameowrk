import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const base = "/Frameowrk/";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue(), VitePWA({
        registerType: "prompt",
        injectRegister: false,

        pwaAssets: {
            disabled: false,
            config: true
        },

        manifest: {
            name: "Frameowrk",
            short_name: "frameowrk",
            description: "A browser game where you control a cat with a mouse to make frames",
            theme_color: "#f5c876"
        },

        workbox: {
            globPatterns: [ "**/*.{js,css,html,svg,png,ico}" ],
            cleanupOutdatedCaches: true,
            clientsClaim: true
        },

        devOptions: {
            enabled: false,
            navigateFallback: "index.html",
            suppressWarnings: true,
            type: "module"
        },

        base
    }) ],

    base
})