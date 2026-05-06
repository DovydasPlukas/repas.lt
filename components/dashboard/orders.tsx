"use client"

/* eslint-disable */

import { useEffect, useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Trash,
  RefreshCw,
  MapPin,
  Settings2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Truck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import MapComponent from "@/components/map/dashboard-map-component"

interface OrderAddon {
  id: string
  name: string
  price: number
}

interface OrderService {
  id: string
  name: string
  description?: string
}

interface OrderItem {
  id: string
  name: string
  serviceId: string
  service?: OrderService
  quantity: number
  price: number
  specialRequirements?: string
  addons: OrderAddon[]
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
  address?: string
  serviceType: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
  pickupDateTime: string
  deliveryDateTime: string
  isPickedUp: boolean
  isDelivered: boolean
  snapNotes?: string
  paymentMethod?: string
  snap: OrderSnap
}

const statusOptions = [
  { value: "NEW", label: "Naujas" },
  { value: "PENDING", label: "Laukiantis" },
  { value: "COMPLETED", label: "Užbaigtas" },
  { value: "CANCELLED", label: "Atšauktas" },
]

type ColumnKey =
  | "orderNumber"
  | "customer"
  | "serviceType"
  | "totalAmount"
  | "status"
  | "paymentMethod"
  | "pickupTime"
  | "deliveryTime"
  | "actions"

const allColumns: { key: ColumnKey; label: string }[] = [
  { key: "orderNumber", label: "Užsakymo ID" },
  { key: "customer", label: "Klientas" },
  { key: "serviceType", label: "Paslaugos" },
  { key: "totalAmount", label: "Suma" },
  { key: "status", label: "Būsena" },
  { key: "paymentMethod", label: "Mokėjimas" },
  { key: "pickupTime", label: "Paėmimas" },
  { key: "deliveryTime", label: "Pristatymas" },
  { key: "actions", label: "Veiksmai" },
]

const defaultColumns: ColumnKey[] = [
  "orderNumber",
  "customer",
  "serviceType",
  "totalAmount",
  "status",
  "paymentMethod",
  "pickupTime",
  "deliveryTime",
  "actions",
]

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
    isOverdue: boolean
  } | null>(null)

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null)
      return
    }

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime()
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, isOverdue: true }
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return { hours, minutes, seconds, isOverdue: false }
    }

    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

function CountdownBadge({ targetDate, isDone, label }: { targetDate: string; isDone: boolean; label: string }) {
  const timeLeft = useCountdown(isDone ? null : targetDate)

  if (isDone) {
    return (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  if (!timeLeft) return null

  if (timeLeft.isOverdue) {
    return (
      <Badge variant="destructive" className="animate-pulse whitespace-nowrap">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Pradelsta!
      </Badge>
    )
  }

  const isUrgent = timeLeft.hours < 1
  const badgeClass = isUrgent
    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"

  const timeStr = `${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`

  return (
    <Badge variant="secondary" className={`${badgeClass} whitespace-nowrap font-mono min-w-[90px] justify-center`}>
      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
      {timeStr}
    </Badge>
  )
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  // Dialogs
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [massDeleteDialogOpen, setMassDeleteDialogOpen] = useState(false)

  // Mass selection
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [massStatusDialogOpen, setMassStatusDialogOpen] = useState(false)
  const [newMassStatus, setNewMassStatus] = useState("")

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("")
  const [timeFilter, setTimeFilter] = useState("")

  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(new Set(defaultColumns))

  const observerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fetchOrders = useCallback(
    async (reset = false) => {
      if (reset) {
        setLoading(true)
        setOrders([])
      } else {
        setLoadingMore(true)
      }

      try {
        const params = new URLSearchParams()
        if (statusFilter !== "ALL") params.set("status", statusFilter)
        if (searchTerm) params.set("search", searchTerm)
        if (dateFilter) params.set("dateFilter", dateFilter)
        if (timeFilter) params.set("timeFilter", timeFilter)
        params.set("limit", "20")
        params.set("offset", reset ? "0" : String(orders.length))

        const res = await fetch(`/api/dashboard/order?${params.toString()}`)
        const data = await res.json()

        if (reset) {
          setOrders(data.orders || [])
        } else {
          setOrders((prev) => [...prev, ...(data.orders || [])])
        }
        setTotal(data.total || 0)
        setHasMore(data.hasMore || false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast.error("Nepavyko užkrauti užsakymų")
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [statusFilter, searchTerm, dateFilter, timeFilter, orders.length],
  )

  useEffect(() => {
    fetchOrders(true)
  }, [statusFilter, dateFilter, timeFilter])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(true)
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // Infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !loadingMore && !loading) {
        fetchOrders(false)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [hasMore, loadingMore, loading, fetchOrders])

  const getStatusColor = (status: string) => {
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

  const getPaymentMethodBadge = (method?: string) => {
    if (method === "PAID") {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Sumokėta
        </Badge>
      )
    } else if (method === "UNPAID") {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
          Nesumokėta
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Klaida
      </Badge>
    )
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/dashboard/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: [orderId], status: newStatus }),
      })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      toast.success("Būsena atnaujinta")
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Nepavyko atnaujinti būsenos")
    }
  }

  const handleTogglePickup = async (orderId: string, isPickedUp: boolean) => {
    try {
      await fetch(`/api/dashboard/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: [orderId], isPickedUp }),
      })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, isPickedUp } : o)))
      toast.success(isPickedUp ? "Pažymėta kaip paimta" : "Paėmimo žymėjimas pašalintas")
    } catch (error) {
      console.error("Error updating pickup status:", error)
      toast.error("Nepavyko atnaujinti paėmimo būsenos")
    }
  }

  const handleToggleDelivery = async (orderId: string, isDelivered: boolean) => {
    try {
      await fetch(`/api/dashboard/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: [orderId], isDelivered }),
      })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, isDelivered } : o)))
      toast.success(isDelivered ? "Pažymėta kaip pristatyta" : "Pristatymo žymėjimas pašalintas")
    } catch (error) {
      console.error("Error updating delivery status:", error)
      toast.error("Nepavyko atnaujinti pristatymo būsenos")
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await fetch("/api/dashboard/order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: [orderId] }),
      })
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      setDeleteDialogOpen(false)
      setSelectedOrder(null)
      toast.success("Užsakymas ištrintas")
    } catch (error) {
      console.error("Error deleting order:", error)
      toast.error("Nepavyko ištrinti užsakymo")
    }
  }

  const handleMassStatusChange = async () => {
    if (!newMassStatus || selectedOrders.size === 0) return
    try {
      await fetch("/api/dashboard/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: Array.from(selectedOrders), status: newMassStatus }),
      })
      setOrders((prev) => prev.map((o) => (selectedOrders.has(o.id) ? { ...o, status: newMassStatus } : o)))
      setSelectedOrders(new Set())
      setMassStatusDialogOpen(false)
      setNewMassStatus("")
      toast.success(`${selectedOrders.size} užsakymų būsenos atnaujintos`)
    } catch (error) {
      console.error("Error mass updating orders:", error)
      toast.error("Nepavyko atnaujinti būsenų")
    }
  }

  const handleMassDelete = async () => {
    if (selectedOrders.size === 0) return
    try {
      await fetch("/api/dashboard/order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: Array.from(selectedOrders) }),
      })
      setOrders((prev) => prev.filter((o) => !selectedOrders.has(o.id)))
      const count = selectedOrders.size
      setSelectedOrders(new Set())
      setMassDeleteDialogOpen(false)
      toast.success(`${count} užsakymai ištrinti`)
    } catch (error) {
      console.error("Error mass deleting orders:", error)
      toast.error("Nepavyko ištrinti užsakymų")
    }
  }

  const toggleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(orders.map((o) => o.id)))
    }
  }

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const toggleColumn = (columnKey: ColumnKey) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey)
      } else {
        newSet.add(columnKey)
      }
      return newSet
    })
  }

  const openQuickView = (order: Order) => {
    setSelectedOrder(order)
    setQuickViewOpen(true)
  }

  const openAddressDialog = (order: Order) => {
    setSelectedOrder(order)
    setAddressDialogOpen(true)
  }

  const openDeleteDialog = (order: Order) => {
    setSelectedOrder(order)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Užsakymai</h2>
        <p className="text-muted-foreground mt-2">Peržiūrėkite ir tvarkykite visus klientų užsakymus</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Užsakymų valdymas</CardTitle>
          <CardDescription>
            Rodoma {orders.length} iš {total} užsakymų
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters and actions row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ieškoti užsakymų, paslaugų..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Būsena" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Visos būsenos</SelectItem>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Visos datos</SelectItem>
                  <SelectItem value="today">Šiandien</SelectItem>
                  <SelectItem value="yesterday">Vakar</SelectItem>
                  <SelectItem value="thisWeek">Ši savaitė</SelectItem>
                  <SelectItem value="thisMonth">Šis mėnuo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Laikas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Visi laikai</SelectItem>
                  <SelectItem value="pickupToday">Paėmimas šiandien</SelectItem>
                  <SelectItem value="deliveryToday">Pristatymas šiandien</SelectItem>
                  <SelectItem value="overduePickup">Pradelsti paėmimai</SelectItem>
                  <SelectItem value="overdueDelivery">Pradelsti pristatymai</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Rodyti stulpelius</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allColumns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns.has(col.key)}
                      onCheckedChange={() => toggleColumn(col.key)}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => fetchOrders(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atnaujinti
              </Button>
            </div>

            {/* Mass actions */}
            {selectedOrders.size > 0 && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <span className="text-sm font-medium">Pažymėta: {selectedOrders.size}</span>
                <Button variant="outline" size="sm" onClick={() => setMassStatusDialogOpen(true)}>
                  Pakeisti būseną
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setMassDeleteDialogOpen(true)}>
                  Ištrinti
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrders(new Set())}>
                  Atšaukti
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
              <div ref={scrollContainerRef} className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={orders.length > 0 && selectedOrders.size === orders.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      {visibleColumns.has("orderNumber") && <TableHead>Užsakymo ID</TableHead>}
                      {visibleColumns.has("customer") && <TableHead>Klientas</TableHead>}
                      {visibleColumns.has("serviceType") && <TableHead>Paslaugos</TableHead>}
                      {visibleColumns.has("totalAmount") && <TableHead>Suma</TableHead>}
                      {visibleColumns.has("status") && <TableHead>Būsena</TableHead>}
                      {visibleColumns.has("paymentMethod") && <TableHead>Mokėjimas</TableHead>}
                      {visibleColumns.has("pickupTime") && <TableHead className="min-w-[180px]">Paėmimas</TableHead>}
                      {visibleColumns.has("deliveryTime") && (
                        <TableHead className="min-w-[180px]">Pristatymas</TableHead>
                      )}
                      {visibleColumns.has("actions") && <TableHead>Veiksmai</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          Kraunami užsakymai...
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          Užsakymų nerasta
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer"
                          onClick={() => openQuickView(order)}
                          data-state={selectedOrders.has(order.id) ? "selected" : undefined}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedOrders.has(order.id)}
                              onCheckedChange={() => toggleSelectOrder(order.id)}
                            />
                          </TableCell>
                          {visibleColumns.has("orderNumber") && (
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          )}
                          {visibleColumns.has("customer") && (
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.customer}</div>
                                <div className="text-sm text-muted-foreground">{order.email}</div>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.has("serviceType") && (
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {order.items.map((item) => (
                                  <Badge key={item.id} variant="secondary" className="text-xs">
                                    {item.service?.name || item.name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.has("totalAmount") && (
                            <TableCell className="font-medium">€{order.totalAmount.toFixed(2)}</TableCell>
                          )}
                          {visibleColumns.has("status") && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="focus:outline-none">
                                    <Badge
                                      className={`${getStatusColor(order.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                                      variant="secondary"
                                    >
                                      {statusOptions.find((s) => s.value === order.status)?.label || order.status}
                                    </Badge>
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 p-1" align="start">
                                  <div className="flex flex-col gap-1">
                                    {statusOptions.map((opt) => (
                                      <button
                                        key={opt.value}
                                        onClick={() => handleStatusChange(order.id, opt.value)}
                                        className={`text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
                                          order.status === opt.value ? "bg-muted font-medium" : ""
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                          )}
                          {visibleColumns.has("paymentMethod") && (
                            <TableCell>{getPaymentMethodBadge(order.paymentMethod)}</TableCell>
                          )}
                          {visibleColumns.has("pickupTime") && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col gap-1 min-w-[160px]">
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(order.pickupDateTime).toLocaleString("lt-LT")}
                                </div>
                                <CountdownBadge
                                  targetDate={order.pickupDateTime}
                                  isDone={order.isPickedUp}
                                  label="Paimta"
                                />
                                <div className="flex items-center gap-1 mt-1">
                                  <Checkbox
                                    id={`pickup-${order.id}`}
                                    checked={order.isPickedUp}
                                    onCheckedChange={(checked) => handleTogglePickup(order.id, checked as boolean)}
                                  />
                                  <label htmlFor={`pickup-${order.id}`} className="text-xs whitespace-nowrap">
                                    Paimta
                                  </label>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.has("deliveryTime") && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col gap-1 min-w-[160px]">
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(order.deliveryDateTime).toLocaleString("lt-LT")}
                                </div>
                                <CountdownBadge
                                  targetDate={order.deliveryDateTime}
                                  isDone={order.isDelivered}
                                  label="Pristatyta"
                                />
                                <div className="flex items-center gap-1 mt-1">
                                  <Checkbox
                                    id={`delivery-${order.id}`}
                                    checked={order.isDelivered}
                                    onCheckedChange={(checked) => handleToggleDelivery(order.id, checked as boolean)}
                                  />
                                  <label htmlFor={`delivery-${order.id}`} className="text-xs whitespace-nowrap">
                                    Pristatyta
                                  </label>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.has("actions") && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  className="p-2 hover:bg-muted rounded-full transition"
                                  size="icon"
                                  onClick={() => openAddressDialog(order)}
                                  title="Adresas"
                                >
                                  <MapPin className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="p-2 hover:bg-destructive/20 rounded-full transition"
                                  size="icon"
                                  onClick={() => openDeleteDialog(order)}
                                  title="Ištrinti"
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {loadingMore && <div className="py-4 text-center text-muted-foreground">Kraunama daugiau...</div>}
                <div ref={observerRef} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick View Dialog (Row Click) */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Užsakymo apžvalga</DialogTitle>
            <DialogDescription>Greita užsakymo informacija</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
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
                  <p className="text-sm">{selectedOrder.address || "Nėra"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bendra suma</p>
                  <p className="text-sm font-bold text-green-600">€{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Būsena</p>
                  <Badge className={getStatusColor(selectedOrder.status)} variant="secondary">
                    {statusOptions.find((s) => s.value === selectedOrder.status)?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mokėjimo būsena</p>
                  {getPaymentMethodBadge(selectedOrder.paymentMethod)}
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
                    <CountdownBadge
                      targetDate={selectedOrder.pickupDateTime}
                      isDone={selectedOrder.isPickedUp}
                      label="Paimta"
                    />
                  </div>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4" />
                    <p className="text-sm font-medium">Pristatymo laikas</p>
                  </div>
                  <p className="text-sm">{new Date(selectedOrder.deliveryDateTime).toLocaleString("lt-LT")}</p>
                  <div className="mt-2">
                    <CountdownBadge
                      targetDate={selectedOrder.deliveryDateTime}
                      isDone={selectedOrder.isDelivered}
                      label="Pristatyta"
                    />
                  </div>
                </div>
              </div>

              {/* Services with addons */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Paslaugos</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <Badge>{item.service?.name || item.name}</Badge>
                        <span className="font-medium">€{item.price.toFixed(2)}</span>
                      </div>
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Priedai:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.addons.map((addon) => (
                              <Badge key={addon.id} variant="outline" className="text-xs">
                                {addon.name} (+€{addon.price.toFixed(2)})
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
              {selectedOrder.snapNotes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pastabos</p>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedOrder.snapNotes}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setQuickViewOpen(false)}>
                  Uždaryti
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Address Dialog with Map */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Kliento adresas</DialogTitle>
            <DialogDescription>Pristatymo informacija</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gatvė</p>
                  <p className="text-sm">{selectedOrder.snap.street || "Nėra"}</p>
                </div>
                {selectedOrder.snap.apartment && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Butas</p>
                    <p className="text-sm">{selectedOrder.snap.apartment}</p>
                  </div>
                )}
                {selectedOrder.snap.floor && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aukštas</p>
                    <p className="text-sm">{selectedOrder.snap.floor}</p>
                  </div>
                )}
                {selectedOrder.snap.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pastabos kurjeriui</p>
                    <p className="text-sm">{selectedOrder.snap.notes}</p>
                  </div>
                )}
              </div>
              {selectedOrder.snap.latitude && selectedOrder.snap.longitude && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Žemėlapis</p>
                  <MapComponent
                    location={{
                      lat: Number(selectedOrder.snap.latitude),
                      lng: Number(selectedOrder.snap.longitude),
                    }}
                    readonly
                  />
                  <p className="text-xs font-mono text-muted-foreground mt-2">
                    {Number(selectedOrder.snap.latitude).toFixed(6)}, {Number(selectedOrder.snap.longitude).toFixed(6)}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>
                  Uždaryti
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ar tikrai norite ištrinti?</AlertDialogTitle>
            <AlertDialogDescription>
              Šis veiksmas negrįžtamas. Užsakymas {selectedOrder?.orderNumber} bus ištrintas visam laikui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Atšaukti</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => selectedOrder && handleDeleteOrder(selectedOrder.id)}
            >
              Ištrinti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mass Delete Confirmation Dialog */}
      <AlertDialog open={massDeleteDialogOpen} onOpenChange={setMassDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ar tikrai norite ištrinti?</AlertDialogTitle>
            <AlertDialogDescription>
              Šis veiksmas negrįžtamas. {selectedOrders.size} užsakymai bus ištrinti visam laikui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Atšaukti</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleMassDelete}
            >
              Ištrinti ({selectedOrders.size})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mass Status Change Dialog */}
      <Dialog open={massStatusDialogOpen} onOpenChange={setMassStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pakeisti būseną</DialogTitle>
            <DialogDescription>Pasirinkite naują būseną {selectedOrders.size} užsakymams</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newMassStatus} onValueChange={setNewMassStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite būseną" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMassStatusDialogOpen(false)}>
              Atšaukti
            </Button>
            <Button onClick={handleMassStatusChange} disabled={!newMassStatus}>
              Pakeisti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}