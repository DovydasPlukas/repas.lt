"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PASLAUGOS_LINKS, USER_NAV_LINKS } from "../app/constants/constants"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import { MenuIcon, LogoutIcon, AccountIcon, OrderIcon, LoginIcon } from "./SvgIcons"
import { LogoutButton } from "@/components/auth/logout-button"
import { useSession } from "next-auth/react"
import { Separator } from "@/components/ui/separator"

export function MobileSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isUserLoggedIn = !!session
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <Sheet>
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
          {/* User Navigation Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Navigacija
            </h3>

            {isUserLoggedIn ? (
              <>
                <Link
                  href={USER_NAV_LINKS.account.href}
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === (isAdmin ? USER_NAV_LINKS.dashboard.href : USER_NAV_LINKS.order.href)
                      ? "bg-(--RepasBlue)/10 text-(--RepasBlue) font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  <OrderIcon />
                  <span className="font-poppins">
                    {isAdmin ? USER_NAV_LINKS.dashboard.label : USER_NAV_LINKS.order.label}
                  </span>
                </Link>

                <div className="px-3 py-2">
                  <LogoutButton>
                    <button className="flex items-center gap-3 w-full text-left hover:text-destructive transition-colors">
                      <LogoutIcon />
                      <span className="font-poppins">Atsijungti</span>
                    </button>
                  </LogoutButton>
                </div>
              </>
            ) : (
              <Link
                href={USER_NAV_LINKS.login.href}
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

          {/* Services Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Paslaugos
            </h3>
            {PASLAUGOS_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors font-poppins ${
                  pathname === link.href ? "bg-(--RepasBlue)/10 text-(--RepasBlue) font-semibold" : "hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Separator />

          {/* Call to Action */}
          <Link href={USER_NAV_LINKS.services.href} className="mt-auto">
            <div className="w-full text-center px-4 py-3 rounded-lg bg-[#Ea5548] hover:bg-[#D43C33] text-white font-bold font-poppins transition-all duration-300 ease-in-out active:scale-95">
              {USER_NAV_LINKS.services.label}
            </div>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}