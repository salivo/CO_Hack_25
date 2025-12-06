"use client";

import React from "react";

export default function Character() {
  return (
    <div
      className="relative"
      style={{
        width: "130px",
        height: "230px",
        backgroundImage: "url('/character.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    ></div>
  );
}
