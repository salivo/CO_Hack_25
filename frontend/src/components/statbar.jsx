"use client";
import { motion } from "framer-motion";
import { User, Flame, Zap, Atom, Calculator } from "lucide-react";

export default function Statistic() {
  const subjects = [
    { name: "Math", progress: 75, icon: <Calculator size={16} /> },
    { name: "Physics", progress: 45, icon: <Atom size={16} /> },
    { name: "Electro", progress: 90, icon: <Zap size={16} /> },
  ];

  return (
    <div className="w-full max-w-[300px] bg-[#0B1221]/80 backdrop-blur-md border border-teal-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(20,184,166,0.1)] text-slate-200">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-teal-900 to-slate-800 border-2 border-teal-500/50 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-2">
          <User className="text-teal-400 w-8 h-8" />
          <span className="absolute bottom-1 right-1 w-3 h-3 bg-teal-400 rounded-full border border-slate-900"></span>
        </div>
        <span className="text-sm font-medium text-slate-400 tracking-wider">
          CADET
        </span>
      </div>

      <div className="mb-8 bg-slate-900/50 rounded-xl p-3 border border-teal-900/50 flex items-center justify-between group hover:border-teal-500/50 transition-colors">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">
            Streak
          </span>
          <span className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
            Daily
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame className="text-orange-500 fill-orange-500/20 w-6 h-6" />
          </motion.div>
          <span className="text-2xl font-mono font-bold text-teal-400">14</span>
          <span className="text-xs text-slate-500 self-end mb-1">days</span>
        </div>
      </div>

      <div className="space-y-5">
        {subjects.map((subject, index) => (
          <div key={subject.name} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-semibold tracking-wide text-slate-400 uppercase">
              <div className="flex items-center gap-2">
                <span className="text-teal-600">{subject.icon}</span>
                {subject.name}
              </div>
              <span className="text-teal-200">{subject.progress}%</span>
            </div>

            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-800 to-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                initial={{ width: 0 }}
                whileInView={{ width: `${subject.progress}%` }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
