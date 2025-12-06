"use client";

import React, { useState, useCallback } from "react";
import FutureViewer from "./future_viever";

// твои планеты
const planets = [
  { size: 200, radius: 440, speed_koef: 9, src: "/matematika.jpg" },
  { size: 200, radius: 200, speed_koef: 7.5, src: "/matematika.jpg" },
  { size: 200, radius: 600, speed_koef: 6.3, src: "/matematika.jpg" },
  {
    size: 150,
    radius: 0,
    speed_koef: 2,
    src: "/mechanika.jpg",
    is_player: true,
  },
];

const player = "/astronaut.jpg";
const explored_star = "/explored_star.jpg";
const unexplored_star = "/unexplored_star2.jpg";

const ringRadius = 400;

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
      <Ring
        radius={ringRadius}
        thickness={3}
        color="cyan"
        opacity={4}
        zoom={zoom}
      />
      {planets.map((p, index) => (
        <FutureViewer
          key={index}
          zoom={zoom}
          {...p}
          src={
            p.radius <= ringRadius
              ? p.radius == 0
                ? player
                : explored_star
              : unexplored_star
          }
        />
      ))}
    </div>
  );
}

function Ring({
  radius = ringRadius,
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
