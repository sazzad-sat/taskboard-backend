import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";

const app = new Application();

app.use(async (ctx, next) => {
    console.log(ctx.request.body())
    await next()
})

app.use(ctx => {
    ctx.response.body = JSON.stringify({
        success: "nice"
    })
})

await app.listen();
