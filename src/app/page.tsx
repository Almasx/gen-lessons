import Link from "next/link"
import { kv } from "~/lib/kv"
import { Lesson } from "~/lib/kv/schema"



export default async function HomePage() {

  const [newCursor, keys] = await kv.scan(0, { match: `lesson-*` })
  if (!keys.length) {
    return (<div className="flex justify-center items-center h-96 flex-col gap-4">
      <h1 className="text-2xl text-primary-700">No Lessons yet...</h1>
      <Link className="rounded-xl bg-white text-primary-500 px-4 py-2" href={'draft'}>Create one</Link>
    </div>)
  }

  const p = kv.pipeline()
  for (let lessonKey of keys) {
    p.json.get(lessonKey)
  }
  const lessons = (await p.exec<Lesson[]>()).map((lesson, index) => ({ ...lesson, id: keys[index]?.split('-').at(-1) }))
  console.log(lessons)
  return (<div className="grid grid-cols-3 gap-5">
    {lessons.map((lesson) => (
      <a
        className="bg-white rounded-xl p-3 flex flex-col gap-3"
        href={`/lesson/${lesson.id}`}
        key={`/lesson/${lesson.id}`}
      >
        <div className="bg-secondary rounded px-1.5 py-0.5 relative overflow-clip ">

          <svg className="absolute h-full top-0" viewBox="0 0 304 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M175 54.2297L-42.9996 -44.7703L328.796 44.184" stroke="#006356" stroke-width="20" />
          </svg>
          <span className="relative">LOOL</span>

        </div>

        <header className="text-2xl text-black ">
          {" "}
        </header>
        <p className="lg:leading-relaxed text-neutral-500  text-ellipsis  lg:line-clamp-none line-clamp-3 ">
          "bruh"
        </p>
        <span className="text-sm  text-neutral-500  lg:mt-5 ">
          <span className="font-bold">
            40
          </span>{" "}
          mins
        </span>
      </a>
    ))}
  </div>)
}
