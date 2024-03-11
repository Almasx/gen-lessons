import Image from "next/image";
import Link from "next/link";

export const NavBar = () => {
  return (
    <nav
      className="bg-primary-400/70 fixed inset-x-4 top-6 z-20 flex h-16 place-items-center
             justify-between rounded-xl px-3 text-sm backdrop-blur-sm md:px-8 md:text-base lg:inset-x-auto lg:mx-auto lg:w-[1024px]"
    >
      <a href="/" className="flex items-center gap-3">
        <Image src="/favicon.svg" alt="logo" width={24} height={18} />
        <span className="hidden text-xl font-bold uppercase md:block">
          Space Rocks
        </span>
      </a>

      <div className="flex items-center justify-end gap-3 justify-self-end">
        <ul className="flex gap-4">
          {Object.entries(["О конкурсе", "Контакты"]).map(([lang, label]) => (
            <Link href={"nowhere"} key={label}>
              {label}
            </Link>
          ))}
        </ul>
      </div>
    </nav>
  );
};
