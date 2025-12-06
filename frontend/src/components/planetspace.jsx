"use client";

import { useState, useRef, useEffect } from "react";
import Planet from "./planet";

export default function Planetspace() {
  const canvasRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const dragging = useRef(false);
  const prevX = useRef(0);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const onMouseDown = (e) => {
      dragging.current = true;
      prevX.current = e.clientX;
    };
    const onMouseUp = () => (dragging.current = false);
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - prevX.current;
      prevX.current = e.clientX;
      setRotation((prev) => prev + dx * 0.005);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prev) => {
      const next = prev * (e.deltaY > 0 ? 0.9 : 1.1);
      return Math.min(Math.max(next, 0.5), 3);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <div
        onWheel={handleWheel}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          transform: `scale(${scale}) rotate(${rotation}rad)`,
          transformOrigin: "center center",
          transition: "transform 80ms ease-out",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          {/* Планеты */}
          <div className="absolute" style={{ top: "10%", left: "10%" }}>
            <Planet percentage={0} image={"/noactive.jpg"} />
          </div>

          <div className="absolute" style={{ top: "20%", right: "15%" }}>
            <Planet percentage={0} image={"/noactive.jpg"} />
          </div>

          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ bottom: "10%" }}
          >
            <Planet percentage={0} image={"/noactive.jpg"} />
          </div>
        </div>
      </div>
    </div>
  );
}
