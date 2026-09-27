"use client";

import { useEffect, useState } from "react";
import { announcementMessages } from "@/components/layout/site-config";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % announcementMessages.length);
        setVisible(true);
      }, 350);
    }, 5200);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-ink text-paper">
      <div className="container-page flex h-9 items-center justify-center overflow-hidden">
        <p
          className={`eyebrow text-center transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {announcementMessages[index]}
        </p>
      </div>
    </div>
  );
}
