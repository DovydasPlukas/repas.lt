"use client"
/* eslint-disable */

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  Euro,
  ShoppingCart,
  CircleDotDashed,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Truck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderItem {
  id: string
  name: string
  serviceId: string
  price: number
  addons?: { id: string; name: string; price: number }[]
  service?: { id: string; name: string } | null
  specialRequirements?: string | null
}

interface OrderSnap {
  firstName: string
  lastName: string
  street: string
  apartment?: string
  floor?: string
  phone: string
  email: string
  notes?: string
  latitude?: number
  longitude?: number
}

interface Order {
  id: string
  orderNumber: string
  customer: string
  email: string
  phone?: string
  totalAmount: number
  status: string
  pickupDateTime: string
  deliveryDateTime: string
  isPickedUp: boolean
  isDelivered: boolean
  items: OrderItem[]
  snap?: OrderSnap
  address?: string
  snapNotes?: string
}

interface Stats {
  totalOrders: number
  newOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  upcomingPickups: Order[]
  upcomingDeliveries: Order[]
  overdueOrders: Order[]
}

const statusOptions = [
  { value: "NEW", label: "Naujas" },
  { value: "PENDING", label: "Laukiantis" },
  { value: "COMPLETED", label: "Užbaigtas" },
  { value: "CANCELLED", label: "Atšauktas" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "NEW":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

function formatTimeLeft(targetDate: string): { text: string; isUrgent: boolean; isOverdue: boolean } {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { text: "Pradelsta!", isUrgent: true, isOverdue: true }
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours < 1) {
    return { text: `${minutes}min`, isUrgent: true, isOverdue: false }
  }

  return { text: `${hours}h ${minutes}m`, isUrgent: hours < 2, isOverdue: false }
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/* -------------------------
   CountdownBadge component
   ------------------------- */
function CountdownBadge({ targetDate, isDone, label }: { targetDate: string; isDone?: boolean; label?: string }) {
  if (isDone) {
    return (
      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
        <CheckCircle2 className="h-3 w-3 mr-1 inline-block" />
        {label || "Atlikta"}
      </Badge>
    )
  }

  const info = formatTimeLeft(targetDate)
  return (
    <Badge
      variant={info.isOverdue ? "destructive" : "secondary"}
      className={`mt-2 ${info.isUrgent && !info.isOverdue ? "bg-orange-100 text-orange-800" : ""}`}
    >
      {info.isOverdue && <AlertTriangle className="h-3 w-3 mr-1 inline-block" />}
      {info.text}
    </Badge>
  )
}

/* -------------------------
   DialogOrders (inlined)
   ------------------------- */
type DialogOrdersProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOrder: Order | null
  services?: Map<string, { id: string; name: string }>
}

function DialogOrders({ open, onOpenChange, selectedOrder, services }: DialogOrdersProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Užsakymo apžvalga</DialogTitle>
          <DialogDescription>Greita užsakymo informacija</DialogDescription>
        </DialogHeader>

        {selectedOrder ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Užsakymo numeris</p>
                <p className="text-sm font-bold">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Klientas</p>
                <p className="text-sm">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">El. paštas</p>
                <p className="text-sm">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefonas</p>
                <p className="text-sm">{selectedOrder.phone || "Nėra"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Adresas</p>
                <p className="text-sm">{selectedOrder.address || selectedOrder.snap?.street || "Nėra"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bendra suma</p>
                <p className="text-sm font-bold text-green-600">€{Number(selectedOrder.totalAmount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Būsena</p>
                <Badge className={getStatusColor(selectedOrder.status)} variant="secondary">
                  {statusOptions.find((s) => s.value === selectedOrder.status)?.label}
                </Badge>
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4" />
                  <p className="text-sm font-medium">Paėmimo laikas</p>
                </div>
                <p className="text-sm">{new Date(selectedOrder.pickupDateTime).toLocaleString("lt-LT")}</p>
                <div className="mt-2">
                  <CountdownBadge targetDate={selectedOrder.pickupDateTime} isDone={selectedOrder.isPickedUp} label="Paimta" />
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4" />
                  <p className="text-sm font-medium">Pristatymo laikas</p>
                </div>
                <p className="text-sm">{new Date(selectedOrder.deliveryDateTime).toLocaleString("lt-LT")}</p>
                <div className="mt-2">
                  <CountdownBadge targetDate={selectedOrder.deliveryDateTime} isDone={selectedOrder.isDelivered} label="Pristatyta" />
                </div>
              </div>
            </div>

            {/* Services with addons */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Paslaugos</p>
              <div className="space-y-3">
                {(selectedOrder.items || []).map((item) => (
                  <div key={item.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <Badge>{item.service?.name || services?.get(item.serviceId)?.name || item.name}</Badge>
                      <span className="font-medium">€{Number(item.price || 0).toFixed(2)}</span>
                    </div>

                    {(item.addons && item.addons.length > 0) && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Priedai:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.addons!.map((addon) => (
                            <Badge key={addon.id} variant="outline" className="text-xs">
                              {addon.name} (+€{Number(addon.price || 0).toFixed(2)})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.specialRequirements && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Specialūs reikalavimai:</p>
                        <p className="text-sm">{item.specialRequirements}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special notes */}
            {(selectedOrder.snapNotes || selectedOrder.snap?.notes) && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pastabos</p>
                <p className="text-sm p-2 bg-muted rounded-md">{selectedOrder.snapNotes || selectedOrder.snap?.notes}</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Uždaryti
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">Nėra pasirinkto užsakymo</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------
   Overview component
   ------------------------- */
export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [newOrders, setNewOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [missedDialogOpen, setMissedDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("today")
  const [services, setServices] = useState<Map<string, { id: string; name: string }>>(new Map())

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, servicesRes] = await Promise.all([
        fetch("/api/dashboard/order/stats"),
        fetch("/api/dashboard/order?status=NEW&limit=5"),
        fetch("/api/dashboard/services"),
      ])

      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()
      const servicesData = await servicesRes.json()

      setStats(statsData)
      setNewOrders(ordersData.orders || [])
      const servicesMap = new Map<string, { id: string; name: string }>(
        (servicesData.services ?? []).map((s: { id: string; name: string }) => [s.id, s]),
      )
      setServices(servicesMap)
    } catch (error) {
      console.error("Error fetching overview data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Apžvalga</h2>
          <p className="text-muted-foreground mt-2">Sveiki atvykę į administratoriaus valdymo skydą.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Viso užsakymų",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Laukiantys užsakymai",
      value: stats?.pendingOrders || 0,
      icon: CircleDotDashed,
      color: "text-yellow-600",
    },
    {
      title: "Nauji užsakymai",
      value: stats?.newOrders || 0,
      icon: Activity,
      color: "text-orange-600",
    },
    {
      title: "Užbaigti užsakymai",
      value: stats?.completedOrders || 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Atšaukti užsakymai",
      value: stats?.cancelledOrders || 0,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Bendra pajamų suma",
      value: `€${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: Euro,
      color: "text-purple-600",
    },
  ]

  // Combine upcoming pickups and deliveries, but FILTER based on selectedDate before slicing
  const combinedUpcoming = [
    ...(stats?.upcomingPickups || []).map((o) => ({ ...o, type: "pickup" as const })),
    ...(stats?.upcomingDeliveries || []).map((o) => ({ ...o, type: "delivery" as const })),
  ].sort((a, b) => {
    const aTime = a.type === "pickup" ? new Date(a.pickupDateTime).getTime() : new Date(a.deliveryDateTime).getTime()
    const bTime = b.type === "pickup" ? new Date(b.pickupDateTime).getTime() : new Date(b.deliveryDateTime).getTime()
    return aTime - bTime
  })

  const filterBySelectedDate = (order: (Order & { type: "pickup" | "delivery" })) => {
    if (selectedDate === "all") return true

    const targetTime = order.type === "pickup" ? new Date(order.pickupDateTime) : new Date(order.deliveryDateTime)

    const today = new Date()
    // Normalize to local date components
    if (selectedDate === "today") {
      return isSameDate(targetTime, today)
    }

    if (selectedDate === "tomorrow") {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return isSameDate(targetTime, tomorrow)
    }

    if (selectedDate === "thisWeek") {
      // define startOfWeek as Monday (ISO-like). If you prefer Sunday, change getDay logic.
      const day = today.getDay() // 0 (Sun) - 6 (Sat)
      const diffToMonday = (day + 6) % 7 // 0->6, 1->0 (Mon), ...
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - diffToMonday)
      startOfWeek.setHours(0, 0, 0, 0)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 7)
      endOfWeek.setHours(0, 0, 0, 0)
      return targetTime >= startOfWeek && targetTime < endOfWeek
    }

    return true
  }

  // Apply filter then take top 5
  const upcomingTimes = combinedUpcoming.filter(filterBySelectedDate).slice(0, 5)

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order)
    setOrderDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Apžvalga</h2>
        <p className="text-muted-foreground mt-2">Sveiki atvykę į administratoriaus valdymo skydą.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* New Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Nauji užsakymai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm">Naujų užsakymų nėra</p>
              ) : (
                newOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item) => (
                          <Badge key={item.id} variant="secondary" className="text-xs">
                            {services.get(item.serviceId)?.name || item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOrderDialog(order)}
                      className="flex-shrink-0 ml-2"
                    >
                      Peržiūrėti
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Times */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Artėjantys laikai
            </CardTitle>
            {(stats?.overdueOrders?.length || 0) > 0 && (
              <Button variant="destructive" size="sm" onClick={() => setMissedDialogOpen(true)}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                Pradelsti ({stats?.overdueOrders?.length})
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pasirinkite datą" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Visi</SelectItem>
                  <SelectItem value="today">Šiandien</SelectItem>
                  <SelectItem value="tomorrow">Rytoj</SelectItem>
                  <SelectItem value="thisWeek">Ši savaitė</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3">
                {upcomingTimes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Artėjančių laikų nėra</p>
                ) : (
                  upcomingTimes.map((order) => {
                    const targetTime = order.type === "pickup" ? order.pickupDateTime : order.deliveryDateTime
                    const timeInfo = formatTimeLeft(targetTime)
                    return (
                      <div
                        key={`${order.id}-${order.type}`}
                        className="flex items-center justify-between border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
                        onClick={() => openOrderDialog(order)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`p-2 rounded-full flex-shrink-0 ${order.type === "pickup" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"}`}
                          >
                            {order.type === "pickup" ? (
                              <Package className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Truck className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {order.type === "pickup" ? "Paėmimas" : "Pristatymas"} - {order.customer}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={timeInfo.isOverdue ? "destructive" : "secondary"}
                          className={`flex-shrink-0 ml-2 ${timeInfo.isUrgent && !timeInfo.isOverdue ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" : ""}`}
                        >
                          {timeInfo.isOverdue && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {timeInfo.text}
                        </Badge>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Dialog (inlined component) */}
      <DialogOrders open={orderDialogOpen} onOpenChange={setOrderDialogOpen} selectedOrder={selectedOrder} services={services} />

      {/* Missed Orders Dialog */}
      <Dialog open={missedDialogOpen} onOpenChange={setMissedDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pradelsti užsakymai</DialogTitle>
            <DialogDescription>Užsakymai su praleistais paėmimo ar pristatymo laikais</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {(stats?.overdueOrders || []).length === 0 ? (
              <p className="text-muted-foreground text-sm">Nėra pradelstų užsakymų</p>
            ) : (
              (stats?.overdueOrders || []).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    openOrderDialog(order)
                    setMissedDialogOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="flex-shrink-0 ml-2">
                    Pradelsta
                  </Badge>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMissedDialogOpen(false)}>
              Uždaryti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}