"use client";

import Image from "next/image";
import React from "react";

export default function FutureViewer({
  zoom = 1,
  speed_koef = 1,
  src = "/matematika.jpg",
  size = 128,
  radius = 250,
  spinDuration = 12,
  orbitDuration = 6,
  clockwise = true,
}) {
  const spinDirection = clockwise ? "normal" : "reverse";
  const orbitDirection = clockwise ? "normal" : "reverse";

  // масштабируем параметры планеты
  const scaledSize = size * zoom;
  const scaledRadius = radius * zoom;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {/* Контейнер-ось орбиты (0x0) — он вращает вложенный элемент */}
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          // задаём анимацию орбиты на этот контейнер
          animation: `orbit ${orbitDuration * speed_koef}s linear infinite`,
          animationDirection: orbitDirection,
          transformOrigin: "center center", // важно — вращение вокруг центра контейнера
          willChange: "transform",
        }}
      >
        {/* Сам элемент, смещённый вправо — при вращении будет ходить по кругу */}
        <div
          style={{
            position: "absolute",
            top: -scaledSize / 2,
            left: scaledRadius - scaledSize / 2,
            width: scaledSize,
            height: scaledSize,
            animation: `spin ${spinDuration * speed_koef}s linear infinite`,
            animationDirection: spinDirection,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <Image
            src={src}
            alt="planet"
            fill
            draggable={false}
            sizes={`${Math.round(scaledSize)}px`}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* keyframes — обязательно включаем тут */}
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
