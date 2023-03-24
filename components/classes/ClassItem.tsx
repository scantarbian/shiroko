"use client";

import { useState } from "react";

const ClassItem = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col ">
      <div
        className="flex justify-between cursor-pointer p-4 "
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span>CGRA-203</span>
        <span>Rendering</span>
        <span>15:00-17:00</span>
      </div>
      <div
        className={`transition-[padding-bottom]  ${
          open ? "flex flex-col px-4 pb-2" : "h-0 overflow-hidden"
        }`}
      >
        <span>Waghan</span>
      </div>
    </div>
  );
};

export default ClassItem;

