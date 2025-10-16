import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

// Load environment variables for CLI usage with flexible precedence:
// 1) DRIZZLE_ENV_FILE (explicit)
// 2) NODE_ENV === 'production' -> .env.production
// 3) .env.local
// 4) .env
const cwd = process.cwd();
const envFromVar = process.env.DRIZZLE_ENV_FILE;
const envProduction = resolve(cwd, ".env.production");
const envLocal = resolve(cwd, ".env.local");
const envDefault = resolve(cwd, ".env");

let chosenEnv: string | undefined;

if (envFromVar) {
  const candidate = resolve(cwd, envFromVar);
  chosenEnv = existsSync(envFromVar)
    ? envFromVar
    : existsSync(candidate)
      ? candidate
      : undefined;
}

if (!chosenEnv) {
  if (process.env.NODE_ENV === "production" && existsSync(envProduction)) {
    chosenEnv = envProduction;
  } else if (existsSync(envLocal)) {
    chosenEnv = envLocal;
  } else if (existsSync(envDefault)) {
    chosenEnv = envDefault;
  }
}

loadEnv(chosenEnv ? { path: chosenEnv } : undefined);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
