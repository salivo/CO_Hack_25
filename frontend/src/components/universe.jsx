"use client";

import React, { useState, useCallback, useEffect } from "react";
import FutureViewer from "./future_viever";
import Modal from "./ui/modal";
import StarBackground from "./star_bg";
import SwitchNowFuture from "./risebutton";

const step = 10;
const min_ring = 300;
const max_ring = 600;

const planets = [
  {
    size: 200,
    radius: 440,
    speed_koef: 9,
    src: "/matematika.jpg",
    ui_text: "Ти не зміг(((",
  },
  {
    size: 200,
    radius: 200,
    speed_koef: 7.5,
    src: "/matematika.jpg",
    ui_text: "Ти зміг!!!",
  },
  {
    size: 200,
    radius: 600,
    speed_koef: 6.3,
    src: "/matematika.jpg",
    ui_text: "На вас оформлен кредит!",
  },
  {
    size: 150,
    radius: 0,
    speed_koef: 2000000,
    src: "/mechanika.jpg",
    is_player: true,
    ui_text: "Немощь - это ты",
  },
];

const player = "/astronaut.jpg";
const explored_star = "/explored_star.jpg";
const unexplored_star = "/unexplored_star2.jpg";

export default function Universe() {
  const [zoom, setZoom] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  // 🔥 Управляемым делаем radius
  const [ringRadius, setRingRadius] = useState(400);

  // Какая кнопка активна
  const [mode, setMode] = useState("now");

  // 🔥 Анимация роста/сжатия кольца
  useEffect(() => {
    const id = setInterval(() => {
      setRingRadius((r) => {
        if (mode === "now") {
          // увеличиваем до max_ring
          if (r < max_ring) return Math.min(r + step, max_ring);
          return r;
        } else {
          // уменьшаем до min_ring
          if (r > min_ring) return Math.max(r - step, min_ring);
          return r;
        }
      });
    }, 30); // скорость анимации (мс)

    return () => clearInterval(id);
  }, [mode]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((prev) => {
      let next = prev - e.deltaY * 0.0015;
      return Math.min(Math.max(next, 0.3), 1.5);
    });
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-black overflow-hidden"
      onWheel={handleWheel}
    >
      <StarBackground count={300} />

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
          onOpen={(text) => {
            setModalText(text);
            setModalOpen(true);
          }}
        />
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="text-white text-xl whitespace-pre-wrap">
          {modalText}
        </div>
      </Modal>

      {/* Центрируем переключатель */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <SwitchNowFuture
          onChange={(value) => {
            setMode(value);
          }}
        />
      </div>
    </div>
  );
}

function Ring({
  radius,
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
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${ringThickness}px solid ${color}`,
        backgroundColor: fillColor,
        opacity,
        boxSizing: "border-box",
      }}
    />
  );
}
