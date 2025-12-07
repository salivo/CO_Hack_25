"use client";
import "./star_bg.css";
import { useEffect } from "react";

export default function StarBackground({ count = 200 }) {
  useEffect(() => {
    const container = document.getElementById("stars");
    if (!container) return;

    // создаём звёзды
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";
      container.appendChild(star);
    }

    // анимация — без TweenMax, делаем современно через CSS
  }, [count]);

  return <div id="stars" className="pointer-events-none fixed inset-0 z-0" />;
}
