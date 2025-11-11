"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Plus, Trash2 } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: string
  enabled: boolean
}

export default function ChangeServices() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "...",
      description: "...",
      price: "...",
      enabled: true,
    },
    {
      id: "2",
      name: "...",
      description: "...",
      price: "...",
      enabled: true,
    },
    {
      id: "3",
      name: "...",
      description: "...",
      price: "...",
      enabled: false,
    },
  ])

  const toggleService = (id: string) => {
    setServices(services.map((service) => (service.id === id ? { ...service, enabled: !service.enabled } : service)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Change Services</h2>
          <p className="text-muted-foreground mt-2">Configure and manage your service offerings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
                <Switch checked={service.enabled} onCheckedChange={() => toggleService(service.id)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`service-name-${service.id}`}>Service Name</Label>
                  <Input
                    id={`service-name-${service.id}`}
                    defaultValue={service.name}
                    placeholder="Enter service name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-price-${service.id}`}>Price</Label>
                  <Input id={`service-price-${service.id}`} defaultValue={service.price} placeholder="$0.00" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`service-desc-${service.id}`}>Description</Label>
                  <Input
                    id={`service-desc-${service.id}`}
                    defaultValue={service.description}
                    placeholder="Enter service description"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="destructive" className="ml-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Service
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
