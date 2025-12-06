"use client";
import React, { useState } from "react";

const ACCENT_COLOR = "#2f6f6f";
const TEXT_COLOR = "#678666";
const BG_COLOR = "#0a0a0a";

const BAR_COLOR = "#ffffff";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={toggleMenu}
        className="w-10 h-10 flex flex-col justify-around items-center focus:outline-none p-1 transition-all duration-300"
        aria-label="Toggle Menu"
      >
        <div
          className={`
          w-full h-0.5 rounded transition-all duration-300 transform
          ${isOpen ? "rotate-45 translate-y-[5px]" : ""}
        `}
          style={{ backgroundColor: BAR_COLOR }}
        ></div>

        <div
          className={`
          w-full h-0.5 rounded transition-all duration-300
          ${isOpen ? "opacity-0" : "opacity-100"}
        `}
          style={{ backgroundColor: BAR_COLOR }}
        ></div>

        <div
          className={`
          w-full h-0.5 rounded transition-all duration-300 transform
          ${isOpen ? "-rotate-45 -translate-y-[5px]" : ""}
        `}
          style={{ backgroundColor: BAR_COLOR }}
        ></div>
      </button>

      <div
        className={`
          fixed top-0 left-0 h-full w-64 shadow-2xl transition-transform duration-500 ease-in-out
          bg-[${BG_COLOR}] border-r border-[${ACCENT_COLOR}]/50 p-6
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ zIndex: 40 }}
      >
        <div className="pt-16 flex flex-col space-y-6">
          <a
            href="#"
            className={`text-xl font-semibold text-[${TEXT_COLOR}] hover:text-[${ACCENT_COLOR}] transition duration-200`}
          >
            About Us
          </a>

          <a
            href="#"
            className={`text-xl font-semibold text-[${TEXT_COLOR}] hover:text-[${ACCENT_COLOR}] transition duration-200`}
          >
            Login
          </a>

          <a
            href="#"
            className={`text-xl font-semibold text-[${TEXT_COLOR}] hover:text-[${ACCENT_COLOR}] transition duration-200`}
          >
            Register
          </a>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300"
          style={{ zIndex: 30 }}
        ></div>
      )}
    </div>
  );
}
