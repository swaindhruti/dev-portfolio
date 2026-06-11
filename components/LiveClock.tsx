"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("LOADING...");
  const [date, setDate] = useState("LOADING...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">{mounted ? date : ""}</div>
      <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">{mounted ? time : ""}</div>
    </>
  );
}
