"use client";
import {
  Terminal,
  Activity,
  Wifi,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function MissionLog() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      type: "sys",
      time: "08:00",
      text: "SYSTÉM INICIALIZOVÁN...",
      icon: <Activity size={14} />,
    },
    {
      id: 2,
      type: "info",
      time: "08:01",
      text: "PŘIPOJENÍ K NEURÁLNÍ SÍTI: STABILNÍ",
      icon: <Wifi size={14} />,
    },
    {
      id: 3,
      type: "success",
      time: "08:05",
      text: "DENNÍ SÉRIE: AKTIVNÍ (14 DNÍ)",
      icon: <ShieldCheck size={14} />,
    },
    {
      id: 4,
      type: "warn",
      time: "11:30",
      text: "DETEKOVÁNA NOVÁ TÉMA: VEKTORY",
      icon: <AlertTriangle size={14} />,
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: 5,
          type: "process",
          time: "TEĎ",
          text: "SYNCHRONIZACE DAT S MATEŘSKOU LODÍ...",
          icon: <Terminal size={14} />,
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getColor = (type) => {
    switch (type) {
      case "sys":
        return "text-slate-400";
      case "success":
        return "text-emerald-400";
      case "warn":
        return "text-amber-400";
      case "process":
        return "text-teal-300 animate-pulse";
      default:
        return "text-teal-200";
    }
  };

  return (
    <div className="w-full max-w-[350px] bg-[#0B1221]/85 backdrop-blur-md border border-teal-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(20,184,166,0.1)] font-mono text-xs">
      {/* TOP BAR */}
      <div className="bg-slate-900/80 border-b border-teal-500/30 p-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-teal-500 font-bold tracking-widest uppercase">
          <Terminal size={14} />
          <span>Palubní Deník</span>
        </div>

        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>

      {/* LOGS */}
      <div className="p-4 space-y-3 min-h-[160px] max-h-[200px] overflow-y-auto custom-scrollbar">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start gap-3 transition-all duration-300 ${getColor(
              log.type,
            )}`}
          >
            {/* Time */}
            <span className="text-slate-600 font-bold shrink-0">
              [{log.time}]
            </span>

            {/* Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {log.icon}
                <span className="leading-tight drop-shadow-sm">{log.text}</span>
              </div>

              <div className="w-full h-[1px] bg-teal-500/10 mt-1"></div>
            </div>
          </div>
        ))}

        {/* BLINKING CURSOR */}
        <div className="flex items-center gap-2 text-teal-500 mt-2 pl-1">
          <span className="animate-pulse">_</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-teal-900/20 p-1 px-4 flex justify-between items-center text-[10px] text-teal-600 uppercase tracking-wider border-t border-teal-500/20">
        <span>Verze OS: 4.2.0</span>
        <span className="animate-pulse text-emerald-500">ONLINE</span>
      </div>
    </div>
  );
}
