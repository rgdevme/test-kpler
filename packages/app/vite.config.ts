import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export const viteConfig = defineConfig({
	plugins: [vue(), tailwindcss()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@server": fileURLToPath(new URL("../server/src", import.meta.url)),
		},
	},
	server: {
		port: 5173,
		proxy: {
			"/api": "http://127.0.0.1:3000",
		},
	},
	preview: {
		port: 4173,
	},
});

export default viteConfig;
