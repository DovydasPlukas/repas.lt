/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useCallback } from "react"

interface MapComponentProps {
  location: { lat: number; lng: number } | null
  onMapClick: (lat: number, lng: number) => void
}

export default function MapComponent({ location, onMapClick }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || mapInstanceRef.current || !leafletRef.current) {
      return
    }

    const L = leafletRef.current

    mapInstanceRef.current = L.map(mapContainerRef.current).setView([55.9349, 23.3144], 12)

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current)

    // Remove attribution control (contributors text)
    mapInstanceRef.current.attributionControl.remove()

    mapInstanceRef.current.on("click", (e: any) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    })
  }, [onMapClick])

  useEffect(() => {
    if ((window as any).L) {
      leafletRef.current = (window as any).L
      initializeMap()
      return
    }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      leafletRef.current = (window as any).L
      setTimeout(() => initializeMap(), 100)
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [initializeMap])

  useEffect(() => {
    if (!leafletRef.current || !mapInstanceRef.current || !location) {
      return
    }

    const L = leafletRef.current

    if (markerRef.current) {
      markerRef.current.remove()
    }

    markerRef.current = L.marker([location.lat, location.lng], {
      draggable: true,
    }).addTo(mapInstanceRef.current)

    markerRef.current.on("dragend", () => {
      if (markerRef.current) {
        const pos = markerRef.current.getLatLng()
        onMapClick(pos.lat, pos.lng)
      }
    })

    mapInstanceRef.current.panTo([location.lat, location.lng])
  }, [location, onMapClick])

  return <div ref={mapContainerRef} className="w-full h-[500px] bg-muted rounded-md" style={{ zIndex: 0 }} />
}