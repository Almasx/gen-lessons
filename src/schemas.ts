import z from "zod";

export const lessonSchema = z.object({
  title: z.string().min(1, "Напишите тему урока"),
  goals: z.string().min(1, "Напишите цели урока"),
  additional_notes: z.string().min(1, "Ваши рекомендации"),
});

export type IField = z.infer<typeof lessonSchema>;
