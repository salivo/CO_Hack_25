"use client";

import Image from "next/image";
import React from "react";

const TEXT_COLOR = "#678666";
const PROGRESS_COLOR = "#1f3f4f";
const GOLD_COLOR = "#D4AF37";

export default function PlanetViewer({
  zoom = 1,
  speed_koef = 1,
  percentage = 0, // <--- процент прогресса
  src = "/neactive.jpg",
  size = 128,
  radius = 250,
  spinDuration = 12,
  orbitDuration = 6,
  clockwise = true,
  explored = false,
  text_color = TEXT_COLOR,
  is_player = false,
}) {
  const spinDirection = clockwise ? "normal" : "reverse";
  const orbitDirection = clockwise ? "normal" : "reverse";

  // масштабируем планету и орбиту
  const scaledSize = size * zoom;
  const scaledRadius = radius * zoom;

  // ====== параметры прогресс кольца ======
  const ringSize = scaledSize * 1.7; // размер кольца вокруг планеты
  const r = ringSize * 0.42; // радиус круга
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (percentage / 100) * circumference;

  // const text_color = "#678666";
  const PROGRESS_COLOR = "#1f3f4f";
  const GOLD_COLOR = "#D4AF37";

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {/* Контейнер-ось орбиты */}
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          animation: `orbit ${orbitDuration * speed_koef}s linear infinite`,
          animationDirection: orbitDirection,
          transformOrigin: "center center",
        }}
      >
        {/* Контейнер планеты (внутри будет SVG и сама планета) */}
        <div
          style={{
            position: "absolute",
            top: -ringSize / 2,
            left: scaledRadius - ringSize / 2,
            width: ringSize,
            height: ringSize,
            animation: `spin ${spinDuration * speed_koef}s linear infinite`,
            animationDirection: spinDirection,
            transformOrigin: "center center",
          }}
        >
          {!is_player && (
            <span
              className="text-2xl font-bold mb-4"
              style={{
                color: text_color,
                textAlign: "center",
                display: "block",
                transform: "translateY(-25px)",
              }}
            >
              {percentage}%
            </span>
          )}
          {/* SVG progress ring */}
          {!is_player && (
            <svg
              className="absolute top-0 left-0"
              width={ringSize}
              height={ringSize}
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                stroke="#ffffff22"
                strokeWidth="6"
                fill="transparent"
                r={r}
                cx={ringSize / 2}
                cy={ringSize / 2}
              />

              <circle
                stroke={text_color}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                r={r}
                cx={ringSize / 2}
                cy={ringSize / 2}
                style={{
                  transition: "stroke-dashoffset 0.2s ease",
                }}
              />
            </svg>
          )}

          {/* Планета в центре кольца */}
          <div
            className="absolute"
            style={{
              width: scaledSize,
              height: scaledSize,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={src}
              alt="planet"
              fill
              draggable={false}
              sizes={`${Math.round(scaledSize)}px`}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
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
