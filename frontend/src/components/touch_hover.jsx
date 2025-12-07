"use client";
import { useState } from "react";

export default function TouchHover({ children }) {
  const [hover, setHover] = useState(false);

  const handleTouch = () => {
    setHover((prev) => !prev);
  };

  return (
    <div onTouchStart={handleTouch} className={hover ? "touch-hover" : ""}>
      {children}
    </div>
  );
}
