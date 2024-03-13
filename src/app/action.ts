"use server"; // don't forget to add this!

import { z } from "zod";
import { completion } from "zod-gpt";
import { openai } from "~/lib/openai";
import { action } from "~/lib/safe-action";

export const createDraft = action(z.object({
    title: z.string(),
    goals: z.string(),
    notes: z.string()
}), async ({ goals, notes, title }) => {

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

    return response.data.plan
});