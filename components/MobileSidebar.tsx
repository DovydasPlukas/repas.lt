"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { USER_NAV_LINKS } from "@/app/constants/constants"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import { MenuIcon, LogoutIcon, AccountIcon, OrderIcon, LoginIcon } from "./SvgIcons"
import { useSession, signOut } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { toast } from "sonner"

export function MobileSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isUserLoggedIn = !!session && !isLoggingOut
  const isAdmin = session?.user?.role === "ADMIN"

  const closeSidebar = () => setOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    closeSidebar()

    await signOut({ redirect: false })
    toast.success("Atsijungta")
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Atidaryti menu">
          <MenuIcon />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-(--RepasBlue) font-poppins font-semibold text-xl">
            Menu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Mobiliojo įrenginio naršymo meniu.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Navigacija
            </h3>

            {isUserLoggedIn ? (
              <>
                <Link
                  href={USER_NAV_LINKS.account.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === USER_NAV_LINKS.account.href
                      ? "bg-(--RepasBlue)/10 text-(--RepasBlue) font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  <AccountIcon />
                  <span className="font-poppins">{USER_NAV_LINKS.account.label}</span>
                </Link>

                <Link
                  href={isAdmin ? USER_NAV_LINKS.dashboard.href : USER_NAV_LINKS.order.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === (isAdmin
                      ? USER_NAV_LINKS.dashboard.href
                      : USER_NAV_LINKS.order.href)
                      ? "bg-(--RepasBlue)/10 text-(--RepasBlue) font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  <OrderIcon />
                  <span className="font-poppins">
                    {isAdmin
                      ? USER_NAV_LINKS.dashboard.label
                      : USER_NAV_LINKS.order.label}
                  </span>
                </Link>

                <div className="px-3 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left hover:text-destructive transition-colors"
                  >
                    <LogoutIcon />
                    <span className="font-poppins">Atsijungti</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href={USER_NAV_LINKS.login.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === USER_NAV_LINKS.login.href
                    ? "bg-(--RepasBlue)/10 text-(--RepasBlue) font-semibold"
                    : "hover:bg-muted"
                }`}
              >
                <LoginIcon />
                <span className="font-poppins">{USER_NAV_LINKS.login.label}</span>
              </Link>
            )}
          </div>

          <Separator />

          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Susisiekti
          </h3>

          <Link
            href={USER_NAV_LINKS.contact.href}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === USER_NAV_LINKS.contact.href
                ? "bg-(--RepasBlue)/10 text-(--RepasBlue) font-semibold"
                : "hover:bg-muted"
            }`}
          >
            <span className="font-poppins">
              {USER_NAV_LINKS.contact.label}
            </span>
          </Link>

          <Separator />

          <Link
            href={USER_NAV_LINKS.services.href}
            onClick={closeSidebar}
            className="mt-auto"
          >
            <div className="w-full text-center px-4 py-3 rounded-lg bg-[#Ea5548] hover:bg-[#D43C33] text-white font-bold font-poppins transition-all duration-300 ease-in-out active:scale-95">
              {USER_NAV_LINKS.services.label}
            </div>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}