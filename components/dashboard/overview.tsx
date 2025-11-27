"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Euro, ShoppingCart, CircleDotDashed, XCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Stats {
  totalOrders: number
  newOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  recentCompletedOrders: any[]
}

interface Order {
  id: string
  orderNumber: string
  customer: string
  serviceType: string
  totalAmount: number
  status: string
  email: string
}

const serviceTypeMap: Record<string, string> = {
  skalbimas: "Skalbimas",
  kostiumu_valymas: "Kostiumų valymas",
  lyginimas: "Lyginimas",
  patalines_valymas: "Patalynės valymas",
  skalbimo_masiniu_tvarkymas: "Skalbimo mašinų tvarkymas",
}

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [newOrders, setNewOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/dashboard/order/stats"),
        fetch("/api/dashboard/order?status=NEW"),
      ])

      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()

      setStats(statsData)
      setNewOrders(ordersData)
    } catch (error) {
      console.error(" Error fetching overview data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div className="text-foreground">Kraunama...</div>
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
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Apžvalga</h2>
        <p className="text-muted-foreground mt-2">Sveiki atvykę į administratoriaus valdymo skydą.</p>
      </div>

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
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <Badge variant="secondary" className="text-xs">
                        {serviceTypeMap[order.serviceType] || order.serviceType}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#orders">Peržiūrėti</a>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Užbaigti užsakymai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!stats?.recentCompletedOrders || stats.recentCompletedOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm">Užbaigtų užsakymų nėra</p>
              ) : (
                stats.recentCompletedOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium">{order.customer.charAt(0)}</span>
                    </div>
                    <div className="ml-4 flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                    <div className="font-medium text-green-600">+€{order.totalAmount.toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}