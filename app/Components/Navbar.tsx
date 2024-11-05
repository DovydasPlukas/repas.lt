// components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { PASLAUGOS_LINKS, USER_NAV_LINKS } from '../constants/constants';
import { LogoutIcon, AccountIcon, OrderIcon, CartIcon, LoginIcon, MenuIcon  } from './SvgIcons';

//TODO: Add auth logic
//TODO: Add shopping card logic
//TODO: Fix menu on small devices

const Navbar = () => {
  const isUserLoggedIn = false;

  return (
    <nav className="h-[99px] xl:h-[142px]">
      <div>
        <div className="bg-white w-full px-4 fixed md:px-[28px] xl:px-[145px] 2xl:px-[0px] z-30">
          <div className="sm:max-w-[688px] md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto">
            <div className="flex flex-row justify-between pt-3 pb-2 md:py-3 xl:pt-6 border-b border-RepasBlue ">
              <div className="pl-10 max-xl:pl-0 my-auto">
                <Link href={USER_NAV_LINKS.contact.href}>
                  <span className="font-poppins text-base font-normal leading-6 xl:hover:webkit-text-stroke xl:hover:underline">
                    {USER_NAV_LINKS.contact.label}
                  </span>
                </Link>
                <div className="xl:w-[254px]"></div>
              </div>
              <Link href="/">
                <Image
                  className="hidden xl:block mx-auto md:mx-0 object-contain xl:h-[50px] xl:w-[257px]"
                  src="/repas_logo_2.svg"
                  alt="Logo"
                  width={150}
                  height={50}
                  priority
                />
              </Link>
              <div className="pr-10 max-xl:pr-0 flex flex-row justify-end items-center xl:w-[341px]">
                {isUserLoggedIn ? (
                  <>
                    <Link href={USER_NAV_LINKS.logout.href}>
                      <LogoutIcon />
                    </Link>
                    <Link className="flex flex-col justify-center mx-4" href={USER_NAV_LINKS.account.href}>
                      <AccountIcon />
                    </Link>
                    <Link className="flex flex-col justify-center mr-4" href={USER_NAV_LINKS.order.href}>
                      <OrderIcon />
                    </Link>
                  </>
                ) : (
                  <Link href={USER_NAV_LINKS.login.href}>
                    <LoginIcon />
                  </Link>
                )}

                <Link className="flex flex-col justify-center" href={USER_NAV_LINKS.cart.href}>
                  <div className="relative">
                    <CartIcon />
                    <div className="hidden">0</div>
                  </div>
                </Link>
                {isUserLoggedIn ? (<div className="w-[16px]"></div>) : (<div></div>)}
                <div className="w-[16px] hidden xl:block"></div>
                <Link href={USER_NAV_LINKS.services.href}>
                  <div className="hidden xl:block w-[152px] h-[44px] text-center px-4 py-[10px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-6 font-poppins text-base">
                    {USER_NAV_LINKS.services.label}
                  </div>
                </Link>
              </div>
            </div>
            <div className="mb-3 xl:mb-3 pt-2 flex flex-row justify-between ">
              
              {/* For mobile */}
              <div className="xl:hidden">
                <Link href="/menu">
                  <MenuIcon />
                </Link>
              </div>
              <Link href="/">
                <Image
                  className="xl:hidden mx-auto md:mx-0 object-contain xl:h-[50px] xl:w-[257px]"
                  src="/repas_logo_2.svg"
                  alt="Logo"
                  width={70}
                  height={26}
                  priority
                />
              </Link>
              <Link href={USER_NAV_LINKS.services.href}>
                <div className="xl:hidden lg:px-3 px-[10px] py-[6px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-[22px] font-poppins text-sm">
                  {USER_NAV_LINKS.services.label}
                </div>
              </Link>
              {/* Paslaugos navbar*/}
              <div className="hidden xl:flex w-full flex-row justify-center space-x-6 mt-[6px] overflow-hidden">
                {PASLAUGOS_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex-1 text-center"
                  >
                    <div className="font-normal text-RepasBlue xl:hover:underline xl:hover:webkit-text-stroke">
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;