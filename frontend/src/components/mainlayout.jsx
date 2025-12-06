"use client";
import React from "react";

export default function MainLayout() {
  return (
    <div className="w-full h-screen flex flex-row">
      <div className="flex-1 bg-[#0a0a0a] text-white flex items-center justify-center text-3xl"></div>

      <div className="w-1/3 flex flex-col space-y-6 p-4 relative">
        <div className="bg-gray-800/30 backdrop-blur-md border border-black flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-white text-xl font-semibold">Text</div>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-[#97b797] text-black text-sm rounded-full flex items-center justify-center">
                  Mathematics
                </span>
              </div>
            </div>
            <div className="text-gray-200 text-sm mt-2">
              Title: Introduction to Mathematics Concepts
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-6 py-3 bg-[#2f6f6f] text-black text-lg font-bold rounded hover:bg-[#3f7f7f] transition-colors duration-300">
              start
            </button>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-md border border-black flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-white text-xl font-semibold">Video</div>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-[#97b797] text-black text-sm rounded-full flex items-center justify-center">
                  Mechanics
                </span>
              </div>
            </div>
            <div className="text-gray-200 text-sm mt-2">
              Title: Video Guide on Mechanics Principles
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-6 py-3 bg-[#2f6f6f] text-black text-lg font-bold rounded hover:bg-[#3f7f7f] transition-colors duration-300">
              start
            </button>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-md border border-black flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-white text-xl font-semibold">Test</div>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-[#97b797] text-black text-sm rounded-full flex items-center justify-center">
                  Electrical Engineering
                </span>
              </div>
            </div>
            <div className="text-gray-200 text-sm mt-2">
              Title: Electrical Engineering Knowledge Test
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-6 py-3 bg-[#2f6f6f] text-black text-lg font-bold rounded hover:bg-[#3f7f7f] transition-colors duration-300">
              start
            </button>
          </div>
        </div>

        <button className="absolute bottom-4 right-4 px-6 py-3 bg-[#2f6f6f] text-black text-lg font-bold rounded hover:bg-[#3f7f7f] transition-colors duration-300">
          Next
        </button>
      </div>
    </div>
  );
}
