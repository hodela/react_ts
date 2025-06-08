import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@/components": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@/pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
            "@/hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
            "@/utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
            "@/types": fileURLToPath(new URL("./src/types", import.meta.url)),
            "@/services": fileURLToPath(new URL("./src/services", import.meta.url)),
            "@/lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
        },
    },
    build: {
        // Tăng giới hạn cảnh báo lên 1000 kB
        chunkSizeWarningLimit: 1000,
        // Tối ưu build performance
        target: "esnext",
        rollupOptions: {
            output: {
                // Tách các thư viện lớn thành chunks riêng
                manualChunks: {
                    // React core
                    "react-vendor": ["react", "react-dom"],
                    // Routing
                    router: ["react-router-dom"],
                    // UI Components (Radix UI - rất nặng)
                    "radix-ui": [
                        "@radix-ui/react-accordion",
                        "@radix-ui/react-alert-dialog",
                        "@radix-ui/react-aspect-ratio",
                        "@radix-ui/react-avatar",
                        "@radix-ui/react-checkbox",
                        "@radix-ui/react-collapsible",
                        "@radix-ui/react-context-menu",
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-hover-card",
                        "@radix-ui/react-label",
                        "@radix-ui/react-menubar",
                        "@radix-ui/react-navigation-menu",
                        "@radix-ui/react-popover",
                        "@radix-ui/react-progress",
                        "@radix-ui/react-radio-group",
                        "@radix-ui/react-scroll-area",
                        "@radix-ui/react-select",
                        "@radix-ui/react-separator",
                        "@radix-ui/react-slider",
                        "@radix-ui/react-slot",
                        "@radix-ui/react-switch",
                        "@radix-ui/react-tabs",
                        "@radix-ui/react-toggle",
                        "@radix-ui/react-toggle-group",
                        "@radix-ui/react-tooltip",
                    ],
                    // Form & Validation
                    "form-libs": ["react-hook-form", "@hookform/resolvers", "zod"],
                    // Data fetching
                    "data-libs": ["@tanstack/react-query", "axios"],
                    // Internationalization
                    i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector", "i18next-http-backend"],
                    // Date & Charts
                    "utility-libs": ["date-fns", "recharts", "react-day-picker"],
                    // Other UI libs
                    "ui-libs": ["lucide-react", "cmdk", "embla-carousel-react", "sonner", "vaul"],
                },
                // Tối ưu filename cho caching
                chunkFileNames: "assets/[name]-[hash].js",
                entryFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
    },
});
