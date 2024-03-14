"use server";

import { customAlphabet } from 'nanoid';
import { z } from "zod";
import { completion } from "zod-gpt";
import { env } from "~/env";
import { kv } from '~/lib/kv';
import { openai } from "~/lib/openai";
import { mq } from "~/lib/qstash";
import { action } from "~/lib/safe-action";

export const createDraft = action(z.object({
    title: z.string(),
    goals: z.string(),
    notes: z.string().optional()
}), async ({ goals, notes, title }) => {

    console.log(goals)

    const response = await completion(
        openai,
        `Generate a 4-7 short steps on how to: ${goals}`,
        {
            schema: z.object({
                plan: z.array(
                    z.object({
                        title: z.string().describe("Short title of this step"),
                    }),
                ),
            }),
        },
    );
    console.log(response)

    return response.data.plan
});

export const startEngine = action(z.object({
    blocks: z.array(z.string()),
}), async ({ blocks }) => {

    const nanoid = customAlphabet('1234567890abcdef', 10)

    const lessonId = nanoid()
    const data = blocks.reduce((acc, block) => ({ ...acc, [nanoid()]: { title: block, content: null } }), {})

    for (let [id, block] of Object.entries<{ title: string }>(data)) {
        await mq.publishJSON({
            url: `${env.NEXTAUTH_URL}/api/blocks`,
            body: { title: block.title, id, lessonId },
        })
    }

    await kv.json.set(`lesson-${lessonId}`, "$", data)

    return lessonId
});