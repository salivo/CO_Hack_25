"use client";

import React, { useState } from "react";

export default function SwitchNowFuture({ onChange }) {
  const [active, setActive] = useState("now");

  const handleClick = (value) => {
    setActive(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex bg-neutral-800 rounded-xl p-1 w-56 select-none">
      <button
        onClick={() => handleClick("future")}
        className={`
          flex-1 py-2 text-center rounded-lg transition-all
          ${active === "future" ? "bg-blue-500 text-white shadow" : "text-gray-300 hover:bg-neutral-700"}
        `}
      >
        Ted
      </button>
      <button
        onClick={() => handleClick("now")}
        className={`
          flex-1 py-2 text-center rounded-lg transition-all
          ${active === "now" ? "bg-blue-500 text-white shadow" : "text-gray-300 hover:bg-neutral-700"}
        `}
      >
        Za Rok
      </button>
    </div>
  );
}
