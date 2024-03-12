import { useState } from "react";
import { Reorder } from "framer-motion";
import { contentBarInfo } from "../constants";

import { FiPlus, FiX } from "react-icons/fi";

type IContentEl = {
  id: number;
  title: string;
};

export const PopulateContentBar = () => {
  const [content, setContent] = useState(contentBarInfo);

  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [newTitle, setNewTitle] = useState("");

  const handleDelete = (cont: IContentEl) => {
    setContent(() => content.filter((cn) => cn.title !== cont.title));
  };

  const handleAdd = () => {
    if (newTitle.trim()) {
      const updatedContent = content.map((item) => ({
        ...item,
        id: item.id + 1,
      }));

      const newContent = {
        id: 1,
        title: newTitle,
      };

      setContent([newContent, ...updatedContent]);
      setNewTitle("");
    }
  };

  const onReorder = (newContent: IContentEl[]) => {
    setContent(
      newContent.map((cont, index) => ({
        ...cont,
        id: index - 1,
      })),
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-[15px] bg-[#ffdfcc] px-6 py-[30px] md:w-2/3">
      <div className="flex flex-row items-center gap-[14px]">
        <div
          className="flex h-[51px] w-[51px] cursor-pointer items-center justify-center rounded-[15px] bg-[#FF6F16] text-[38px]"
          onClick={handleAdd}
        >
          <FiPlus />
        </div>
        <input
          className="flex flex-1 items-center rounded-[15px] bg-white px-6 py-4 font-[24px] text-black"
          type="text"
          placeholder="Добавить новый блок"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </div>
      <Reorder.Group
        as="ol"
        axis="y"
        values={content}
        onReorder={onReorder}
        className="flex flex-col gap-2"
      >
        {content.map((cont, index) => {
          return (
            <Reorder.Item key={index} value={cont}>
              <div
                className="flex cursor-pointer flex-row gap-[14px]"
                key={cont.id}
              >
                <div
                  className="flex h-[51px] w-[51px] items-center justify-center rounded-[15px] bg-[#FF6F16] text-[38px]"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  onClick={() => handleDelete(cont)}
                  key={index}
                >
                  {hoveredIndex === index ? <FiX /> : index + 1}
                </div>
                <div className="flex w-full flex-row items-center justify-between rounded-[15px] bg-white ">
                  <p className="flex flex-1 items-center px-6 py-4 font-[24px] text-black">
                    {cont?.title}
                  </p>
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      ;
    </div>
  );
};
