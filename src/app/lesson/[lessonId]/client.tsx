"use client";

import { useState } from "react";
import { Skeleton } from "~/components/loaders";
import { PusherProvider, useSubscribeToEvent } from "~/lib/context/pusher-context";
import type { Block, Lesson } from "~/lib/kv/schema";
import { cn } from "~/lib/utils";

export const LessonSlides = ({ lesson }: { lesson: Lesson }) => {
  const [currentBlock, setCurrentBlock] = useState(Object.keys(lesson)[0]!);

  return (
    <div className="flex flex-col gap-4 px-5 md:flex-row md:px-8 ">
      <div className="mx-auto mb-auto flex flex-row flex-wrap justify-center gap-2 rounded-2xl bg-white/80 p-2 backdrop-blur-md sm:gap-3 md:flex-col">
        {Object.entries(lesson).map(([id, _], index) => (
          <PusherProvider slug={`slide-${id}`}>
            <Index onClick={() => setCurrentBlock(id)} id={id} index={index} currentBlock={currentBlock} />
          </PusherProvider>
        ))}
      </div>
      <PusherProvider slug={`slide-${currentBlock}`}>
        <Slide slide={lesson[currentBlock]!} />
      </PusherProvider>

    </div>
  );
};

const Index = ({ onClick, id, index, currentBlock }: { onClick: () => void, id: string, index: number, currentBlock: string }) => {
  const [updated, setUpdated] = useState(false)

  useSubscribeToEvent('update-content', () => setUpdated(true))

  return <button
    key={id}
    onClick={onClick}
    className={cn(
      " grid aspect-square w-12 place-items-center rounded-2xl bg-white text-3xl text-neutral-300 sm:w-16 md:text-5xl",
      currentBlock === id &&
      "border-[3px] border-primary-400 text-primary-300 shadow-md shadow-primary-300/10",
      updated && "pong"
    )}
  >
    {index + 1}
  </button>
}

const Slide = ({ slide }: { slide: Block }) => {
  const [content, setContent] = useState(slide.content)
  useSubscribeToEvent<string>('update-content', (data) => setContent(data))

  return (
    <div className="grow rounded-2xl bg-white/80 p-2 backdrop-blur-md">
      <div className="relative flex min-h-[600px] flex-col gap-6 rounded-2xl bg-white p-6 py-8 text-black md:p-12 md:pt-16">
        <div className="absolute left-12 top-0 -translate-y-1/2 rounded-xl bg-secondary px-4 py-2 text-white">
          {slide.timeframe} минут
        </div>
        <h1 className="text-4xl font-bold md:text-6xl ">{slide.title}</h1>
        {content ? (
          <p className="">{content}</p>
        ) : (
          <div className="mt-12 flex flex-col gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        )}
      </div>
    </div>
  );
};
