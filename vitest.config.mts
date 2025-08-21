import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
	},
	resolve: {
		alias: {
			"@/": path.resolve(__dirname, "./"),
			"@app": path.resolve(__dirname, "./app"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@libs": path.resolve(__dirname, "./src/libs"),
			"@store": path.resolve(__dirname, "./src/store"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@tests": path.resolve(__dirname, "./src/tests"),
			"@utils": path.resolve(__dirname, "./src/utils"),
		},
	},
});
