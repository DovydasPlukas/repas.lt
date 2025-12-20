"use client"
/*eslint-disable*/

import { useEffect, useRef, useCallback } from "react"

interface MapComponentProps {
  location: { lat: number; lng: number } | null
  onMapClick?: (lat: number, lng: number) => void
  readonly?: boolean
}

export default function MapComponent({ location, onMapClick, readonly = false }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const initializingRef = useRef(false)

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current) {
      return
    }

    if (initializingRef.current || mapInstanceRef.current) {
      return
    }

    if (!leafletRef.current) {
      return
    }

    initializingRef.current = true

    try {
      const L = leafletRef.current
      const initialCenter = location ? [location.lat, location.lng] : [55.9349, 23.3144]

      // Remove previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      mapInstanceRef.current = L.map(mapContainerRef.current).setView(initialCenter, 14)

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)

      mapInstanceRef.current.attributionControl.remove()

      if (!readonly && onMapClick) {
        mapInstanceRef.current.on("click", (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng)
        })
      }

      if (location) {
        const L = leafletRef.current
        if (markerRef.current) {
          markerRef.current.remove()
        }

        markerRef.current = L.marker([location.lat, location.lng], {
          draggable: !readonly && !!onMapClick,
        }).addTo(mapInstanceRef.current)

        if (!readonly && onMapClick) {
          markerRef.current.on("dragend", () => {
            if (markerRef.current) {
              const pos = markerRef.current.getLatLng()
              onMapClick(pos.lat, pos.lng)
            }
          })
        }
      }

      initializingRef.current = false
    } catch (error) {
      console.error("Error initializing map:", error)
      initializingRef.current = false
    }
  }, [location, onMapClick, readonly])

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
      setTimeout(() => initializeMap(), 200)
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
      draggable: !readonly && !!onMapClick,
    }).addTo(mapInstanceRef.current)

    if (!readonly && onMapClick) {
      markerRef.current.on("dragend", () => {
        if (markerRef.current) {
          const pos = markerRef.current.getLatLng()
          onMapClick(pos.lat, pos.lng)
        }
      })
    }

    mapInstanceRef.current.panTo([location.lat, location.lng])
  }, [location, onMapClick, readonly])

  return <div ref={mapContainerRef} className="w-full h-[300px] bg-muted rounded-md" style={{ zIndex: 0 }} />
}