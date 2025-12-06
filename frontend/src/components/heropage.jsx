"use client";
import React, { useEffect, useState } from "react";
import Character from "./character";
import Skat from "./skat";
import { useRouter } from "next/navigation";

const HEADING_TEXT = "Your journey to knowledge begins here.";
const SUBHEADING_TEXT = "Master new skills with our interactive platform.";

const TEXT_COLOR = "#678666";

const splitText = (text) => {
  return text.split("").map((char, index) => (
    <span
      key={index}
      className="char inline-block"
      style={{
        animation: "softBounce 0.6s ease-out forwards",
        animationDelay: `${index * 0.04}s`,
        color: char === " " ? "transparent" : "inherit",
        display: "inline-block",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

export default function AnimatedHero() {
  const router = useRouter();
  const handleRegister = () => router.push("/register");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const courses = [
    {
      title: "Mathematics",
      description:
        "Dive into algebra, geometry, and calculus to sharpen your analytical skills.",
    },
    {
      title: "Mechanics",
      description:
        "Explore motion, forces, and energy with hands-on mechanical principles.",
    },
    {
      title: "Electrical Engineering",
      description:
        "Learn circuits, signals, and systems to power the world of electronics.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 pt-20 max-w-5xl mx-auto relative">
      <div
        className={`absolute right-[-30%] top-2/3 transform -translate-y-1/2 ${
          isMounted ? "opacity-100 animate-fly-right" : "opacity-0"
        }`}
      >
        <Character />
      </div>

      <div
        className={`absolute left-[-30%] top-3/4 transform -translate-y-1/2 ${
          isMounted ? "opacity-100 animate-fly-left" : "opacity-0"
        }`}
      >
        <Skat />
      </div>

      <h1
        className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ color: TEXT_COLOR }}
      >
        {splitText(HEADING_TEXT)}
      </h1>

      <p
        className={`text-lg md:text-xl mb-12 transition-all duration-1000 delay-500 ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ color: "#97b797" }}
      >
        {SUBHEADING_TEXT}
      </p>

      <button
        className={`
          py-4 px-10 rounded-full font-bold uppercase tracking-widest text-lg transition-all duration-1000 delay-[1000ms]
          bg-[#2f6f6f] text-[#0a0a0a] shadow-xl hover:bg-[#2f6f6f]/80 cursor-pointer
          ${isMounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
        onClick={handleRegister}
      >
        Start Learning
      </button>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-[1200ms] ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="group relative bg-[#1f3f4f]/60 text-white rounded-xl p-8 shadow-lg border border-[#2f6f6f]/70 cursor-pointer transform transition-all duration-500 hover:-translate-y-4 hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-4">{course.title}</h3>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {course.description}
            </p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes softBounce {
          0% {
            opacity: 0;
            transform: translateY(40%);
          }
          60% {
            opacity: 1;
            transform: translateY(-6%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes flyRight {
          0% {
            transform: translateX(100%) translateY(-50%) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: translateX(-10%) translateY(-55%) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: translateX(0) translateY(-50%) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes floatRight {
          0% {
            transform: translateY(-50%) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-52%) translateX(8px) rotate(3deg);
          }
          100% {
            transform: translateY(-50%) translateX(0) rotate(0deg);
          }
        }

        @keyframes flyLeft {
          0% {
            transform: translateX(-100%) translateY(-50%) rotate(10deg);
            opacity: 0;
          }
          50% {
            transform: translateX(10%) translateY(-55%) rotate(-5deg);
            opacity: 1;
          }
          100% {
            transform: translateX(0) translateY(-50%) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes floatLeft {
          0% {
            transform: translateY(-50%) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-52%) translateX(-8px) rotate(-3deg);
          }
          100% {
            transform: translateY(-50%) translateX(0) rotate(0deg);
          }
        }

        .animate-fly-right {
          animation:
            flyRight 2s ease-out forwards,
            floatRight 5s ease-in-out infinite;
        }

        .animate-fly-left {
          animation:
            flyLeft 2s ease-out forwards,
            floatLeft 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
