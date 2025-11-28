"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import ServiceCard from "@/components/dashboard/change-services/ServiceCard"
import ServiceSheet from "@/components/dashboard/change-services/ServiceSheet"
import AddServiceSheet from "@/components/dashboard/change-services/AddServiceSheet"
import EditAddonDialog from "@/components/dashboard/change-services/EditAddonDialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Service, ServiceAddon, NewAddon } from "@/components/dashboard/change-services/types"

// --- Component ---
export default function ChangeServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // currently opened service (shown in right sheet)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // serviceToEdit controls AddServiceSheet: when null -> CREATE, when Service -> EDIT
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)
  const [addServiceSheetOpen, setAddServiceSheetOpen] = useState(false)

  // addon edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null)

  // form for new addon inside ServiceSheet
  const [newAddon, setNewAddon] = useState<NewAddon>({
    name: "",
    type: "PAPILDOMA_PASLAUGA",
    price: 0,
  })

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  // --- Fetch services (returns data so callers can use it) ---
  const fetchServices = async (): Promise<Service[]> => {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/services")
      const data: Service[] = await res.json()
      // keep alphabetical order (safe-guard if name missing)
      const sorted = data.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
      setServices(sorted)
      return sorted
    } catch (error) {
      console.error("Error fetching services:", error)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // --- Toggle service ---
  const toggleService = async (serviceId: string, enabled: boolean) => {
    await fetch(`/api/dashboard/services/${serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    })

    // refresh list and update selectedService if needed
    const all = await fetchServices()
    if (selectedService) {
      const updated = all.find((s) => s.id === selectedService.id) ?? null
      setSelectedService(updated)
      if (!updated) setSheetOpen(false)
    }
  }

  // --- Delete service ---
  const requestDeleteService = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return
    try {
      await fetch(`/api/dashboard/services/${serviceToDelete.id}`, {
        method: "DELETE",
      })
      setDeleteDialogOpen(false)
      // refresh services; note: we don't assign to 'all' because we don't need it here
      await fetchServices()
      // clear selection if deleted item was selected
      if (selectedService?.id === serviceToDelete.id) {
        setSelectedService(null)
        setSheetOpen(false)
      }
      setServiceToDelete(null)
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  // --- Add new addon ---
  const addNewAddon = async () => {
    if (!selectedService) return
    if (!newAddon.name || newAddon.price < 0) {
      alert("Įveskite teisingą pavadinimą ir kainą")
      return
    }

    try {
      await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddon),
      })
      // reset form
      setNewAddon({ name: "", type: "PAPILDOMA_PASLAUGA", price: 0 })
      // refresh and update selectedService so sheet shows new addon instantly
      const all = await fetchServices()
      setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
    } catch (error) {
      console.error("Error adding addon:", error)
    }
  }

  // --- Toggle addon ---
  const toggleAddon = async (addonId: string, enabled: boolean) => {
    if (!selectedService) return
    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addonId, enabled: !enabled }),
    })
    // refresh and update selectedService so sheet shows new state instantly
    const all = await fetchServices()
    setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
  }

  // --- Delete addon ---
  const deleteAddon = async (addonId: string) => {
    if (!selectedService) return

    // Optimistically remove addon from local state
    setSelectedService({
      ...selectedService,
      addons: selectedService.addons.filter((a) => a.id !== addonId),
    })

    try {
      await fetch(`/api/dashboard/services/${selectedService.id}/addons?addonId=${addonId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      // Refresh services list
      const all = await fetchServices()
      setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
    } catch (error) {
      console.error("Error deleting addon:", error)
      // If delete fails, revert local state (simple approach: re-fetch)
      fetchServices()
    }
  }

  // --- Edit addon ---
  const openEditDialog = (addon: ServiceAddon) => {
    setEditingAddon(addon)
    setEditDialogOpen(true)
  }

  const saveAddonEdit = async (name: string, price: number) => {
    if (!editingAddon || !selectedService) return
    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addonId: editingAddon.id, name, price }),
    })
    setEditDialogOpen(false)
    setEditingAddon(null)
    // refresh and update selectedService
    const all = await fetchServices()
    setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
  }

  if (loading) return <div className="text-foreground">Kraunamos paslaugos...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Keisti paslaugas</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchServices}>
            <RefreshCw className="h-4 w-4 mr-2" /> Atnaujinti
          </Button>

          <Button
            variant="default"
            onClick={() => {
              // ensure sheet opens in CREATE mode
              setServiceToEdit(null)
              setAddServiceSheetOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Pridėti paslaugą
          </Button>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onToggleService={toggleService}
            onOpenService={(s) => {
              setSelectedService(s)
              setSheetOpen(true)
            }}
            onEdit={(s) => {
              setServiceToEdit(s)
              setAddServiceSheetOpen(true)
            }}
            onDelete={requestDeleteService}
          />
        ))}
      </div>

      {/* Delete Dialog */}
      {serviceToDelete && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ištrinti paslaugą</DialogTitle>
              <DialogDescription>
                Ar tikrai norite ištrinti <b>{serviceToDelete.name}</b>? <br />
                Ši paslauga turi <b>{serviceToDelete.addons.length} papildomų paslaugų/priedų</b> ir jos bus ištrintos taip pat.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Atšaukti</Button>
              <Button variant="destructive" onClick={confirmDeleteService}>Ištrinti viską</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Selected service sheet */}
      {selectedService && (
        <ServiceSheet
          service={selectedService}
          open={sheetOpen}
          onOpenChange={(v) => {
            setSheetOpen(v)
            if (!v) setSelectedService(null)
          }}
          newAddon={newAddon}
          setNewAddon={setNewAddon}
          addNewAddon={addNewAddon}
          toggleAddon={toggleAddon}
          deleteAddon={deleteAddon}
          onEditAddon={openEditDialog}
        />
      )}

      {/* Edit addon dialog */}
      <EditAddonDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} addon={editingAddon} onSave={saveAddonEdit} />

      {/* Add / Edit Service sheet */}
      <AddServiceSheet
        open={addServiceSheetOpen}
        onOpenChange={(v) => {
          // clear edit payload when closing so next open is fresh
          if (!v) setServiceToEdit(null)
          setAddServiceSheetOpen(v)
        }}
        onServiceSaved={async () => {
          // refresh services and clear edit state
          const all = await fetchServices()
          setServiceToEdit(null)
          // if a service was being edited and it was selected in sheet, update selectedService
          if (selectedService) {
            setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
          }
        }}
        serviceToEdit={serviceToEdit}
      />
    </div>
  )
}