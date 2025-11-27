"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
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
}

const serviceTypeMap: Record<string, string> = {
  skalbimas: "Skalbimas",
  kostiumu_valymas: "Kostiumų valymas",
  lyginimas: "Lyginimas",
  patalines_valymas: "Patalynės valymas",
  skalbimo_masiniu_tvarkymas: "Skalbimo mašinų tvarkymas",
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/order")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      await fetchOrders()
      if (selectedOrder?.id === orderId) {
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Ar tikrai norite ištrinti šį užsakymą?")) return

    try {
      await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "DELETE",
      })
      await fetchOrders()
      if (selectedOrder?.id === orderId) {
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
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
          <CardDescription>Peržiūrėkite ir tvarkykite visus užsakymus sistemoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ieškoti užsakymų pagal klientą, užsakymo ID arba el. paštą..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={fetchOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atnaujinti
              </Button>
            </div>

            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Užsakymo ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Klientas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Paslaugos tipas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Suma</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Būsena</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          Kraunami užsakymai...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          Užsakymų nerasta
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium">{order.customer}</div>
                              <div className="text-sm text-muted-foreground">{order.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {serviceTypeMap[order.serviceType] || order.serviceType}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">€{order.totalAmount.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status.toLowerCase()}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Užsakymo informacija</DialogTitle>
            <DialogDescription>Peržiūrėkite ir tvarkykite užsakymo informaciją</DialogDescription>
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
                  <p className="text-sm font-medium text-muted-foreground">Paslaugos tipas</p>
                  <p className="text-sm">{serviceTypeMap[selectedOrder.serviceType]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bendra suma</p>
                  <p className="text-sm font-bold text-green-600">€{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Užsakymo prekės</p>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left text-xs font-medium">Prekė</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Kiekis</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Kaina</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="px-3 py-2 text-sm">{item.name}</td>
                          <td className="px-3 py-2 text-sm">{item.quantity}</td>
                          <td className="px-3 py-2 text-sm">€{item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Atnaujinti būseną</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Naujas</SelectItem>
                    <SelectItem value="PENDING">Laukiantis</SelectItem>
                    <SelectItem value="COMPLETED">Užbaigtas</SelectItem>
                    <SelectItem value="CANCELLED">Atšauktas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Uždaryti
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteOrder(selectedOrder.id)}>
                  Ištrinti užsakymą
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}