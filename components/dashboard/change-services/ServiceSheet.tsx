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
import type { Service, ServiceAddon, NewAddon } from "@/components/dashboard/change-services/types"

interface ServiceSheetProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  newAddon: NewAddon
  setNewAddon: (addon: NewAddon) => void
  addNewAddon: () => void
  toggleAddon: (id: string, enabled: boolean) => void
  deleteAddon: (id: string) => void
  onEditAddon: (addon: ServiceAddon) => void
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
  onEditAddon,
}: ServiceSheetProps) {
  const [addons, setAddons] = useState<ServiceAddon[]>(
    (service?.addons ?? []).map((a) => ({ ...a, price: Number(a.price) }))
  )
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addonToDelete, setAddonToDelete] = useState<ServiceAddon | null>(null)

  // Keep local addons in sync when parent `service` changes (and normalize price)
  useEffect(() => {
    setAddons((service?.addons ?? []).map((a) => ({ ...a, price: Number(a.price) })))
  }, [service])

  const handleStartEdit = (addon: ServiceAddon) => {
    onEditAddon(addon)
  }

  const handleDeleteClick = (addon: ServiceAddon) => {
    setAddonToDelete(addon)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (addonToDelete) {
      deleteAddon(addonToDelete.id)
    }
    setDeleteDialogOpen(false)
    setAddonToDelete(null)
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setAddonToDelete(null)
  }

  const handleAddNewAddon = () => {
    setFormError(null)
    if (!newAddon.name || !newAddon.name.trim()) {
      setFormError("Pavadinimas negali būti tuščias")
      return
    }
    if (typeof newAddon.price !== "number" || newAddon.price < 0 || Number.isNaN(newAddon.price)) {
      setFormError("Kaina turi būti teigiamas skaičius")
      return
    }
    // call parent handler
    addNewAddon()
  }

  const pasirinkimas = addons.filter((a) => a.type === "OPTION")
  const papildomosPaslaugos = addons.filter((a) => a.type === "PAPILDOMA_PASLAUGA")
  const priedai = addons.filter((a) => a.type === "PRIEDAI")

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
                      variant={newAddon.type === "OPTION" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setNewAddon({ ...newAddon, type: "OPTION" })}
                    >
                      Pasirinkimas
                    </Button>
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

                <Button onClick={handleAddNewAddon} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Pridėti
                </Button>
              </CardContent>
            </Card>

            {/* Pasirinkimas */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Pasirinkimas</h3>
              {pasirinkimas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Pasirinkimų nėra
                </p>
              ) : (
                <div className="space-y-2">
                  {pasirinkimas.map((addon) => (
                    <Card key={addon.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{addon.name}</p>
                          <p className="text-sm text-muted-foreground">
                            €{Number(addon.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" className="p-2 hover:bg-muted rounded-full transition" size="icon" onClick={() => handleStartEdit(addon)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={Boolean(addon.enabled)}
                            onCheckedChange={() => toggleAddon(addon.id, addon.enabled)}
                          />
                          <Button
                            variant="ghost"
                            className="p-2 hover:bg-destructive/20 rounded-full transition"
                            size="icon"
                            onClick={() => handleDeleteClick(addon)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="h-1" />

            {/* Papildomos Paslaugos */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Papildomos Paslaugos</h3>
              {papildomosPaslaugos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Papildomų paslaugų nėra
                </p>
              ) : (
                <div className="space-y-2">
                  {papildomosPaslaugos.map((addon) => (
                    <Card key={addon.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{addon.name}</p>
                          <p className="text-sm text-muted-foreground">
                            €{Number(addon.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" className="p-2 hover:bg-muted rounded-full transition" size="icon" onClick={() => handleStartEdit(addon)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={Boolean(addon.enabled)}
                            onCheckedChange={() => toggleAddon(addon.id, addon.enabled)}
                          />
                          <Button
                            variant="ghost"
                            className="p-2 hover:bg-destructive/20 rounded-full transition"
                            size="icon"
                            onClick={() => handleDeleteClick(addon)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="h-1" />

            {/* Priedai */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Priedai</h3>
              {priedai.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Priedų nėra</p>
              ) : (
                <div className="space-y-2">
                  {priedai.map((addon) => (
                    <Card key={addon.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{addon.name}</p>
                          <p className="text-sm text-muted-foreground">
                            €{Number(addon.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" className="p-2 hover:bg-muted rounded-full transition" size="icon" onClick={() => handleStartEdit(addon)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={Boolean(addon.enabled)}
                            onCheckedChange={() => toggleAddon(addon.id, addon.enabled)}
                          />
                          <Button
                            variant="ghost"
                            className="p-2 hover:bg-destructive/20 rounded-full transition"
                            size="icon"
                            onClick={() => handleDeleteClick(addon)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
            <Button variant="outline" onClick={cancelDelete}>
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