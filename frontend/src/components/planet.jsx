"use client";
import React from "react";

const TEXT_COLOR = "#678666";
const PROGRESS_COLOR = "#1f3f4f";

const Planet = ({ percentage = 0, image }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 relative">
      <span className="text-2xl font-bold mb-4" style={{ color: TEXT_COLOR }}>
        {percentage}%
      </span>

      <div className="relative w-48 h-48">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            className="text-gray-700 opacity-30"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />

          <circle
            className="text-[#678666]"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
        </svg>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full object-cover"
            style={{
              backgroundColor: PROGRESS_COLOR,
              backgroundImage: `url('${image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Planet;
