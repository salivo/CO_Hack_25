"use client";

import Image from "next/image";
import React, { useState } from "react";
import Modal from "./ui/modal";

export default function FutureViewer({
  zoom = 1,
  speed_koef = 1,
  src = "/matematika.jpg",
  size = 128,
  radius = 250,
  spinDuration = 12,
  orbitDuration = 6,
  clockwise = true,
  explored = false,
  is_player = false, // ← важно
  onOpen,
  ui_text = String,
}) {
  const spinDirection = clockwise ? "normal" : "reverse";
  const orbitDirection = clockwise ? "normal" : "reverse";
  const [open, setOpen] = useState(false);

  // масштабируем размер
  const scaledSize = size * zoom;

  const heightMultiplier = is_player ? 1.4 : 1;

  const finalWidth = scaledSize; // ширина без изменений
  const finalHeight = scaledSize * heightMultiplier; // увеличенная высота

  // масштабируем орбиту
  const scaledRadius = radius * zoom;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      onClick={() => onOpen(ui_text)}
    >
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          animation: `orbit ${orbitDuration * speed_koef}s linear infinite`,
          animationDirection: orbitDirection,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* Контейнер, который движется по орбите */}
        <div
          onClick={() => {
            console.log("Star clicked");
            onOpen();
          }}
          style={{
            position: "absolute",
            top: -finalHeight / 2,
            left: scaledRadius - finalWidth / 2,
            width: finalWidth,
            height: finalHeight,
            animation: `spin ${spinDuration * speed_koef}s linear infinite`,
            animationDirection: spinDirection,
            transformOrigin: "center center",
            willChange: "transform",
            // border: "2px solid red",
          }}
        >
          <Image
            src={src}
            alt="planet"
            fill
            draggable={false}
            sizes={`${Math.round(finalWidth)}px`}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin {
          from { transform: rotate(360deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
