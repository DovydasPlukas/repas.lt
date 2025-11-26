"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Navigation2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import MapComponent from "@/components/map/map-component"

export default function VietosPaieskosPage() {
  const searchParams = useSearchParams()
  const [zipCode, setZipCode] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const zipFromUrl = searchParams.get("zip")
    if (zipFromUrl) {
      setZipCode(zipFromUrl)
      handleSearchFromUrl(zipFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchFromUrl = async (zip: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=lithuania&format=json&limit=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch location")
      }

      const data = await response.json()

      if (data.length === 0) {
        setError("ZIP kodas nerastas. Bandykite kitą.")
        setLocation(null)
        return
      }

      const result = data[0]
      setLocation({
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
      })

      const addressData = result.address || {}
      const displayName = result.display_name || ""

      const cityName =
        addressData.city ||
        addressData.town ||
        addressData.village ||
        addressData.municipality ||
        displayName
            .split(", ")
            .find((part: string) => !part.match(/\d{5}/) && part.length > 2 && !part.includes("Šiaulių"))
            || "Šiauliai"

      setCity(cityName)
      setStreet("")
      setHouseNumber("")
    } catch (err) {
      setError("Klaida gaunant vietovę. Bandykite dar kartą.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSearchFromUrl(zipCode)
  }

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng })
  }

  const handleSave = () => {
    const data = {
      zipCode,
      city,
      street,
      houseNumber,
      notes,
      location,
    }
    console.log("Saving data:", data)
    alert("Duomenys išsaugoti!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Vietos Paieška</h1>
          </div>
          <p className="text-muted-foreground text-balance">Įveskite ZIP kodą ir raskite vietovę Šiauliuose</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Form Section */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="zipcode" className="text-base font-semibold">
                  ZIP Kodas
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="zipcode"
                    type="text"
                    placeholder="Įveskite ZIP kodą..."
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="flex-1"
                    maxLength={5}
                    required
                  />
                  <Button type="submit" disabled={loading} className="min-w-[120px] bg-[#494B8B] transition-all duration-300 ease-in-out hover:bg-[#494B8B]/90 text-white ">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Ieškoma...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Navigation2 className="w-4 h-4" />
                        Pateikti
                      </span>
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              {location && (
                <>
                  <div className="h-px bg-border" />

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Vietos Informacija</h2>

                    <div className="space-y-2">
                      <Label htmlFor="city">Miestas</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Pvz., Šiauliai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Gatvė</Label>
                      <Input
                        id="street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Pvz., Vilniaus g."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="houseNumber">Namo numeris</Label>
                      <Input
                        id="houseNumber"
                        type="text"
                        placeholder="Pvz., 123"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Pastabos</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Papildoma informacija..."
                        rows={4}
                      />
                    </div>

                    <Button type="button" onClick={handleSave} className="w-full bg-[#494B8B] transition-all duration-300 ease-in-out hover:bg-[#494B8B]/90 text-white" size="lg">
                      <Save className="w-4 h-4 mr-2" />
                      Išsaugoti duomenis
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Card>

          {/* Map Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Žemėlapis</h2>
              <div className="rounded-lg overflow-hidden border border-border">
                <MapComponent location={location} onMapClick={handleMapClick} />
              </div>
              {location && (
                <>
                  <p className="text-sm text-muted-foreground text-center">
                    Spauskite žemėlapį arba vilkite žymeklį, kad pakeistumėte vietą
                  </p>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Platuma</p>
                      <p className="text-sm font-mono font-semibold">{location.lat.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ilguma</p>
                      <p className="text-sm font-mono font-semibold">{location.lng.toFixed(6)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}