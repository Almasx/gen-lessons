import { OpenAIChatApi } from "llm-api";

import { z } from "zod";
import { completion } from "zod-gpt";

import { NextResponse } from "next/server";

interface ApiRequest {
  goal: string;
  title: string;
  additional_notes: string;
}

export async function POST(req: Request) {
  const request = (await req.json()) as ApiRequest;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json("OPENAI_API_KEY is not configured", {
      status: 500,
    });
  }

  const openai = new OpenAIChatApi({ apiKey }, { model: "gpt-3.5-turbo-0125" });

  try {
    const response = await completion(
      openai,
      `Generate a 4-7 short steps on how to: ${request.goal}`,
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

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failed to fetch data from OpenAI", {
      status: 500,
    });
  }
}
