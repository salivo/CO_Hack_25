"use client";

import React, { useState, useCallback } from "react";
import PlanetViewer from "./planet_viever";
import StarBackground from "./star_bg";
import Modal from "./ui/modal"; // ← добавил импорт модалки

const GOLD_COLOR = "#D4AF37";

// твои изображения
const player = "/astronaut.jpg";
const explored_star = "/login.jpg";
const unexplored_planet = "/noactive.jpg";
const matematika_planet = "/matematika.jpg";
const elektrotechnika_planet = "/elektrotechnika.jpg";
const mechanika_planet = "/mechanika.jpg";

// список объектов
const objects = [
  {
    explored: true,
    size: 100,
    radius: 440,
    speed_koef: 7,
    src: matematika_planet,
    percentage: 68,
    ui_text: "Матеша",
  },
  {
    explored: false,
    size: 100,
    radius: 250,
    speed_koef: 5,
    src: elektrotechnika_planet,
    percentage: 100,
    ui_text: "Электро",
  },
  {
    explored: true,
    size: 100,
    radius: 620,
    speed_koef: 10,
    src: mechanika_planet,
    ui_text: "Мехи",
  },
  {
    explored: false,
    size: 200,
    radius: 0,
    speed_koef: 200,
    src: player,
    is_player: true,
    ui_text: "Главный немощ",
  },
];

export default function PlanetSpace() {
  const [zoom, setZoom] = useState(1);

  // 🔥 добавил состояния модалки
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((prev) => {
      let next = prev - e.deltaY * 0.0015;
      return Math.min(Math.max(next, 0.3), 1.5);
    });
  }, []);

  return (
    <div
      className="relative h-full w-full bg-black overflow-hidden"
      onWheel={handleWheel}
    >
      <StarBackground count={300} />

      {objects.map((p, index) => (
        <PlanetViewer
          key={index}
          zoom={zoom}
          {...p}
          src={p.radius === 0 ? player : p.explored ? p.src : unexplored_planet}
          text_color={p.percentage >= 100 ? GOLD_COLOR : p.text_color}
          // 🔥 вот здесь я подключил открытие окна
          onOpen={(text) => {
            setModalText(text);
            setModalOpen(true);
          }}
        />
      ))}

      {/* 🔥 здесь появляется окно */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="text-white text-xl whitespace-pre-wrap">
          {modalText}
        </div>
      </Modal>
    </div>
  );
}
