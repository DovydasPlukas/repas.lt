"use client"

import { useEffect, useRef } from "react"

interface BubbleData {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  phase: number
}

function createBubble(width: number, height: number): BubbleData {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 50,
    radius: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.15 + 0.05,
    phase: Math.random() * Math.PI * 2,
  }
}

function updateBubble(b: BubbleData, width: number, height: number) {
  b.y -= b.speed
  b.x += Math.sin(b.phase) * 0.3
  b.phase += 0.015
  if (b.y < -10) {
    b.y = height + 10
    b.x = Math.random() * width
  }
}

function drawBubble(b: BubbleData, ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.globalAlpha = b.opacity
  const gradient = ctx.createRadialGradient(
    b.x - b.radius * 0.3,
    b.y - b.radius * 0.3,
    0,
    b.x,
    b.y,
    b.radius
  )
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)")
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
  ctx.beginPath()
  ctx.arc(b.x - b.radius * 0.4, b.y - b.radius * 0.4, b.radius * 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export default function CardWaveEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }
    resizeCanvas()

    const waves = [
      { amplitude: 4, frequency: 0.01, speed: 0.015, yOffset: 0.82, opacity: 0.08 },
      { amplitude: 5, frequency: 0.012, speed: 0.012, yOffset: 0.88, opacity: 0.06 },
      { amplitude: 6, frequency: 0.008, speed: 0.018, yOffset: 0.93, opacity: 0.05 },
    ]

    const bubbles: BubbleData[] = []
    for (let i = 0; i < 5; i++) {
      bubbles.push(createBubble(canvas.width, canvas.height))
    }

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const wave of waves) {
        ctx.save()
        ctx.globalAlpha = wave.opacity
        ctx.fillStyle = "white"
        ctx.beginPath()
        const yBase = canvas.height * wave.yOffset
        ctx.moveTo(0, canvas.height)
        for (let x = 0; x <= canvas.width; x += 4) {
          const y = yBase + Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude
          ctx.lineTo(x, y)
        }
        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      for (const bubble of bubbles) {
        updateBubble(bubble, canvas.width, canvas.height)
        drawBubble(bubble, ctx)
      }

      time++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, filter: "blur(1.5px)" }}
    />
  )
}