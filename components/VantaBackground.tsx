"use client";

import { useEffect, useRef, ReactNode } from "react";

declare global {
  interface Window {
    VANTA?: {
      FOG: (options: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

interface VantaBackgroundProps {
  children: ReactNode;
}

export const VantaBackground = ({ children }: VantaBackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadScript = (src: string) =>
      new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    const initVanta = async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js");

      if (!mounted || !vantaRef.current || !window.VANTA) return;

      vantaEffect.current = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        highlightColor: 0x82f4f4,
        midtoneColor: 0xffffff,
        lowlightColor: 0x000000,
        baseColor: 0x494b8b,
        blurFactor: 0.4,
        speed: 1,
        zoom: 0.5,
      });

      vantaRef.current.style.opacity = "1";
    };

    initVanta();

    return () => {
      mounted = false;
      vantaEffect.current?.destroy();
      vantaEffect.current = null;
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Vanta Background */}
      <div
        ref={vantaRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{ zIndex: 0 }}
      />

      {/* Children */}
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
};