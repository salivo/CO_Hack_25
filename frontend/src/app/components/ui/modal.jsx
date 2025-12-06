"use client";

import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        z-9999  /* ← самый высокий уровень */
      "
      onClick={onClose}
    >
      <div
        className="
          bg-[#111] text-white
          p-6 rounded-xl shadow-xl
          min-w-[300px] max-w-[90%]
          animate-fadeIn
          cursor-pointer
        "
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
