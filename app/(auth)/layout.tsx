"use client"

import type React from "react"
import { useEffect, useRef } from "react"
declare global {
  interface Window {
    VANTA?: {
      FOG: (options: Record<string, unknown>) => { destroy: () => void }
    }
  }
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<{ destroy: () => void } | null>(null)

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src
      script.async = true
      script.onload = () => resolve()
      document.body.appendChild(script)
    })

  useEffect(() => {
    let mounted = true

    const init = async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js")
      await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js")

      if (!mounted || !vantaRef.current || !window.VANTA) return

      vantaEffect.current = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0x82f4f4,
        midtoneColor: 0xffffff,
        lowlightColor: 0x000000,
        baseColor: 0x494b8b,
        blurFactor: 0.4,
        speed: 1,
        zoom: 0.5,
      })

      // Fade in Vanta background only
      vantaRef.current.style.opacity = "1"
    }

    init()

    return () => {
      mounted = false
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Vanta.js Background */}
      <div
        ref={vantaRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{ zIndex: 0 }}
      />

      {/* Children */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;