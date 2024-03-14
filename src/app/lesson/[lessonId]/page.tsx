import { redirect } from "next/navigation";
import { kv } from "~/lib/kv";
import { LessonSlides } from "./client";
import type { Lesson } from "~/lib/kv/schema";

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lesson = await kv.json.get<Lesson>(`lesson-${params.lessonId}`);
  if (!lesson) redirect("404");
  return <LessonSlides lesson={lesson} />;
}
