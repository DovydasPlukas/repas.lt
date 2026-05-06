"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash, Pencil, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { FormError } from "@/components/form/form-error"
import type {
  Service,
  ServiceAddon,
  NewAddon,
  OptionPricingType,
  RangeInterval,
} from "@/components/dashboard/change-services/types"

interface ServiceSheetProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  addNewAddon: (addon: NewAddon) => void
  toggleAddon: (id: string, enabled: boolean) => void
  deleteAddon: (id: string) => void
  onEditAddon: (addon: ServiceAddon) => void
}

const EMPTY_FORM: NewAddon = {
  name: "",
  type: "OPTION",
  price: 0,
  optionPricingType: "FIXED",
  ranges: [],
}

// Price label shown inside the admin list cards 
function addonPriceLabel(addon: ServiceAddon): string {
  if (addon.type !== "OPTION") return `${Number(addon.price).toFixed(2)}€`
  switch (addon.optionPricingType) {
    case "QUANTITY":
      return `${Number(addon.price).toFixed(2)}€ / vnt.`
    case "RANGE": {
      const rs = addon.ranges ?? []
      if (!rs.length) return "Intervalinis"
      const first = rs[0]
      const last = rs[rs.length - 1]
      return `${first.minQty}–${last.maxQty} ${Number(first.price).toFixed(2)}€–${Number(last.price).toFixed(2)}€`
    }
    default:
      return `${Number(addon.price).toFixed(2)}€`
  }
}

// Reusable addon card row 
function AddonRow({
  addon,
  onEdit,
  onToggle,
  onDelete,
}: {
  addon: ServiceAddon
  onEdit: (a: ServiceAddon) => void
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (a: ServiceAddon) => void
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0 mr-2">
          <p className="text-sm font-medium truncate">{addon.name}</p>
          <p className="text-sm text-muted-foreground">{addonPriceLabel(addon)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 hover:bg-muted rounded-full transition"
            onClick={() => onEdit(addon)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Switch
            checked={Boolean(addon.enabled)}
            onCheckedChange={() => onToggle(addon.id, addon.enabled)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="p-2 hover:bg-destructive/20 rounded-full transition"
            onClick={() => onDelete(addon)}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main component 
export default function ServiceSheet({
  service,
  open,
  onOpenChange,
  addNewAddon,
  toggleAddon,
  deleteAddon,
  onEditAddon,
}: ServiceSheetProps) {
  const normalize = (a: ServiceAddon) => ({
    ...a,
    price: Number(a.price),
    ranges: (a.ranges ?? []).map((r) => ({ ...r, price: Number(r.price) })),
  })

  const [addons, setAddons] = useState<ServiceAddon[]>((service?.addons ?? []).map(normalize))
  const [formError, setFormError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<NewAddon>(EMPTY_FORM)
  const [localRanges, setLocalRanges] = useState<RangeInterval[]>([])

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addonToDelete, setAddonToDelete] = useState<ServiceAddon | null>(null)

  useEffect(() => {
    setAddons((service?.addons ?? []).map(normalize))
  }, [service])

  // Helpers 
  const setType = (type: NewAddon["type"]) =>
    setForm({ ...form, type, optionPricingType: type === "OPTION" ? "FIXED" : undefined, price: 0 })

  const setPricingType = (pt: OptionPricingType) => {
    setForm({ ...form, optionPricingType: pt, price: 0 })
    if (pt !== "RANGE") setLocalRanges([])
  }

  const addRangeRow = () =>
    setLocalRanges((prev) => [...prev, { minQty: 0, maxQty: 0, price: 0 }])

  const updateRange = (i: number, field: keyof RangeInterval, value: number) =>
    setLocalRanges((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))

  const removeRange = (i: number) =>
    setLocalRanges((prev) => prev.filter((_, idx) => idx !== i))

  // Validation & submit 
  const handleAddNewAddon = () => {
    setFormError(null)

    if (!form.name.trim()) {
      setFormError("Pavadinimas negali būti tuščias")
      return
    }

    if (form.type === "OPTION") {
      if (form.optionPricingType === "RANGE") {
        if (localRanges.length === 0) {
          setFormError("Pridėkite bent vieną intervalą")
          return
        }
        for (const r of localRanges) {
          if (r.minQty < 0 || r.maxQty <= r.minQty) {
            setFormError("Kiekvieno intervalo pradžia turi būti mažesnė už pabaigą")
            return
          }
          if (r.price < 0) {
            setFormError("Kaina intervale negali būti neigiama")
            return
          }
        }
        addNewAddon({ ...form, ranges: localRanges, price: 0 })
      } else {
        if (isNaN(form.price) || form.price < 0) {
          setFormError("Kaina turi būti teigiamas skaičius")
          return
        }
        addNewAddon({ ...form, ranges: [] })
      }
    } else {
      if (isNaN(form.price) || form.price < 0) {
        setFormError("Kaina turi būti teigiamas skaičius")
        return
      }
      addNewAddon(form)
    }

    setForm(EMPTY_FORM)
    setLocalRanges([])
  }

  // Delete helpers 
  const handleDeleteClick = (addon: ServiceAddon) => {
    setAddonToDelete(addon)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (addonToDelete) deleteAddon(addonToDelete.id)
    setDeleteDialogOpen(false)
    setAddonToDelete(null)
  }

  // Grouped addons 
  const pasirinkimas = addons.filter((a) => a.type === "OPTION")
  const papildomos = addons.filter((a) => a.type === "PAPILDOMA_PASLAUGA")
  const priedai = addons.filter((a) => a.type === "PRIEDAI")

  // Render 
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{service.name}</SheetTitle>
            <SheetDescription>
              {service.description || "Tvarkykite paslaugos papildomas paslaugas ir priedus"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">

            {/* Add new addon form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pridėti naują</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formError && <FormError message={formError} />}

                {/* Name */}
                <div>
                  <Label htmlFor="addon-name">Pavadinimas</Label>
                  <Input
                    id="addon-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Papildomos paslaugos pavadinimas"
                  />
                </div>

                {/* Addon type */}
                <div>
                  <Label>Tipas</Label>
                  <div className="flex gap-2">
                    {(
                      [
                        ["OPTION", "Pasirinkimas"],
                        ["PAPILDOMA_PASLAUGA", "Papildomos"],
                        ["PRIEDAI", "Priedai"],
                      ] as const
                    ).map(([val, label]) => (
                      <Button
                        key={val}
                        variant={form.type === val ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setType(val)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pricing type — only for OPTION */}
                {form.type === "OPTION" && (
                  <div>
                    <Label>Kainos tipas</Label>
                    <div className="flex gap-2">
                      {(
                        [
                          ["FIXED", "Fiksuota"],
                          ["QUANTITY", "Kiekis"],
                          ["RANGE", "Intervalas"],
                        ] as const
                      ).map(([val, label]) => (
                        <Button
                          key={val}
                          variant={form.optionPricingType === val ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setPricingType(val)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fixed price input (FIXED or non-OPTION) */}
                {(form.type !== "OPTION" || form.optionPricingType === "FIXED") && (
                  <div>
                    <Label htmlFor="addon-price">Kaina (€)</Label>
                    <Input
                      id="addon-price"
                      type="number"
                      step="0.01"
                      min={0}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                )}

                {/* Unit price for QUANTITY */}
                {form.type === "OPTION" && form.optionPricingType === "QUANTITY" && (
                  <div>
                    <Label htmlFor="addon-unit-price">Kaina už vienetą (€)</Label>
                    <Input
                      id="addon-unit-price"
                      type="number"
                      step="0.01"
                      min={0}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      placeholder="2.00"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Galutinė kaina = kiekis × kaina už vienetą
                    </p>
                  </div>
                )}

                {/* Range builder for RANGE */}
                {form.type === "OPTION" && form.optionPricingType === "RANGE" && (
                  <div className="space-y-3">
                    <Label>Intervalai</Label>
                    {localRanges.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Nėra intervalų – pridėkite bent vieną.
                      </p>
                    )}
                    <div className="space-y-2">
                      {localRanges.map((range, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            value={range.minQty}
                            onChange={(e) => updateRange(i, "minQty", Number(e.target.value))}
                            placeholder="Nuo"
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground shrink-0">–</span>
                          <Input
                            type="number"
                            min={0}
                            value={range.maxQty}
                            onChange={(e) => updateRange(i, "maxQty", Number(e.target.value))}
                            placeholder="Iki"
                            className="w-20 text-center"
                          />
                          <span className="pl-4"></span>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={range.price}
                            onChange={(e) => updateRange(i, "price", Number(e.target.value))}
                            placeholder="0.00"
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground shrink-0">€</span>
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

                <Button onClick={handleAddNewAddon} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Pridėti
                </Button>
              </CardContent>
            </Card>

            {/* Pasirinkimas */}
            <AddonSection
              title="Pasirinkimas"
              addons={pasirinkimas}
              emptyText="Pasirinkimų nėra"
              onEdit={onEditAddon}
              onToggle={toggleAddon}
              onDelete={handleDeleteClick}
            />

            <div className="h-px" />

            {/* Papildomos Paslaugos */}
            <AddonSection
              title="Papildomos Paslaugos"
              addons={papildomos}
              emptyText="Papildomų paslaugų nėra"
              onEdit={onEditAddon}
              onToggle={toggleAddon}
              onDelete={handleDeleteClick}
            />

            <div className="h-px" />

            {/* Priedai */}
            <AddonSection
              title="Priedai"
              addons={priedai}
              emptyText="Priedų nėra"
              onEdit={onEditAddon}
              onToggle={toggleAddon}
              onDelete={handleDeleteClick}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ištrinti papildomą paslaugą</DialogTitle>
            <DialogDescription>
              Ar tikrai norite ištrinti <b>{addonToDelete?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Atšaukti
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Ištrinti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Addon section 
function AddonSection({
  title,
  addons,
  emptyText,
  onEdit,
  onToggle,
  onDelete,
}: {
  title: string
  addons: ServiceAddon[]
  emptyText: string
  onEdit: (a: ServiceAddon) => void
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (a: ServiceAddon) => void
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      {addons.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {addons.map((addon) => (
            <AddonRow
              key={addon.id}
              addon={addon}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}