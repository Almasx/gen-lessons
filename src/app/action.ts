"use server";

import { customAlphabet } from "nanoid";
import { z } from "zod";
import { completion } from "zod-gpt";
import { env } from "~/env";
import { kv } from "~/lib/kv";
import { openai } from "~/lib/openai";
import { mq } from "~/lib/qstash";
import { action } from "~/lib/safe-action";

export const createDraft = action(
  z.object({
    title: z.string(),
    goals: z.string(),
    notes: z.string().optional(),
  }),
  async ({ goals, notes, title }) => {
    const response = await completion(
      openai,
      `Generate a 4-7 short steps on ${title} based on these objectives: ${goals} and provide approximate time to complete these steps. You must create such steps that require only 5-15 minutes, and in total should consist of 40 minutes. Notes: '${notes}'`,
      {
        schema: z.object({
          plan: z.array(
            z.object({
              title: z.string().describe("Short title of this step"),
              timeframe: z
                .number()
                .describe(
                  "Approximate time which requires to complete this step in classroom in minutes.",
                ),
            }),
          ),
        }),
      },
    );

    return response.data.plan;
  },
);

export const startEngine = action(
  z.object({
    blocks: z.array(
      z.object({
        title: z.string(),
        timeframe: z.number(),
      }),
    ),
  }),

  async ({ blocks }) => {
    const nanoid = customAlphabet("1234567890abcdef", 10);

    const lessonId = nanoid();
    const data = blocks.reduce(
      (acc, block) => ({
        ...acc,
        [nanoid()]: {
          title: block.title,
          timeframe: block.timeframe,
          content: null,
        },
      }),
      {},
    );

    for (const [id, block] of Object.entries<{
      title: string;
      timeframe: number;
    }>(data)) {
      await mq.publishJSON({
        url: `${env.NEXTAUTH_URL}/api/blocks`,
        body: { title: block.title, timeframe: block.timeframe, id, lessonId },
      });
    }

    await kv.json.set(`lesson-${lessonId}`, "$", data);

    return lessonId;
  },
);
