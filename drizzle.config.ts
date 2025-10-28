import type { Config } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

// Prefer .env.local for local dev, then fallback to .env
loadEnv({ path: ".env.local" });
loadEnv();

export default {
	out: "./drizzle/migrations",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
} satisfies Config;

