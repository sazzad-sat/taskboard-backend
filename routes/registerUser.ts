import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";

const router = new Router();

router.post('/register-user', async ({ request, response }) => {
    console.log(await request.body().value);

    response.status = Status.OK;
    response.body = {
        success: true
    };
});

export default router;
