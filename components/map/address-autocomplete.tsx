"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import RequiredFieldLabel from "@/components/checkout/RequiredFieldLabel"

interface AddressSuggestion {
  name: string
  latitude: number
  longitude: number
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  placeholder?: string
  label?: string
}

// Nominatim API response type
interface NominatimResult {
  lat: string
  lon: string
  address: {
    road?: string
    street?: string
    house_number?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
  }
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Aušros al. 40 Šiauliai",
  label = "Gatvė, namo numeris, miestas",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<number | undefined>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `street=${encodeURIComponent(query)}` +
          `&countrycodes=lt` +
          `&format=json` +
          `&addressdetails=1` +
          `&limit=75`,
        { headers: { "Accept-Language": "lt" } }
      )

      if (!response.ok) throw new Error("Failed to fetch suggestions")

      const data: NominatimResult[] = await response.json()

      const transformedData: AddressSuggestion[] = data
        .filter(item => item.address?.house_number && (item.address.road || item.address.street))
        .map(item => {
          const addr = item.address
          const streetName = addr.road || addr.street || ""
          const houseNumber = addr.house_number || ""
          const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || ""
          const county = addr.county || ""

          const displayName = [ `${streetName} ${houseNumber}`.trim(), city, county ].filter(Boolean).join(", ")

          return {
            name: displayName,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          }
        })

      setSuggestions(transformedData)
      setShowSuggestions(true)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching address suggestions:", error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => searchAddress(value), 300)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [value, searchAddress])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.name)
    onSelect(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Label htmlFor="address-input">
        <RequiredFieldLabel>{label}</RequiredFieldLabel>
      </Label>
      <div className="relative mt-2">
        <Input
          id="address-input"
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value)
            setShowSuggestions(true)
          }}
          placeholder={placeholder}
          className="w-full"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0 focus:outline-none focus:bg-accent"
            >
              <div className="font-medium text-sm">{suggestion.name}</div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && !loading && value.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg px-4 py-3">
          <p className="text-sm text-muted-foreground">Adresų nerasta</p>
        </div>
      )}
    </div>
  )
}