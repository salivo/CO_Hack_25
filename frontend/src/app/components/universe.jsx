"use client";

import React, { useState, useCallback } from "react";
import FutureViewer from "./future_viever";

// твои планеты
const planets = [
  { size: 100, radius: 440, speed_koef: 1, src: "/matematika.jpg" },
  { size: 100, radius: 200, speed_koef: 3, src: "/matematika.jpg" },
  { size: 100, radius: 600, speed_koef: 2, src: "/matematika.jpg" },
  { size: 150, radius: 0, speed_koef: 2, src: "/mechanika.jpg" },
];

export default function Universe() {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((prev) => {
      let next = prev - e.deltaY * 0.0015;
      return Math.min(Math.max(next, 0.3), 3);
    });
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-black overflow-hidden"
      onWheel={handleWheel}
    >
      <Ring radius={440} thickness={3} color="cyan" opacity={4} zoom={zoom} />
      {planets.map((p, index) => (
        <FutureViewer key={index} zoom={zoom} {...p} />
      ))}
    </div>
  );
}

function Ring({
  radius = 200,
  thickness = 2,
  color = "white",
  opacity = 0.2,
  zoom = 1,
  fillColor = "rgba(255, 255, 255, 0.08)",
}) {
  const size = radius * 2 * zoom;
  const ringThickness = thickness * zoom;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${ringThickness}px solid ${color}`,
        backgroundColor: fillColor,
        opacity,
        boxSizing: "border-box",
      }}
    ></div>
  );
}
