"use client"

/* eslint-disable */

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from "lucide-react"
import { FormError } from "@/components/form/form-error"
import type {
  ServiceAddon,
  OptionPricingType,
  RangeInterval,
} from "@/components/dashboard/change-services/types"

interface EditAddonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addon: ServiceAddon | null
  onSave: (
    name: string,
    price: number,
    optionPricingType?: OptionPricingType,
    ranges?: RangeInterval[]
  ) => Promise<void>
}

export default function EditAddonDialog({
  open,
  onOpenChange,
  addon,
  onSave,
}: EditAddonDialogProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [pricingType, setPricingType] = useState<OptionPricingType>("FIXED")
  const [ranges, setRanges] = useState<RangeInterval[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Hydrate form when dialog opens
  useEffect(() => {
    if (addon && open) {
      setName(addon.name)
      setPrice(Number(addon.price))
      setPricingType(addon.optionPricingType || "FIXED")
      setRanges(
        (addon.ranges || []).map((r) => ({
          minQty: r.minQty,
          maxQty: r.maxQty,
          price: Number(r.price),
        }))
      )
      setError(null)
    }
  }, [addon, open])

  const handlePricingTypeChange = (pt: OptionPricingType) => {
    setPricingType(pt)
    if (pt !== "RANGE") setRanges([])
    if (pt !== "FIXED" && pt !== "QUANTITY") setPrice(0)
  }

  const updateRange = (i: number, field: keyof RangeInterval, value: number) => {
    setRanges((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    )
  }

  const removeRange = (i: number) => {
    setRanges((prev) => prev.filter((_, idx) => idx !== i))
  }

  const addRangeRow = () => {
    setRanges((prev) => [...prev, { minQty: 0, maxQty: 0, price: 0 }])
  }

  const handleSave = async () => {
    setError(null)

    if (!name.trim()) {
      setError("Pavadinimas negali būti tuščias")
      return
    }

    if (addon?.type === "OPTION") {
      if (pricingType === "RANGE") {
        if (ranges.length === 0) {
          setError("Pridėkite bent vieną intervalą")
          return
        }
        for (const r of ranges) {
          if (r.minQty < 0 || r.maxQty <= r.minQty) {
            setError("Kiekvieno intervalo pradžia turi būti mažesnė už pabaigą")
            return
          }
          if (r.price < 0) {
            setError("Kaina intervale negali būti neigiama")
            return
          }
        }
      } else {
        if (isNaN(price) || price < 0) {
          setError("Kaina turi būti teigiamas skaičius")
          return
        }
      }
    } else {
      if (isNaN(price) || price < 0) {
        setError("Kaina turi būti teigiamas skaičius")
        return
      }
    }

    setIsSaving(true)
    try {
      if (addon?.type === "OPTION") {
        await onSave(
          name,
          pricingType === "RANGE" ? 0 : price,
          pricingType,
          pricingType === "RANGE" ? ranges : []
        )
      } else {
        await onSave(name, price)
      }
    } catch (err) {
      setError("Įvyko klaida išsaugant pakeitimus")
    } finally {
      setIsSaving(false)
    }
  }

  if (!addon) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redaguoti: {addon.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && <FormError message={error} />}

          {/* Name Field */}
          <div>
            <Label htmlFor="edit-name">Pavadinimas</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Papildomos paslaugos pavadinimas"
            />
          </div>

          {/* OPTION Pricing Type Selector */}
          {addon.type === "OPTION" && (
            <div>
              <Label>Kainos tipas</Label>
              <div className="flex gap-2 mt-1">
                {(
                  [
                    ["FIXED", "Fiksuota"],
                    ["QUANTITY", "Kiekis"],
                    ["RANGE", "Intervalas"],
                  ] as const
                ).map(([val, label]) => (
                  <Button
                    key={val}
                    variant={pricingType === val ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePricingTypeChange(val)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Price Input (Fixed & Legacy Types) */}
          {(addon.type !== "OPTION" || pricingType === "FIXED") && (
            <div>
              <Label htmlFor="edit-price">Kaina (€)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          )}

          {/* Price Input (Quantity) */}
          {addon.type === "OPTION" && pricingType === "QUANTITY" && (
            <div>
              <Label htmlFor="edit-unit-price">Kaina už vienetą (€)</Label>
              <Input
                id="edit-unit-price"
                type="number"
                step="0.01"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Galutinė kaina = kiekis × kaina už vienetą
              </p>
            </div>
          )}

          {/* Range Inputs (Range) */}
          {addon.type === "OPTION" && pricingType === "RANGE" && (
            <div className="space-y-3">
              <Label>Intervalai</Label>
              {ranges.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nėra intervalų – pridėkite bent vieną.
                </p>
              )}
              <div className="space-y-2">
                {ranges.map((range, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={range.minQty}
                      onChange={(e) =>
                        updateRange(i, "minQty", Number(e.target.value))
                      }
                      placeholder="Nuo"
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      –
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={range.maxQty}
                      onChange={(e) =>
                        updateRange(i, "maxQty", Number(e.target.value))
                      }
                      placeholder="Iki"
                      className="w-20 text-center"
                    />
                    <span className="pl-4"></span>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={range.price}
                      onChange={(e) =>
                        updateRange(i, "price", Number(e.target.value))
                      }
                      placeholder="0.00"
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      €
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/20 rounded-full transition"
                      onClick={() => removeRange(i)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addRangeRow}>
                <Plus className="h-3 w-3 mr-1" /> Pridėti intervalą
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Atšaukti
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Išsaugoma..." : "Išsaugoti"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}