"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import NET from "vanta/dist/vanta.net.min";
import { useTheme } from "next-themes";

export function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(0);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: isDark ? 0x3b82f6 : 0x2563eb,
          backgroundColor: isDark ? 0x020617 : 0xf8fafc,
          points: 12.0,
          maxDistance: 20.0,
          spacing: 16.0,
        })
      );
    } else if (vantaEffect) {
      // Update colors if theme changes
      vantaEffect.setOptions({
        color: isDark ? 0x3b82f6 : 0x2563eb,
        backgroundColor: isDark ? 0x020617 : 0xf8fafc,
      });
    }

    return () => {
      // Cleanup is handled by a separate effect so we don't destroy when just theme changes
    };
  }, [vantaEffect, theme, systemTheme]);

  // Separate effect strictly for cleanup on unmount
  useEffect(() => {
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full -z-10 transition-colors duration-300"
    />
  );
}
