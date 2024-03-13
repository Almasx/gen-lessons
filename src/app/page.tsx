"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';

import { Reorder } from "framer-motion";
import { useState } from "react";

import { useAction } from "next-safe-action/hooks";
import { FiPlus, FiX } from "react-icons/fi";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/form";
import { Input } from "~/components/input";
import { createDraft } from "./action";

export const lessonSchema = z.object({
  title: z.string().min(1, "Напишите тему урока"),
  goals: z.string().min(1, "Напишите цели урока"),
  notes: z.string().min(1, "Ваши рекомендации"),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export default function HomePage() {
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const { execute, result } = useAction(createDraft)

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-[90%] flex-col-reverse gap-6 md:flex-row lg:w-[1024px]">
        <Form {...form}>
          <form
            className="flex flex-col justify-between gap-5 p-5 pt-8 md:w-1/3 bg-white/80 backdrop-blur-md rounded-xl mb-auto"
            onSubmit={form.handleSubmit((data) => execute(data))}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-neutral-400">Тема</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Тема урока"
                      className="p-6 border-neutral-300 bg-white  rounded-xl placeholder:text-neutral-400"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-neutral-400">Цели</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Цели урока"
                      className="p-6 border-neutral-300 bg-white  rounded-xl placeholder:text-neutral-400"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-neutral-400">Дополнительные комментарий</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Дополнительные комментарий"
                      className="p-6 border-neutral-300 bg-white  rounded-xl placeholder:text-neutral-400"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <button className="flex items-center justify-center rounded-xl bg-black p-3  text-white">
              Сгенерировать план урока
            </button>
          </form>
        </Form>

        {result.data ? <ContentPlan data={result.data} /> : <div className="bg-white/80 rounded-xl backdrop-blur-md grow text-neutral-400 text-3xl grid place-items-center">No drafts yet...</div>}
      </div>
    </div>
  );
}

type Block = {
  id: number;
  title: string;
};


const ContentPlan = ({ data }: { data: { title: string }[] }) => {
  const [content, setContent] = useState(data.map((block, index) => ({ ...block, id: index })));

  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [newTitle, setNewTitle] = useState("");

  const handleDelete = (block: Block) => {
    setContent(() => content.filter((cn) => cn.title !== block.title));
  };

  const handleAdd = () => {
    if (newTitle.trim()) {
      const updatedContent = content.map((item) => ({
        ...item,
        id: item.id + 1,
      }));

      const newContent = {
        id: 1,
        title: newTitle,
      };

      setContent([newContent, ...updatedContent]);
      setNewTitle("");
    }
  };

  const onReorder = (newContent: Block[]) => {
    setContent(
      newContent.map((cont, index) => ({
        ...cont,
        id: index - 1,
      })),
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/80 backdrop-blur-md px-6 py-8 md:w-2/3">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 aspect-square cursor-pointer items-center justify-center rounded-xl bg-primary-400 text-[38px]"
          onClick={handleAdd}
        >
          <FiPlus />
        </div>

        <Input placeholder="Добавить новый блок" className="p-6 border-neutral-300 bg-white  rounded-xl placeholder:text-neutral-400"

          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)} />
      </div>
      <Reorder.Group
        as="ol"
        axis="y"
        values={content}
        onReorder={onReorder}
        className="flex flex-col gap-4"
      >
        {content.map((cont, index) => {
          return (
            <Reorder.Item key={index} value={cont}>
              <div
                className="flex cursor-pointer flex-row gap-4"
                key={cont.id}
              >
                <div
                  className="flex h-12 w-12 aspect-square  items-center justify-center rounded-xl bg-primary-400 text-[38px]"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  onClick={() => handleDelete(cont)}
                  key={index}
                >
                  {hoveredIndex === index ? <FiX /> : index + 1}
                </div>
                <div className="flex w-full items-center justify-between rounded-xl bg-white ">
                  <p className="flex flex-1 items-center px-6  font-[24px] text-black">
                    {cont?.title}
                  </p>
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

    </div>
  );
};
