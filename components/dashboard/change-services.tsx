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
import { Service, ServiceAddon, NewAddon, OptionPricingType, RangeInterval } from "@/components/dashboard/change-services/types"

export default function ChangeServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)
  const [addServiceSheetOpen, setAddServiceSheetOpen] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  // Fetch services 
  const fetchServices = async (): Promise<Service[]> => {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/services")
      const data: Service[] = await res.json()
      const sorted = data.sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
      setServices(sorted)
      return sorted
    } catch (error) {
      console.error("Error fetching services:", error)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  // Toggle service
  const toggleService = async (serviceId: string, enabled: boolean) => {
    await fetch(`/api/dashboard/services/${serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    })
    const all = await fetchServices()
    if (selectedService) {
      const updated = all.find((s) => s.id === selectedService.id) ?? null
      setSelectedService(updated)
      if (!updated) setSheetOpen(false)
    }
  }

  // Delete service
  const requestDeleteService = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return
    try {
      await fetch(`/api/dashboard/services/${serviceToDelete.id}`, { method: "DELETE" })
      setDeleteDialogOpen(false)
      await fetchServices()
      if (selectedService?.id === serviceToDelete.id) {
        setSelectedService(null)
        setSheetOpen(false)
      }
      setServiceToDelete(null)
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  // Add new addon (accepts full NewAddon from ServiceSheet)
  const addNewAddon = async (addonData: NewAddon) => {
    if (!selectedService) return
    try {
      await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addonData),
      })
      const all = await fetchServices()
      setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
    } catch (error) {
      console.error("Error adding addon:", error)
    }
  }

  // Toggle addon
  const toggleAddon = async (addonId: string, enabled: boolean) => {
    if (!selectedService) return
    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addonId, enabled: !enabled }),
    })
    const all = await fetchServices()
    setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
  }

  // Delete addon
  const deleteAddon = async (addonId: string) => {
    if (!selectedService) return
    setSelectedService({
      ...selectedService,
      addons: selectedService.addons.filter((a) => a.id !== addonId),
    })
    try {
      await fetch(`/api/dashboard/services/${selectedService.id}/addons?addonId=${addonId}`, {
        method: "DELETE",
      })
      const all = await fetchServices()
      setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
    } catch (error) {
      console.error("Error deleting addon:", error)
      fetchServices()
    }
  }

  //  Edit addon
  const openEditDialog = (addon: ServiceAddon) => {
    setEditingAddon(addon)
    setEditDialogOpen(true)
  }

  // NOTE: EditAddonDialog's onSave also needs to accept optionPricingType and ranges
  // to fully support RANGE/QUANTITY editing. Update EditAddonDialog accordingly.
  const saveAddonEdit = async (
    name: string,
    price: number,
    optionPricingType?: OptionPricingType,
    ranges?: RangeInterval[]
  ) => {
    if (!editingAddon || !selectedService) return
    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addonId: editingAddon.id,
        name,
        price,
        ...(optionPricingType ? { optionPricingType } : {}),
        ...(ranges ? { ranges } : {}),
      }),
    })
    setEditDialogOpen(false)
    setEditingAddon(null)
    const all = await fetchServices()
    setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
  }

  if (loading) return <div className="text-foreground">Kraunamos paslaugos...</div>

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, serviceId: string) => {
    setDraggedItem(serviceId)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent, targetServiceId: string) => {
    e.preventDefault()
    setIsDragging(false)
    if (!draggedItem || draggedItem === targetServiceId) { setDraggedItem(null); return }

    const draggedIndex = services.findIndex((s) => s.id === draggedItem)
    const targetIndex = services.findIndex((s) => s.id === targetServiceId)
    if (draggedIndex === -1 || targetIndex === -1) { setDraggedItem(null); return }

    const newServices = [...services]
    const [draggedService] = newServices.splice(draggedIndex, 1)
    newServices.splice(targetIndex, 0, draggedService)
    const updatedServices = newServices.map((service, index) => ({ ...service, position: index }))

    setServices(updatedServices)
    setDraggedItem(null)

    try {
      await fetch("/api/dashboard/services/positions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: updatedServices.map((s) => ({ id: s.id, position: s.position })) }),
      })
    } catch (error) {
      console.error("Error updating service positions:", error)
      await fetchServices()
    }

    if (selectedService?.id === draggedItem) {
      setSelectedService(updatedServices.find((s) => s.id === draggedItem) ?? null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Keisti paslaugas</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchServices}>
            <RefreshCw className="h-4 w-4 mr-2" /> Atnaujinti
          </Button>
          <Button variant="default" onClick={() => { setServiceToEdit(null); setAddServiceSheetOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" /> Pridėti paslaugą
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            draggable
            onDragStart={(e) => handleDragStart(e, service.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, service.id)}
            onDragEnd={handleDragEnd}
            className={`transition-opacity ${draggedItem === service.id ? "opacity-50" : ""} ${isDragging ? "cursor-move" : ""}`}
          >
            <ServiceCard
              service={service}
              isDragging={draggedItem === service.id}
              onToggleService={toggleService}
              onOpenService={(s) => { setSelectedService(s); setSheetOpen(true) }}
              onEdit={(s) => { setServiceToEdit(s); setAddServiceSheetOpen(true) }}
              onDelete={requestDeleteService}
            />
          </div>
        ))}
      </div>

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

      {selectedService && (
        <ServiceSheet
          service={selectedService}
          open={sheetOpen}
          onOpenChange={(v) => { setSheetOpen(v); if (!v) setSelectedService(null) }}
          addNewAddon={addNewAddon}
          toggleAddon={toggleAddon}
          deleteAddon={deleteAddon}
          onEditAddon={openEditDialog}
        />
      )}

      <EditAddonDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        addon={editingAddon}
        onSave={saveAddonEdit}
      />

      <AddServiceSheet
        open={addServiceSheetOpen}
        onOpenChange={(v) => { if (!v) setServiceToEdit(null); setAddServiceSheetOpen(v) }}
        onServiceSaved={async () => {
          const all = await fetchServices()
          setServiceToEdit(null)
          if (selectedService) setSelectedService(all.find((s) => s.id === selectedService.id) ?? null)
        }}
        serviceToEdit={serviceToEdit}
      />
    </div>
  )
}