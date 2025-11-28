"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Service, ServiceAddon } from "@/components/dashboard/change-services/types"

interface ServiceCardProps {
  service: Service
  onToggleService: (id: string, enabled: boolean) => void
  onOpenService: (service: Service) => void
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
}

export default function ServiceCard({
  service,
  onToggleService,
  onOpenService,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const papildomosPaslaugos = (s: Service) =>
    s.addons.filter((addon: ServiceAddon) => addon.type === "PAPILDOMA_PASLAUGA")

  const priedai = (s: Service) =>
    s.addons.filter((addon: ServiceAddon) => addon.type === "PRIEDAI")

  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader onClick={() => onOpenService(service)}>
        <div className="flex items-center justify-between">
          {/* Service info */}
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {service.name}
              {!service.enabled && <Badge variant="secondary">Išjungta</Badge>}
            </CardTitle>

            <CardDescription className="mt-1">
              {service.description || "Aprašymo nėra"}
            </CardDescription>

            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {papildomosPaslaugos(service).length} papildomos paslaugos
              </Badge>
              <Badge variant="outline" className="text-xs">
                {priedai(service).length} priedai
              </Badge>
            </div>
          </div>

          {/* Action buttons + switch */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Edit button */}
            <button
              onClick={() => onEdit(service)}
              className="p-2 hover:bg-muted rounded-full transition"
              title="Redaguoti paslaugą"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Delete button */}
            <button
              onClick={() => onDelete(service)}
              className="p-2 hover:bg-destructive/20 rounded-full transition"
              title="Ištrinti paslaugą"
            >
              <Trash className="w-4 h-4 text-destructive" />
            </button>

            {/* Toggle switch */}
            <Switch
              checked={service.enabled}
              onCheckedChange={() => onToggleService(service.id, service.enabled)}
            />

            {/* Chevron */}
            <ChevronRight className="h-5 w-5 text-muted-foreground" onClick={() => onOpenService(service)}/>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}