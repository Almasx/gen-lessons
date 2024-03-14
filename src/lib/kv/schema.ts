import { z } from "zod";

const block = z.object({ title: z.string(), content: z.string().optional(), timeframe: z.string(), id: z.string() })

export const lesson = z.record(block)

export type Lesson = z.infer<typeof lesson>
export type Block = z.infer<typeof block>