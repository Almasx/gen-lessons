"use client";

import { NavBar } from "./components/NavBar";

import { lessonInfo, contentBarInfo } from "./constants";

import { FiChevronDown } from "react-icons/fi";
import { useForm } from "react-hook-form";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { lessonSchema } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./components/Form";

import type { IField } from "~/schemas";

export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IField>({
    resolver: zodResolver(lessonSchema),
  });

  const onSubmit: SubmitHandler<IField> = (data) => {
    console.log(data);
  };

  const onError: SubmitErrorHandler<IField> = (data) => {
    console.log(data);
  };

  return (
    <main className="checkerboard-bg relative flex min-h-screen w-full justify-center gap-6 bg-primary-400 font-aeonik text-white">
      <NavBar />

      <div className="flex w-full items-center justify-center">
        <div className="flex flex-row gap-6 lg:w-[1024px]">
          <Form
            fieldInfo={lessonInfo}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onError={onError}
            register={register}
            Icon={FiChevronDown}
            errors={errors}
          />

          <div className="flex w-2/3 flex-col gap-4 rounded-[15px] bg-[#ffdfcc] px-6 py-[30px]">
            {contentBarInfo.map((cont) => {
              return (
                <div className="flex flex-row gap-[14px]" key={cont.number}>
                  <div className="flex h-[51px] w-[51px] items-center justify-center rounded-[15px] bg-[#FF6F16] text-[38px]">
                    {cont.number}
                  </div>
                  <p className="flex flex-1 items-center rounded-[15px] bg-white px-6 py-4 font-[24px] text-black">
                    {cont.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
