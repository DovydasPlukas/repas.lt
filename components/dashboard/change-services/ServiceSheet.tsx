"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash2, Pencil, Plus } from "lucide-react"

export type AddonType = "PAPILDOMA_PASLAUGA" | "PRIEDAI"

export interface ServiceAddon {
  id: string
  name: string
  type: AddonType
  price: number
  enabled: boolean
}

export interface NewAddon {
  name: string
  type: AddonType
  price: number
}

export interface Service {
  id: string
  name: string
  description: string | null
  enabled: boolean
  addons: ServiceAddon[]
}

interface ServiceSheetProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  newAddon: NewAddon
  setNewAddon: (addon: NewAddon) => void
  addNewAddon: () => void
  toggleAddon: (id: string, enabled: boolean) => void
  deleteAddon: (id: string) => void
  openEditDialog: (addon: ServiceAddon) => void
}

export default function ServiceSheet({
  service,
  open,
  onOpenChange,
  newAddon,
  setNewAddon,
  addNewAddon,
  toggleAddon,
  deleteAddon,
  openEditDialog,
}: ServiceSheetProps) {
  const papildomosPaslaugos = service.addons.filter((a) => a.type === "PAPILDOMA_PASLAUGA")
  const priedai = service.addons.filter((a) => a.type === "PRIEDAI")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{service.name}</SheetTitle>
          <SheetDescription>{service.description || "Tvarkykite paslaugos papildomas paslaugas ir priedus"}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Add new addon form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pridėti naują</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="addon-name">Pavadinimas</Label>
                <Input
                  id="addon-name"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                  placeholder="Papildomos paslaugos pavadinimas"
                />
              </div>
              <div>
                <Label htmlFor="addon-type">Tipas</Label>
                <div className="flex gap-2">
                  <Button
                    variant={newAddon.type === "PAPILDOMA_PASLAUGA" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setNewAddon({ ...newAddon, type: "PAPILDOMA_PASLAUGA" })}
                  >
                    Papildomos Paslaugos
                  </Button>
                  <Button
                    variant={newAddon.type === "PRIEDAI" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setNewAddon({ ...newAddon, type: "PRIEDAI" })}
                  >
                    Priedai
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="addon-price">Kaina (€)</Label>
                <Input
                  id="addon-price"
                  type="number"
                  step="0.01"
                  value={newAddon.price}
                  onChange={(e) => setNewAddon({ ...newAddon, price: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <Button onClick={addNewAddon} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Pridėti
              </Button>
            </CardContent>
          </Card>

          {/* Papildomos Paslaugos */}
          {papildomosPaslaugos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Papildomų paslaugų nėra</p>
          ) : (
            papildomosPaslaugos.map((addon) => (
              <Card key={addon.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{addon.name}</p>
                    <p className="text-sm text-muted-foreground">€{addon.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(addon)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Switch checked={addon.enabled} onCheckedChange={() => toggleAddon(addon.id, addon.enabled)} />
                    <Button variant="ghost" size="icon" onClick={() => deleteAddon(addon.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Priedai */}
          {priedai.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Priedų nėra</p>
          ) : (
            priedai.map((addon) => (
              <Card key={addon.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{addon.name}</p>
                    <p className="text-sm text-muted-foreground">€{addon.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(addon)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Switch checked={addon.enabled} onCheckedChange={() => toggleAddon(addon.id, addon.enabled)} />
                    <Button variant="ghost" size="icon" onClick={() => deleteAddon(addon.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}