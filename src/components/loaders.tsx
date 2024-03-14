
import { cn } from "~/lib/utils"


export const Spinner = () => {
    return <>
        <div className="relative w-[54px] h-[54px] rounded-[10px] loader scale-50">
            <div className="bar1 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar2 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar3 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar4 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar5 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar6 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar7 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar8 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar9 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar10 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar11 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
            <div className="bar12 w-[8%] h-[24%] bg-neutral-500 absolute left-1/2 top-1/3 opacity-0 rounded-[50px]"></div>
        </div></>
}

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-neutral-200", className)}
            {...props}
        />
    )
}
