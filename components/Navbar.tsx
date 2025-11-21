"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { PASLAUGOS_LINKS, USER_NAV_LINKS } from "../app/constants/constants"
import { LogoutIcon, AccountIcon, OrderIcon, CartIcon, LoginIcon } from "./SvgIcons"
import { LogoutButton } from "@/components/auth/logout-button"
import { useSession } from "next-auth/react"
import { MobileSidebar } from "./MobileSidebar"

const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()

  // User is logged in if session exists
  const isUserLoggedIn = !!session
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <nav className="h-[99px] xl:h-[142px]">
      <div className="bg-white w-full px-4 fixed md:px-[28px] xl:px-[145px] 2xl:px-[0px] z-30">
        <div className="sm:max-w-[688px] md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto">
          <div className="flex flex-row justify-between pt-3 pb-2 md:py-3 xl:pt-6 border-b border-(--RepasBlue)">
            {/* Left links */}
            <div className="pl-10 max-xl:pl-0 my-auto">
              <Link href={USER_NAV_LINKS.contact.href}>
                <span
                  className={`font-poppins text-base font-normal leading-6 ${
                    pathname === USER_NAV_LINKS.contact.href
                      ? "webkit-text-stroke underline"
                      : "xl:hover:webkit-text-stroke xl:hover:underline"
                  }`}
                >
                  {USER_NAV_LINKS.contact.label}
                </span>
              </Link>
              <div className="xl:w-[254px]"></div>
            </div>

            {/* Logo */}
            <Link href="/" aria-label="Logo" className="hidden xl:block">
              <Image
                className="hidden xl:block mx-auto md:mx-0 object-contain xl:h-[50px] xl:w-[257px] transition-all duration-300 hover:scale-105"
                src="/repas_logo.svg"
                alt="Logo"
                width={150}
                height={50}
                priority
              />
            </Link>

            {/* Right actions */}
            <div className="pr-10 max-xl:pr-0 flex flex-row justify-end items-center xl:w-[341px]">
              {isUserLoggedIn ? (
                <>
                  <div className="hidden xl:block">
                    <LogoutButton>
                      <LogoutIcon />
                    </LogoutButton>
                  </div>
                  <Link className="hidden xl:flex flex-col justify-center mx-4" href={USER_NAV_LINKS.account.href}>
                    <AccountIcon />
                  </Link>
                  {/* Link based on role */}
                  <Link
                    className="hidden xl:flex flex-col justify-center mr-4"
                    href={isAdmin ? USER_NAV_LINKS.dashboard.href : USER_NAV_LINKS.order.href}
                  >
                    <OrderIcon />
                  </Link>
                </>
              ) : (
                <Link href={USER_NAV_LINKS.login.href} className="hidden xl:block">
                  <LoginIcon />
                </Link>
              )}

              <Link className="flex flex-col justify-center" href={USER_NAV_LINKS.cart.href}>
                <div className="relative">
                  <CartIcon />
                  <div className="hidden">0</div>
                </div>
              </Link>
              {isUserLoggedIn ? <div className="w-[16px]"></div> : <div></div>}
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
              <Image
                className="xl:hidden mx-auto md:mx-0 object-contain xl:h-[50px] xl:w-[257px] transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl drop-shadow-xl active:scale-95"
                src="/repas_logo.svg"
                alt="Logo"
                width={70}
                height={26}
                priority
              />
            </Link>

            {/* Mobile services button */}
            <Link href={USER_NAV_LINKS.services.href} aria-label="Užsisakyti" className="xl:hidden">
              <div className="xl:hidden lg:px-3 px-[10px] py-[6px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-[22px] font-poppins text-sm">
                {USER_NAV_LINKS.services.label}
              </div>
            </Link>

            {/* Desktop services links */}
            <div className="hidden xl:flex w-full flex-row justify-center space-x-6 mt-[6px] overflow-hidden">
              {PASLAUGOS_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="flex-1 text-center">
                  <div
                    className={`font-normal text-RepasBlue ${
                      pathname === link.href
                        ? "underline webkit-text-stroke"
                        : "xl:hover:underline xl:hover:webkit-text-stroke"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar