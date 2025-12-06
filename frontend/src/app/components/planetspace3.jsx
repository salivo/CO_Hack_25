"use client";
const GOLD_COLOR = "#D4AF37";

import React, { useState, useCallback } from "react";
import PlanetViewer from "./planet_viever";

// твои планеты

const player = "/login.jpg";
const explored_star = "/login.jpg";
const unexplored_planet = "/noactive.jpg";
const matematika_planet = "/matematika.jpg";
const elektrotechnika_planet = "/elektrotechnika.jpg";
const mechanika_planet = "/mechanika.jpg";

const objects = [
  {
    explored: true,
    size: 100,
    radius: 440,
    speed_koef: 1,
    src: matematika_planet,
    percentage: 69,
  },
  {
    explored: false,
    size: 100,
    radius: 200,
    speed_koef: 3,
    src: elektrotechnika_planet,
    percentage: 100,
  },
  {
    explored: true,
    size: 100,
    radius: 600,
    speed_koef: 2,
    src: mechanika_planet,
  },
  {
    explored: false,
    size: 200,
    radius: 0,
    speed_koef: 2,
    src: player,
    is_player: true,
  },
];

const ringRadius = 400;

export default function PlanetSpace() {
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
      {objects.map((p, index) => (
        <PlanetViewer
          key={index}
          zoom={zoom}
          {...p}
          src={p.radius === 0 ? player : p.explored ? p.src : unexplored_planet}
          text_color={p.percentage >= 100 ? GOLD_COLOR : p.text_color}
        />
      ))}
    </div>
  );
}
