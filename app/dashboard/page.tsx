"use client"
/* eslint-disable */

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, ShoppingCart, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Overview from "@/components/dashboard/overview"
import Orders from "@/components/dashboard/orders"
import ChangeServices from "@/components/dashboard/change-services"
import { useRouter, useSearchParams } from "next/navigation"

type TabType = "overview" | "orders" | "services"
const ALLOWED_TABS = ["overview", "orders", "services"]

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Resolve initial tab from (in priority order):
  // 1) callbackUrl (decoded) -> ?tab=...
  // 2) direct ?tab=...
  // 3) localStorage
  // 4) default "overview"
  useEffect(() => {
    try {
      // 1) try callbackUrl
      const cb = searchParams?.get("callbackUrl")
      let tabFromUrl: string | null = null

      if (cb) {
        try {
          const decoded = decodeURIComponent(cb)
          // parsed as absolute relative to current origin
          const parsed = new URL(decoded, typeof window !== "undefined" ? window.location.origin : "http://localhost")
          tabFromUrl = parsed.searchParams.get("tab")
        } catch (e) {
          // ignore parse errors
        }
      }

      // 2) fallback to direct ?tab=...
      if (!tabFromUrl) {
        const t = searchParams?.get("tab")
        if (t) tabFromUrl = t
      }

      // 3) fallback to localStorage
      if (!tabFromUrl) {
        const saved = typeof window !== "undefined" ? localStorage.getItem("repas:adminActiveTab") : null
        if (saved) tabFromUrl = saved
      }

      // Validate & set
      if (tabFromUrl && ALLOWED_TABS.includes(tabFromUrl)) {
        setActiveTab(tabFromUrl as TabType)

        // Clean up the URL: replace to a clean ?tab=... (remove callbackUrl if present)
        // Build new search params with only tab (keep other relevant params if you want)
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set("tab", tabFromUrl)
        newUrl.searchParams.delete("callbackUrl")
        // Use router.replace so navigation stack isn't polluted
        router.replace(`${newUrl.pathname}${newUrl.search}`)
      } else {
        // nothing found - keep default ("overview") and ensure URL has tab param for shareability
        const currentTabParam = searchParams?.get("tab")
        if (!currentTabParam) {
          const u = new URL(window.location.href)
          u.searchParams.set("tab", "overview")
          router.replace(`${u.pathname}${u.search}`)
        }
      }
    } catch (err) {
      // ignore localStorage / parsing errors
    }
    // run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist activeTab to localStorage and update ?tab=... on every change
  useEffect(() => {
    try {
      localStorage.setItem("repas:adminActiveTab", activeTab)

      // Update URL tab param without adding history entry
      const u = new URL(window.location.href)
      u.searchParams.set("tab", activeTab)
      u.searchParams.delete("callbackUrl") // keep URL clean
      router.replace(`${u.pathname}${u.search}`)
    } catch (err) {
      // ignore
    }
  }, [activeTab, router])

  const tabs = [
    { id: "overview" as TabType, label: "Apžvalga", icon: LayoutDashboard },
    { id: "orders" as TabType, label: "Užsakymai", icon: ShoppingCart },
    { id: "services" as TabType, label: "Keisti Paslaugas", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "orders":
        return <Orders />
      case "services":
        return <ChangeServices />
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
              <Image src="/repas_logo.svg" alt="Repas" width={150} height={50} className="object-contain" priority />
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