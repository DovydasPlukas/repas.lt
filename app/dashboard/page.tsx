"use client"

import { useState } from "react"
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShoppingCart, Settings, FileEdit, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Overview from "@/components/dashboard/overview"
import Orders from "@/components/dashboard/orders"
import ChangeServices from "@/components/dashboard/change-services"
import ChangePage from "@/components/dashboard/change-page"

// TODO: add if user is admin check

type TabType = "overview" | "orders" | "services" | "page"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: LayoutDashboard },
    { id: "orders" as TabType, label: "Orders", icon: ShoppingCart },
    { id: "services" as TabType, label: "Change Services", icon: Settings },
    { id: "page" as TabType, label: "Change Page", icon: FileEdit },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "orders":
        return <Orders />
      case "services":
        return <ChangeServices />
      case "page":
        return <ChangePage />
      default:
        return <Overview />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-2 border-b border-sidebar-border bg-white flex justify-center">
            <Link href="/" aria-label="Pagrindinis puslapis" className="inline-block mb-3">
              <Image
                src="/repas_logo.svg"
                alt="Repas"
                width={150}
                height={50}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 bg-white">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>

        {/* Footer */}
        <div className="p-4 bg-white">
            <h1 className="text-2xl font-bold text-sidebar-foreground">Administratoriaus panelė</h1>
        </div>

        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-6 lg:p-8">{renderContent()}</div>
      </main>
    </div>
  )
}