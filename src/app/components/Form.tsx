import cn from "classnames";

import type { IconType } from "react-icons";
import type { IField } from "~/schemas";

import type {
  FieldErrors,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

type FormProps = {
  fieldInfo: {
    title: string;
    type: string;
    placeholder: string;
    name: keyof IField;
  }[];
  errors: FieldErrors<IField>;
  register: UseFormRegister<IField>;
  handleSubmit: UseFormHandleSubmit<IField>;
  onSubmit: SubmitHandler<IField>;
  onError: SubmitErrorHandler<IField>;
  Icon: IconType;
};

export const Form = ({
  fieldInfo,
  errors,
  register,
  onSubmit,
  onError,
  handleSubmit,
  Icon,
}: FormProps) => {
  return (
    <div className="flex w-1/3 flex-col rounded-[15px] bg-[#ffdfcc] px-5 py-8">
      <form
        className="flex flex-col justify-between gap-5"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        {fieldInfo.map((fd) => {
          const isMessageField = fd?.type === "message";

          const className = cn("rounded bg-white text-black opacity-100", {
            "p-4": fd?.type === "message",
            "p-5": fd?.type === "text",
          });

          return (
            <div className="flex flex-col gap-[12px]" key={fd?.title}>
              <p className="font-[18px] text-[#A3A3A3]">{fd?.title}</p>
              {isMessageField ? (
                <>
                  <textarea
                    {...register(fd?.name)}
                    className={className}
                    placeholder={fd?.placeholder}
                  />

                  {errors[fd?.name]?.message && (
                    <p className="text-red-500">{errors[fd?.name]?.message}</p>
                  )}
                </>
              ) : (
                <>
                  <input
                    {...register(fd?.name)}
                    className={className}
                    placeholder={fd.placeholder}
                  />

                  {errors[fd?.name]?.message && (
                    <p className="text-red-500">{errors[fd.name]?.message}</p>
                  )}
                </>
              )}
            </div>
          );
        })}

        <button className="flex w-full flex-row items-center justify-center gap-4 rounded-[8px] bg-black py-[17px] text-white">
          <p className="text-[20px]">Ракетостроение</p>
          <Icon />
        </button>
      </form>
    </div>
  );
};
