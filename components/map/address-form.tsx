"use client"

import type { FormEvent } from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form/form-error"
import { FormSuccess } from "@/components/form/form-success"
import AddressAutocomplete from "@/components/map/address-autocomplete"
import MapComponent from "@/components/map/map-component"

interface AddressData {
  street: string
  apartment: string
  floor: string
  comments: string
  latitude: string
  longitude: string
}

interface AddressSuggestion {
  name: string
  latitude: number
  longitude: number
}

export default function AddressForm() {
  const [formData, setFormData] = useState<AddressData>({
    street: "",
    apartment: "",
    floor: "",
    comments: "",
    latitude: "",
    longitude: "",
  })

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load existing address on mount
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const response = await fetch("/api/user-address", {
          method: "GET",
        })
        const result = await response.json()

        if (result.data) {
          setFormData({
            street: result.data.street || "",
            apartment: result.data.apartment || "",
            floor: result.data.floor || "",
            comments: result.data.comments || "",
            latitude: result.data.latitude || "",
            longitude: result.data.longitude || "",
          })
          setLocation({
            lat: parseFloat(result.data.latitude),
            lng: parseFloat(result.data.longitude),
          })
        }
      } catch (err) {
        console.error("Failed to load address:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadAddress()
  }, [])

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setLocation({ lat: suggestion.latitude, lng: suggestion.longitude })
    setFormData((prev) => ({
      ...prev,
      street: suggestion.name,
      latitude: suggestion.latitude.toString(),
      longitude: suggestion.longitude.toString(),
    }))
  }

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(undefined)
    setSuccess(undefined)

    if (!formData.street || !location) {
      setError("Prašome įvesti adresą ir pasirinkti vietą žemėlapyje")
      return
    }

    setIsSaving(true)

    const saveAddress = async () => {
      try {
        const response = await fetch("/api/user-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            street: formData.street,
            apartment: formData.apartment || null,
            floor: formData.floor || null,
            comments: formData.comments || null,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          setError(result.error || "Nepavyko išsaugoti adreso")
          return
        }

        setSuccess(result.message || "Adresas sėkmingai išsaugotas")
        setTimeout(() => setSuccess(undefined), 3000)
      } catch (err) {
        setError("Nepavyko išsaugoti adreso")
        console.error("Save address error:", err)
      } finally {
        setIsSaving(false)
      }
    }

    saveAddress()
  }

  const isFormValid = Boolean(formData.street && location)

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">Kraunami adreso duomenys...</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
      <div className="w-full px-4 py-8 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Adreso informacija</h2>

                <AddressAutocomplete
                  value={formData.street}
                  onChange={(value) => setFormData((prev) => ({ ...prev, street: value }))}
                  onSelect={handleAddressSelect}
                />

                <div>
                  <Label htmlFor="apartment">Buto numeris</Label>
                  <Input
                    id="apartment"
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, apartment: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="floor">Aukštas</Label>
                  <Input
                    id="floor"
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, floor: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="comments">Komentarai kurjeriui</Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                    placeholder="Papildoma informacija kurjeriui dėl pristatymo..."
                    rows={4}
                    maxLength={250}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.comments.length}/250</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <FormError message={error} />
                <FormSuccess message={success} />

                <Button type="submit" variant="Repas" className="w-full" size="lg" disabled={!isFormValid || isSaving}>
                  {isSaving ? "Išsaugoma..." : "Patvirtinti adresą"}
                </Button>
              </div>
            </Card>

            <Card className="p-6 overflow-hidden">
              <div className="space-y-4 overflow-auto max-h-[600px]">
                <h2 className="text-lg font-semibold">Žemėlapis</h2>
                <div className="rounded-lg overflow-hidden border border-border h-80">
                  <MapComponent location={location} onMapClick={handleMapClick} />
                </div>

                {location ? (
                  <>
                    <p className="text-sm text-muted-foreground text-center line-clamp-2">
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
                ) : (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                    <p className="text-sm text-orange-700 dark:text-orange-400 font-medium line-clamp-3">
                      Pradėkite rašyti adresą, kad pamatytumėte pasiūlymus ir vietą žemėlapyje
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </form>
      </div>
  )
}