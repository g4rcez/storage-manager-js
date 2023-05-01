import { defineConfig } from "vite";

export default defineConfig({
	plugins: [],
	build: {
		emptyOutDir: false,
		sourcemap: true,
		outDir: "./dist",
		lib: {
			name: "storageManagerJs",
			entry: "./src/index.ts",
			fileName: "storageManagerJs",
			formats: ["cjs", "es", "umd"],
		},
	},
});
