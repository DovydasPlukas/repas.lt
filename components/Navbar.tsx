"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { USER_NAV_LINKS } from "@/app/constants/constants"
import { LogoutIcon, AccountIcon, OrderIcon, LoginIcon } from "./SvgIcons"
import { LogoutButton } from "@/components/auth/logout-button"
import { MobileSidebar } from "./MobileSidebar"
import { ServiceSelectionModal } from "@/components/checkout/ServiceSelectionModal"
import type { Service } from "@/components/checkout/types"

const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const isUserLoggedIn = !!session
  const isAdmin = session?.user?.role === "ADMIN"

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleServiceClick = (service: Service) => {
    setSelectedServiceId(service.id)
    setModalOpen(true)
  }

  const handleModalClose = (isOpen: boolean) => {
    setModalOpen(isOpen)
    if (!isOpen) setSelectedServiceId(null)
  }

  // Inline pulsing loader component
  const PulserLoader = ({ size = 16, className = "", ariaLabel = "Loading" }) => (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className={`flex items-center justify-center ${className}`}>
      <span className="mr-4 rounded-full animate-pulse inline-block" style={{ width: size, height: size, background: "#e4ddd8" }} />
      <span className="sr-only">{ariaLabel}…</span>
    </div>
  )

  return (
    <nav className="h-[99px] xl:h-[142px]">
      <div className="bg-white w-full px-4 fixed md:px-[28px] xl:px-[145px] 2xl:px-[0px] z-30">
        <div className="sm:max-w-[688px] md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto">
          <div className="flex flex-row justify-between pt-3 pb-2 md:py-3 xl:pt-6 border-b border-(--RepasBlue)">
            {/* Left links */}
            <div className="pl-10 max-xl:pl-0 my-auto">
              <Link href={USER_NAV_LINKS.contact.href}>
                <span className={`font-poppins text-base font-normal leading-6 ${pathname === USER_NAV_LINKS.contact.href ? "webkit-text-stroke underline" : "xl:hover:webkit-text-stroke xl:hover:underline"}`}>
                  {USER_NAV_LINKS.contact.label}
                </span>
              </Link>
              <div className="xl:w-[254px]"></div>
            </div>

            {/* Logo */}
            <Link href="/" aria-label="Logo" className="hidden xl:block">
              <Image className="hidden xl:block mx-auto md:mx-0 object-contain xl:h-[50px] xl:w-[257px] transition-all duration-300 hover:scale-105" src="/repas_logo.svg" alt="Logo" width={150} height={50} priority />
            </Link>

            {/* Right actions with loader */}
            <div className="pr-10 max-xl:pr-0 flex flex-row justify-end items-center xl:w-[341px]">
              {loading ? (
                <PulserLoader size={20} />
              ) : isUserLoggedIn ? (
                <>
                  <div className="hidden xl:block">
                    <LogoutButton>
                      <LogoutIcon />
                    </LogoutButton>
                  </div>
                  <Link className="hidden xl:flex flex-col justify-center mx-4" href={USER_NAV_LINKS.account.href}>
                    <AccountIcon />
                  </Link>
                  <Link className="hidden xl:flex flex-col justify-center mr-4" href={isAdmin ? USER_NAV_LINKS.dashboard.href : USER_NAV_LINKS.order.href}>
                    <OrderIcon />
                  </Link>
                </>
              ) : (
                <Link href={USER_NAV_LINKS.login.href} className="hidden xl:block">
                  <LoginIcon />
                </Link>
              )}

              <div className="w-[16px] hidden xl:block"></div>
              <Link href={USER_NAV_LINKS.services.href} aria-label="Užsisakyti" className="hidden xl:block">
                <div className="hidden xl:block w-[152px] h-[44px] text-center px-4 py-[10px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-6 font-poppins text-base transition-all duration-300 ease-in-out">
                  {USER_NAV_LINKS.services.label}
                </div>
              </Link>
            </div>
          </div>

          {/* Secondary Navbar - mobile & services links */}
          <div className="mb-3 xl:mb-3 pt-2 flex flex-row justify-between">
            <div className="xl:hidden">
              <MobileSidebar />
            </div>

            {/* Mobile logo */}
            <Link href="/" aria-label="Logo" className="xl:hidden">
              <Image className="xl:hidden mx-auto md:mx-0 object-contain xl:h-[50px] xl:w-[257px] transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl drop-shadow-xl active:scale-95" src="/repas_logo.svg" alt="Logo" width={70} height={26} priority />
            </Link>

            {/* Mobile services button */}
            <Link href={USER_NAV_LINKS.services.href} aria-label="Užsisakyti" className="xl:hidden">
              <div className="xl:hidden lg:px-3 px-[10px] py-[6px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-[22px] font-poppins text-sm">
                {USER_NAV_LINKS.services.label}
              </div>
            </Link>

            {/* Desktop services links */}
            <div className="hidden xl:flex w-full flex-row justify-center space-x-6 mt-[6px] overflow-hidden">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex-1 flex justify-center items-center">
                    <div className="h-4 w-24 bg-[#e4ddd8] rounded-md animate-pulse" />
                  </div>
                ))
              ) : (
                services.length > 0 && services.filter(service => service.addons && service.addons.length > 0).map((service) => (
                  <button key={service.id} onClick={() => handleServiceClick(service)} className="flex-1 text-center font-normal text-RepasBlue transition-all xl:hover:underline xl:hover:webkit-text-stroke">
                    {service.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection Modal */}
      <ServiceSelectionModal open={modalOpen} onOpenChange={handleModalClose} selectedServiceId={selectedServiceId} />
    </nav>
  )
}

export default Navbar