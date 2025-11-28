"use client"

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
import { Plus, Check } from "lucide-react"
import { Service } from "@/components/dashboard/change-services/types"
import { FormError } from "@/components/form/form-error"

interface AddServiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceSaved: (updatedService?: Service) => void // pass updated service
  serviceToEdit?: Service | null
  resetServiceToEdit?: () => void // optional callback to reset parent state
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
        })
      } else {
        setForm({ name: "", description: "", enabled: true })
        resetServiceToEdit?.() // ensure parent clears serviceToEdit
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
        savedService = await res.json()
      } else {
        // ADD NEW
        const res = await fetch("/api/dashboard/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        savedService = await res.json()
      }

      setForm({ name: "", description: "", enabled: true })
      setFormError(null)
      onOpenChange(false)

      if (savedService) {
        onServiceSaved(savedService) // update parent instantly
      }
    } catch (error) {
      console.error("Error saving service:", error)
      setFormError("Įvyko klaida saugant paslaugą")
    } finally {
      setSaving(false)
    }
  }

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

          <div>
            <Label htmlFor="name">Pavadinimas</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Įveskite paslaugos pavadinimą"
            />
          </div>

          <div>
            <Label htmlFor="description">Aprašymas</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Įveskite paslaugos aprašymą"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={form.enabled}
              onCheckedChange={(checked) => setForm({ ...form, enabled: checked })}
            />
            <span>Įjungta</span>
          </div>

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