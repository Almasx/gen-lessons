import { OpenAIChatApi } from "llm-api";
import { env } from "~/env";

export const openai = new OpenAIChatApi({ apiKey: env.OPENAI_API_KEY }, { model: "gpt-3.5-turbo-0125" });