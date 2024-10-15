import { defineConfig } from "vite";

export default defineConfig((env) => ({
	publicDir: env.command === "serve" ? "public" : undefined,
	build: {
		lib: {
			entry: "./lib/index.ts",
			name: "surrealdbValibot",
			fileName: "surrealdbValibot",
		},
		rollupOptions: {
			external: [
				"valibot",
				"surrealdb",
			],
			output: {
				globals: {
					'valibot': 'valibot',
					'surrealdb': 'surrealdb',
				},
			},
		},
	},
}));