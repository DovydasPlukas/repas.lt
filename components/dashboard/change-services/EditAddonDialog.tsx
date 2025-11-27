"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ServiceAddon } from "@/components/dashboard/change-services/types" 

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  addon: ServiceAddon | null
  onSave: (name: string, price: number) => void
}

export default function EditAddonDialog({ open, onOpenChange, addon, onSave }: Props) {
  const [name, setName] = React.useState("")
  const [price, setPrice] = React.useState(0)

  React.useEffect(() => {
    if (addon) {
      setName(addon.name)
      setPrice(addon.price)
    }
  }, [addon])

  const handleSave = () => {
    onSave(name, price)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Redaguoti papildomą paslaugą</DialogTitle>
          <DialogDescription>
            Redaguokite paslaugos pavadinimą ir kainą
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="addon-name">Pavadinimas</Label>
            <Input
              id="addon-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pavadinimas"
            />
          </div>
          <div>
            <Label htmlFor="addon-price">Kaina (€)</Label>
            <Input
              id="addon-price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full">
            Išsaugoti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}