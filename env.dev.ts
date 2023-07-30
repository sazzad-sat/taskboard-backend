import { PORT, PRODUCTION } from "./envKey.ts";

Deno.env.set(PORT, "8080")
Deno.env.set(PRODUCTION, "false")
