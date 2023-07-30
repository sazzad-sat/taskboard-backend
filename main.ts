import { parse } from "https://deno.land/std@0.194.0/flags/mod.ts";
import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { PORT } from "./envKey.ts";
import registerUserRoute from "./routes/registerUser.ts";

const flags = parse(Deno.args, {boolean: ['dev']});
if (flags.dev) {
    await import('./env.dev.ts');
}

const app = new Application();

const port: number | undefined = Deno.env.get(PORT) ? +Deno.env.get(PORT)! : undefined;

app.use(registerUserRoute.routes())
app.use(registerUserRoute.allowedMethods())

await app.listen({ port });
