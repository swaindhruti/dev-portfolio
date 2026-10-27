"use client";

import { useEffect, useState } from "react";

/** Live wall clock for a fixed time zone. Renders nothing on the server to avoid a mismatch. */
export function Clock({ timeZone, suffix }: { timeZone: string; suffix: string }) {
  const [now, setNow] = useState("");

  useEffect(() => {
    const fmt = (() => {
      try {
        return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone });
      } catch {
        return null;
      }
    })();
    if (!fmt) return;
    const tick = () => setNow(`${fmt.format(new Date())} ${suffix}`);
    const first = setTimeout(tick, 0);
    const iv = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(iv);
    };
  }, [timeZone, suffix]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {now}
    </span>
  );
}
