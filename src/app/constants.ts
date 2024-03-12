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
  { id: 0, title: "Знакомство" },
  { id: 1, title: "Информация" },
  { id: 3, title: "Задание" },
  { id: 4, title: "Заключение" },
];
