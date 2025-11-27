"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"

interface AddServiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceAdded: () => void
}

export default function AddServiceSheet({ open, onOpenChange, onServiceAdded }: AddServiceSheetProps) {
  const [form, setForm] = useState({ name: "", description: "", enabled: true })

  const addService = async () => {
    if (!form.name || !form.description) {
      alert("Prašome užpildyti visus laukus")
      return
    }

    try {
      await fetch("/api/dashboard/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setForm({ name: "", description: "", enabled: true })
      onOpenChange(false)
      onServiceAdded()
    } catch (error) {
      console.error("Error adding service:", error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Pridėti naują paslaugą</SheetTitle>
          <SheetDescription>Sukurkite naują paslaugą</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
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

          <Button onClick={addService} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Sukurti paslaugą
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}