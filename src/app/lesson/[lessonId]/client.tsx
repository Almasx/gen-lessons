'use client'

import { useState } from "react"
import { Skeleton } from "~/components/loaders"
import { Block, Lesson } from "~/lib/kv/schema"
import { cn } from "~/lib/utils"


export const LessonSlides = ({ lesson }: { lesson: Lesson }) => {
    const [currentBlock, setCurrentBlock] = useState(Object.keys(lesson)[0]!)

    return <div className="flex gap-4 ">
        <div className="bg-white/80 backdrop-blur-md mb-auto p-2 rounded-2xl gap-3 flex flex-col">
            {Object.entries(lesson).map(([id, _], index) =>
                <button key={id} onClick={() => setCurrentBlock(id)}
                    className={cn("bg-white rounded-2xl text-5xl w-16 aspect-square text-neutral-300 grid place-items-center",
                        currentBlock === id && "border-[3px] border-primary-400 text-primary-300 shadow-md shadow-primary-300/10")}>
                    {index + 1}
                </button>)}

        </div>
        <Slide slide={lesson[currentBlock]!} />
    </div>
}

const Slide = ({ slide }: { slide: Block }) => {
    return <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 grow">
        <div className="bg-white flex flex-col relative rounded-2xl p-12 pt-16 min-h-[600px] text-black">
            <div className="absolute left-12 text-white top-0 -translate-y-1/2 rounded-xl bg-secondary px-4 py-2">6-10 минуты</div>
            <h1 className="text-6xl font-bold">{slide.title}</h1>
            {slide.content ? <p className="">{slide.content}</p> : <div className="flex flex-col mt-12 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[80%]" />
            </div>}
        </div>
    </div>
}