"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Reorder } from "framer-motion";
import { useState } from "react";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { FiPlus, FiX } from "react-icons/fi";
import { createDraft, startEngine } from "~/app/action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/form";
import { Input } from "~/components/input";
import { Spinner } from "~/components/loaders";
import { Textarea } from "~/components/text-area";

const lessonSchema = z.object({
  title: z.string().min(1, "Напишите тему урока"),
  goals: z.string().min(1, "Напишите цели урока"),
  notes: z.string().optional(),
});

type LessonSchema = z.infer<typeof lessonSchema>;

export default function HomePage() {
  const router = useRouter();
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const { execute: draft, result, status } = useAction(createDraft);
  const { execute: start, status: engineStatus } = useAction(startEngine, {
    onSuccess: (data) => {
      router.push(`/lesson/${data}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  console.log(result);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-[90%] flex-col-reverse gap-6 md:flex-row lg:w-full">
        <Form {...form}>
          <form
            className="mb-auto flex flex-col justify-between gap-5 rounded-xl bg-white/80 p-3 pt-8 backdrop-blur-md md:w-1/3 md:p-5"
            onSubmit={form.handleSubmit((data) => draft(data))}
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
                      className="rounded-xl border-neutral-300 bg-white  p-6 text-black placeholder:text-neutral-400"
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
                    <Textarea
                      rows={2}
                      placeholder="Цели урока"
                      className="rounded-xl border-neutral-300 bg-white  p-6 text-black  placeholder:text-neutral-400"
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
                  <FormLabel className=" text-neutral-400">
                    Дополнительные комментарий
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Дополнительные комментарий"
                      className="rounded-xl border-neutral-300 bg-white  p-6 text-black  placeholder:text-neutral-400"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              className="flex h-14 items-center justify-center gap-3 overflow-clip rounded-xl bg-black p-3  text-white disabled:text-white/60"
              disabled={status === "executing"}
            >
              {status === "executing" && (
                <div className="-m-3">
                  <Spinner />
                </div>
              )}{" "}
              Сгенерировать план урока
            </button>
          </form>
        </Form>

        {status === "idle" && (
          <div className="grid grow place-items-center rounded-xl bg-white/80 text-xl text-neutral-400 backdrop-blur-md sm:text-2xl md:text-3xl">
            No drafts yet...
          </div>
        )}
        {status === "executing" && (
          <div className="grid grow place-items-center rounded-xl bg-white/80 text-3xl text-neutral-400 backdrop-blur-md">
            Creating draft ...
          </div>
        )}
        {status === "hasSucceeded" && <ContentPlan data={result.data!} />}
      </div>

      {status === "hasSucceeded" && (
        <button
          onClick={() => start({ blocks: result.data! })}
          className="ml-auto flex h-14 items-center justify-center gap-3 
                     overflow-clip  rounded-xl bg-white/80 p-3 text-primary-400 backdrop-blur-md disabled:text-white/60"
        >
          {engineStatus === "executing" && (
            <div className="-m-3">
              <Spinner />
            </div>
          )}{" "}
          Продожить →
        </button>
      )}
    </div>
  );
}

type Block = {
  id: number;
  title: string;
  timeframe: number;
};

const ContentPlan = ({
  data,
}: {
  data: { title: string; timeframe: number }[];
}) => {
  const [content, setContent] = useState(
    data.map((block, index) => ({ ...block, id: index })),
  );

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
        timeframe: 0,
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
    <div className="flex flex-col gap-4 rounded-xl bg-white/80 px-6 py-8 backdrop-blur-md md:w-2/3">
      <div className="flex items-center gap-4">
        <div
          className="flex aspect-square h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-primary-400 text-[38px]"
          onClick={handleAdd}
        >
          <FiPlus />
        </div>

        <Input
          placeholder="Добавить новый блок"
          className="rounded-xl border-neutral-300 bg-white  p-6 text-black  placeholder:text-neutral-400"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
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
                key={cont?.id}
              >
                <div
                  className="flex aspect-square h-12 w-12  items-center justify-center rounded-xl bg-primary-400 text-[38px]"
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

                  <div className="mr-2 rounded-2xl bg-[#019683] px-3 py-1">
                    {cont?.timeframe}
                  </div>
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
};
