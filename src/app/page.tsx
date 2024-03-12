"use client";

import { NavBar } from "./components/NavBar";

import { lessonInfo } from "./constants";

import { useForm } from "react-hook-form";
import { lessonSchema } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./components/Form";

import type { IField } from "~/schemas";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { PopulateContentBar } from "./components/PopulateContentBar";

interface ApiResponse {
  message: string;
}

export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IField>({
    resolver: zodResolver(lessonSchema),
  });

  const onSubmit: SubmitHandler<IField> = async (data) => {
    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json()) as ApiResponse;

    console.log(result);
  };

  const onError: SubmitErrorHandler<IField> = (data) => {
    console.error(data);
  };

  return (
    <main className="checkerboard-bg relative flex min-h-screen w-full justify-center gap-6 bg-primary-400 font-aeonik text-white">
      <NavBar />

      <div className="flex w-full items-center justify-center">
        <div className="flex w-[90%] flex-col-reverse gap-6 md:flex-row lg:w-[1024px]">
          <div className="flex flex-col rounded-[15px] bg-[#ffdfcc] px-5 py-8 md:w-1/3">
            <Form
              fieldInfo={lessonInfo}
              errors={errors}
              buttonText={"Сгенерировать план урока"}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              onError={onError}
              register={register}
            />
          </div>

          <PopulateContentBar />
        </div>
      </div>
    </main>
  );
}
