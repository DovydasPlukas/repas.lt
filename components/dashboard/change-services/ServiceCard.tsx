"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Service, ServiceAddon } from "@/components/dashboard/change-services/types"

interface ServiceCardProps {
  service: Service
  onToggleService: (id: string, enabled: boolean) => void
  onOpenService: (service: Service) => void
}

export default function ServiceCard({ service, onToggleService, onOpenService }: ServiceCardProps) {
  const papildomosPaslaugos = (service: Service) =>
    service.addons.filter((addon: ServiceAddon) => addon.type === "PAPILDOMA_PASLAUGA")

  const priedai = (service: Service) =>
    service.addons.filter((addon: ServiceAddon) => addon.type === "PRIEDAI")

  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader onClick={() => onOpenService(service)}>
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-3">
            <Switch
              checked={service.enabled}
              onCheckedChange={() => onToggleService(service.id, service.enabled)}
              onClick={(e) => e.stopPropagation()}
            />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
