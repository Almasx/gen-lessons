import { Client, Receiver } from "@upstash/qstash";
import { TypedNextResponse } from "next-rest-framework";
import { env } from "~/env";

export const mq = new Client({
    token: env.QSTASH_TOKEN,
});

export const receiver = new Receiver({
    currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export const verifyMQ = async (req: any) => {
    const signature = req.headers.get("Upstash-Signature");
    const body = await req.json();

    if (!signature || !body) {
        return TypedNextResponse.json(`Invalid signature`, {
            status: 403
        });
    }

    const isValid = receiver.verify({
        body: JSON.stringify(body),
        signature,
        url: "https://6598-212-13-160-225.ngrok-free.app/api/test",
    });

    if (!isValid) {
        return TypedNextResponse.json(`Invalid signature`, {
            status: 403
        });
    }

}