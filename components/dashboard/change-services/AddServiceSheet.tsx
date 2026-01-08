import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Check } from "lucide-react"
import { Service } from "@/components/dashboard/change-services/types"
import { FormError } from "@/components/form/form-error"
import { AVAILABLE_ICONS, getCardIcon } from "@/components/Cards/card-icons"

interface AddServiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceSaved: (updatedService?: Service) => void
  serviceToEdit?: Service | null
  resetServiceToEdit?: () => void
}

// Map icon keys to their card colors
const ICON_COLORS: Record<string, string> = {
  icon_1: "bg-[#505ba3]",      // Skalbimas - Blue
  icon_2: "bg-[#984447]",      // Kostiumų valymas - Red
  icon_3: "bg-[#45B69C]",      // Lyginimas - Green
  icon_4: "bg-[#E3B23C]",      // Skalbimo mašinų tvarkymas - Yellow
  icon_5: "bg-[#068D9D]",      // Patalinės valymas - Teal
  icon_6: "bg-black",          // Test - Black
}

export default function AddServiceSheet({
  open,
  onOpenChange,
  onServiceSaved,
  serviceToEdit = null,
  resetServiceToEdit,
}: AddServiceSheetProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    enabled: true,
    image: "icon_1",
  })

  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Prefill form if editing or reset if adding
  useEffect(() => {
    if (open) {
      if (serviceToEdit) {
        setForm({
          name: serviceToEdit.name,
          description: serviceToEdit.description || "",
          enabled: serviceToEdit.enabled,
          image: serviceToEdit.image || "icon_1",
        })
      } else {
        setForm({ name: "", description: "", enabled: true, image: "icon_1" })
        resetServiceToEdit?.()
      }
      setFormError(null)
    }
  }, [serviceToEdit, open, resetServiceToEdit])

  const saveService = async () => {
    if (!form.name || !form.description) {
      setFormError("Prašome užpildyti visus laukus")
      return
    }

    setSaving(true)

    try {
      let savedService: Service | null = null

      if (serviceToEdit) {
        // EDIT
        const res = await fetch(`/api/dashboard/services/${serviceToEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error("Failed to update service")
        savedService = await res.json()
      } else {
        // ADD NEW
        const res = await fetch("/api/dashboard/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error("Failed to create service")
        savedService = await res.json()
      }

      setForm({ name: "", description: "", enabled: true, image: "icon_1" })
      setFormError(null)
      onOpenChange(false)

      if (savedService) {
        onServiceSaved(savedService)
      }
    } catch (error) {
      console.error("Error saving service:", error)
      setFormError("Įvyko klaida saugant paslaugą")
    } finally {
      setSaving(false)
    }
  }

  const bgColor = ICON_COLORS[form.image] || ICON_COLORS["icon_1"]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {serviceToEdit ? "Redaguoti paslaugą" : "Pridėti naują paslaugą"}
          </SheetTitle>
          <SheetDescription>
            {serviceToEdit
              ? "Redaguokite esamą paslaugą"
              : "Sukurkite naują paslaugą"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {formError && <FormError message={formError} />}

          {/* Name */}
          <div>
            <Label htmlFor="name">Pavadinimas</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Įveskite paslaugos pavadinimą"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Aprašymas</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Įveskite paslaugos aprašymą"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label htmlFor="icon-select">Nuotrauka</Label>

            {/* Icon Preview - Mobile */}
            <div className={`flex justify-center p-4 rounded-lg h-24 w-full md:hidden ${bgColor}`}>
              <div className="h-[74px] flex flex-col justify-center items-center">
                {getCardIcon(form.image, false)}
              </div>
            </div>

            {/* Icon Preview - Desktop */}
            <div className={`hidden md:flex justify-center rounded-lg p-1 h-32 w-full ${bgColor}`}>
              <div className="h-[120px] w-[120px] flex flex-col justify-center items-center">
                {getCardIcon(form.image, true)}
              </div>
            </div>

            {/* Icon Selector */}
            <Select value={form.image} onValueChange={(value) => setForm({ ...form, image: value })}>
              <SelectTrigger id="icon-select">
                <SelectValue placeholder="Pasirinkite ikonką" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ICONS.map((icon) => (
                  <SelectItem key={icon.key} value={icon.key}>
                    {icon.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enabled Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.enabled}
              onCheckedChange={(checked) =>
                setForm({ ...form, enabled: checked })
              }
            />
            <span>Įjungta</span>
          </div>

          {/* Save Button */}
          <Button onClick={saveService} className="w-full" disabled={saving}>
            {serviceToEdit ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Išsaugoti pakeitimus
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Sukurti paslaugą
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}