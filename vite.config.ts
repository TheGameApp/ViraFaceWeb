// vite.config.ts

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		tsConfigPaths(),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart(),
		// react's vite plugin must come after start's vite plugin
		viteReact(),
		tailwindcss(),
	],
});
