import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

const sqlite = new Database("blog_website.db");

export const db = drizzle(sqlite);
export * from "./schema";

