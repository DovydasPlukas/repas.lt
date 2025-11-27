"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"

import ServiceCard from "@/components/dashboard/change-services/ServiceCard"
import ServiceSheet from "@/components/dashboard/change-services/ServiceSheet"
import AddServiceSheet from "@/components/dashboard/change-services/AddServiceSheet"
import EditAddonDialog from "@/components/dashboard/change-services/EditAddonDialog"

// --- Types ---
type AddonType = "PAPILDOMA_PASLAUGA" | "PRIEDAI"

interface ServiceAddon {
  id: string
  name: string
  type: AddonType
  price: number
  enabled: boolean
}

interface Service {
  id: string
  name: string
  description: string | null
  enabled: boolean
  addons: ServiceAddon[]
}

interface NewAddon {
  name: string
  type: AddonType
  price: number
}

// API fetch types
interface ApiAddon {
  id: string
  name: string
  type: string
  price: string | number
  enabled: boolean
}

interface ApiService {
  id: string
  name: string
  description: string | null
  enabled: boolean
  addons: ApiAddon[]
}

// --- Component ---
export default function ChangeServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null)
  const [newAddon, setNewAddon] = useState<NewAddon>({
    name: "",
    type: "PAPILDOMA_PASLAUGA",
    price: 0,
  })
  const [addServiceSheetOpen, setAddServiceSheetOpen] = useState(false)

  // --- Fetch services from API ---
  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/services")
      const data: ApiService[] = await res.json()

      // Normalize API data to proper types
      const normalized: Service[] = data.map((service) => ({
        ...service,
        addons: service.addons.map((addon) => ({
          ...addon,
          type: addon.type as AddonType,
          price: Number(addon.price),
        })),
      }))

      setServices(normalized)
    } catch (error) {
      console.error("Error fetching services:", error)
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
    fetchServices()
  }

  // --- Toggle addon ---
  const toggleAddon = async (addonId: string, enabled: boolean) => {
    if (!selectedService) return
    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addonId, enabled: !enabled }),
    })
    fetchServices()
  }

  // --- Delete addon ---
  const deleteAddon = async (addonId: string) => {
    if (!selectedService) return
    if (!confirm("Ar tikrai norite ištrinti šią papildomą paslaugą?")) return

    await fetch(
      `/api/dashboard/services/${selectedService.id}/addons?addonId=${addonId}`,
      { method: "DELETE" }
    )
    fetchServices()
  }

  // --- Open edit dialog ---
  const openEditDialog = (addon: ServiceAddon) => {
    setEditingAddon(addon)
    setEditDialogOpen(true)
  }

  // --- Save addon edit ---
  const saveAddonEdit = async (name: string, price: number) => {
    if (!editingAddon || !selectedService) return
    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addonId: editingAddon.id, name, price }),
    })
    setEditDialogOpen(false)
    fetchServices()
  }

  // --- Add new addon ---
  const addNewAddon = async () => {
    if (!selectedService || !newAddon.name) return

    await fetch(`/api/dashboard/services/${selectedService.id}/addons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddon),
    })
    setNewAddon({ name: "", type: "PAPILDOMA_PASLAUGA", price: 0 })
    fetchServices()
  }

  if (loading) return <div className="text-foreground">Kraunamos paslaugos...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Keisti paslaugas
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchServices}>
            <RefreshCw className="h-4 w-4 mr-2" /> Atnaujinti
          </Button>
          <Button variant="default" onClick={() => setAddServiceSheetOpen(true)}>
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
          />
        ))}
      </div>

      {/* Selected service sheet */}
      {selectedService && (
        <ServiceSheet
          service={selectedService}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          newAddon={newAddon}
          setNewAddon={setNewAddon}
          addNewAddon={addNewAddon}
          toggleAddon={toggleAddon}
          deleteAddon={deleteAddon}
          openEditDialog={openEditDialog}
        />
      )}

      {/* Edit addon dialog */}
      <EditAddonDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        addon={editingAddon}
        onSave={saveAddonEdit}
      />

      {/* Add service sheet */}
      <AddServiceSheet
        open={addServiceSheetOpen}
        onOpenChange={setAddServiceSheetOpen}
        onServiceAdded={fetchServices}
      />
    </div>
  )
}