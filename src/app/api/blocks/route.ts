import { TypedNextResponse, route, routeOperation } from "next-rest-framework";
import { z } from "zod";
import { completion } from "zod-gpt";
import { kv } from "~/lib/kv";
import { openai } from "~/lib/openai";

export const { POST } = route({
  process: routeOperation({
    method: "POST",
  })
    .input({
      contentType: "application/json",
      body: z.object({
        title: z.string(),
        timeframe: z.number(),
        lessonId: z.string(),
        id: z.string(),
      }),
    })
    .outputs([
      {
        status: 201,
        contentType: "application/json",
        schema: z.string(),
      },
      {
        status: 401,
        contentType: "application/json",
        schema: z.string(),
      },
    ])
    .handler(async (req) => {
      const { title, timeframe, lessonId, id } = await req.json();

      const response = await completion(
        openai,
        `Content based on this heading: '${title}'. To do this heading user has '${timeframe}'`,
        {
          schema: z.object({
            content: z.string().describe(`Content, 2-4 sentences`),
          }),
        },
      );

      await kv.json.set(
        `lesson-${lessonId}`,
        `$.${id}.content`,
        JSON.stringify(response.data.content),
      );

      return TypedNextResponse.json(response.data.content, {
        status: 201,
      });
    }),
});
