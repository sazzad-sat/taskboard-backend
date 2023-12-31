import { createRequire } from "https://deno.land/std@0.112.0/node/module.ts";
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { FIREBASE_SERVICE_ACCOUNT_KEY, HASURA_ADMIN_SECRET, HASURA_URL } from "../envKey.ts";

const app = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Deno.env.get(FIREBASE_SERVICE_ACCOUNT_KEY)!))
});

const router = new Router();

router.use(({ request, response }, next) => {
    const token = request.headers.get('Authorization')!;
    console.log(token);


    try {
        app.auth().verifyIdToken(token, true)
            .then(() => {
                return next();
            })
            .catch((error: Error) => {
                console.error(error);
            });
    } catch (e) {
        console.error(e);

        response.status = Status.Unauthorized;
        response.body = {
            message: e.message
        };
    }
});

router.post('/register-user', async ({ request, response }) => {
    const reqBody = await request.body().value;

    try {
        const { userId, email } = parseRequestBody(reqBody);
        const dataResponse = await inserUserInDB(userId, email);

        response.status = dataResponse.status;
        response.body = {
            success: true
        };
    } catch (e) {
        response.status = Status.BadRequest;
        response.body = {
            message: e.message
        };
    }
});

export default router;


function parseRequestBody(reqBody: any) {
    const { email } = reqBody.input;
    const userId = reqBody.session_variables["x-hasura-user-id"];

    return {
        email,
        userId
    };
}

async function inserUserInDB(userId: string, email: string) {
    const url = Deno.env.get(HASURA_URL)!;
    const adminSecret = Deno.env.get(HASURA_ADMIN_SECRET)!;

    const query = `#graphql
        mutation ($id: String!, $email: String!) {
            insert_users_one(object: {email: $email, id: $id}, on_conflict: {constraint: users_pkey}) {
                id
            }
        }
    `;
    const variables = { id: userId, email };

    return await fetch(url, {
        method: 'POST',
        headers: {
            "content-tupe": "application/json",
            "x-hasura-admin-secret": adminSecret
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
}
