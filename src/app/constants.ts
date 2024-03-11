import type { IField } from "~/schemas";

export const lessonInfo: {
  title: string;
  type: string;
  placeholder: string;
  name: keyof IField;
}[] = [
  {
    title: "Тема",
    type: "text",
    placeholder: "Напишите тему урока",
    name: "title",
  },
  {
    title: "Цели",
    type: "text",
    placeholder: "Напишите цели урока",
    name: "goals",
  },
  {
    title: "Дополнительные комментарии",
    type: "message",
    placeholder: "Ваши рекомендации",
    name: "additional_notes",
  },
];

export const contentBarInfo = [
  {
    number: 1,
    title: "Знакомство",
  },
  {
    number: 2,
    title: "Знакомство",
  },
  {
    number: 3,
    title: "Знакомство",
  },
  {
    number: 4,
    title: "Знакомство",
  },
];
