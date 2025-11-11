"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Euro, ShoppingCart, CircleDotDashed } from "lucide-react"
import { Badge } from "../ui/badge"

export default function Overview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "21€",
      change: "+20.1% from last month",
      icon: Euro,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "10",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: "5",
      icon: CircleDotDashed,
      color: "text-purple-600",
    },
    {
      title: "New Orders",
      value: "2",
      icon: Activity,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground mt-2">Welcome to your admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Order #{1000 + i}</p>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" variant="secondary">pending</Badge>
                  </div>
                  <div className="ml-auto font-medium">Order Type</div>
                  <div className="ml-auto font-medium">View</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"].map((name, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium">{name.charAt(0)}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">customer@email.com</p>
                  </div>
                  <div className="ml-auto font-medium">+${(i + 1) * 39}.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}