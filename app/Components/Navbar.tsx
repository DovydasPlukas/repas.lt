// components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="h-[99px]   xl:h-[142px]">
      <div>
        <div className=" bg-white w-full px-4 fixed md:px-[28px] xl:px-[145px] 2xl:px-[0px] z-30">
          <div className=" sm:max-w-[688px]  md:max-w-[968px] lg:max-w-[1150px]  xl:max-w-[1550px] mx-auto">
            <div className="flex flex-row justify-between pt-3 pb-2 md:py-3 xl:pt-6 border-b border-RepasBlue ">
              <div className="pl-10 max-xl:pl-0  my-auto">
                <Link href="/kontaktai" style={{ textDecoration: "none" }}>
                  <div className="font-poppins text-base font-normal leading-6 xl:hover:webkit-text-stroke xl:hover:underline w-[55px]">
                    Kontaktai
                  </div>
                </Link>
                <div className="xl:w-[254px]"></div>
              </div>
              <Link rel="alternate" href="/" style={{ textDecoration: "none" }}>
                {/* Repas logo */}
                <Image
                  className="hidden xl:block  mx-auto md:mx-0 object-contain  xl:h-[50px] xl:w-[257px]"
                  src="/repas_logo_2.svg"
                  alt="Logo"
                  width={150}
                  height={50}
                  priority
                />
              </Link>
              <div className="pr-10 max-xl:pr-0 flex flex-row justify-end items-center xl:w-[341px]">
                <Link
                  rel="alternate"
                  href="/prisijungimas"
                  style={{ textDecoration: "none" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hidden xl:block my-auto cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                    />
                  </svg>
                </Link>
                <Link
                  className="hidden"
                  href="/logout"
                  style={{ textDecoration: "none" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hidden xl:block my-auto  cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                </Link>
                <Link
                  className="flex flex-col justify-center mx-4"
                  href="/paskyra"
                  style={{ textDecoration: "none" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hidden xl:block my-auto  cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </Link>
                <Link
                  className="flex flex-col justify-center mr-4"
                  href="/order"
                  style={{ textDecoration: "none" }}
                >
                  <svg
                    className="hidden xl:block my-auto cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                  >
                    <path
                      d="M13.3006 14.2685H6.08056M13.3006 10.082H6.08056M8.83566 5.90522H6.08066M13.493 0.794922C13.493 0.794922 5.81596 0.798922 5.80396 0.798922C3.04396 0.815922 1.33496 2.63192 1.33496 5.40192V14.5979C1.33496 17.3819 3.05696 19.2049 5.84096 19.2049C5.84096 19.2049 13.517 19.2019 13.53 19.2019C16.29 19.1849 18 17.3679 18 14.5979V5.40192C18 2.61792 16.277 0.794922 13.493 0.794922Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  className="flex flex-col justify-center"
                  href="/cart"
                  style={{ textDecoration: "none" }}
                >
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 my-auto cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                    <div className="hidden">0</div>
                  </div>
                </Link>
                <div className="w-[16px]"></div>

                <div className="w-[16px] hidden xl:block"></div>
                <Link href="/paslaugos" style={{ textDecoration: "none" }}>
                  <div className="hidden xl:block w-[152px] h-[44px] text-center px-4 py-[10px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-6 font-poppins text-base">
                    Užsisakyti
                  </div>
                </Link>
              </div>
            </div>
            <div className="mb-3 xl:mb-3 pt-2 flex flex-row justify-between ">
              {/* For mobile*/}
              <div className="xl:hidden">
                <Link href="/menu/" style={{ textDecoration: "none" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                </Link>
              </div>
              <Link rel="alternate" href="/" style={{ textDecoration: "none" }}>
                <Image
                  className="xl:hidden mx-auto md:mx-0 object-contain  xl:h-[50px] xl:w-[257px]"
                  src="/repas_logo_2.svg"
                  alt="Logo"
                  width={70}
                  height={26}
                  priority
                />
              </Link>
              <div className="hidden xl:flex w-full flex-row justify-center space-x-6 mt-[6px] overflow-hidden">
                {/* Desktop */}
                <Link
                  rel="alternate"
                  href="/skalbimas"
                  style={{ textDecoration: "none" }}
                  className="flex-1 text-center"
                >
                  <div className="font-normal text-RepasBlue xl:hover:underline xl:hover:webkit-text-stroke">
                    Skalbimas
                  </div>
                </Link>
                <Link
                  rel="alternate"
                  href="/kostiumu-valymas"
                  style={{ textDecoration: "none" }}
                  className="flex-1 text-center"
                >
                  <div className="font-normal text-RepasBlue xl:hover:underline xl:hover:webkit-text-stroke">
                    Kostiumu valymas
                  </div>
                </Link>
                <Link
                  rel="alternate"
                  href="/lyginimas"
                  style={{ textDecoration: "none" }}
                  className="flex-1 text-center"
                >
                  <div className="font-normal text-RepasBlue xl:hover:underline xl:hover:webkit-text-stroke">
                    Lyginimas
                  </div>
                </Link>
                <Link
                  rel="alternate"
                  href="/patalines-valymas"
                  style={{ textDecoration: "none" }}
                  className="flex-1 text-center"
                >
                  <div className="font-normal text-RepasBlue xl:hover:underline xl:hover:webkit-text-stroke">
                    Patalines valymas
                  </div>
                </Link>
                <Link
                  rel="alternate"
                  href="/skalbimo-masiniu-tvarkymas"
                  style={{ textDecoration: "none" }}
                  className="flex-1 text-center"
                >
                  <div className="font-normal text-RepasBlue xl:hover:underline xl:hover:webkit-text-stroke">
                    Skalbimo masiniu tvarkymas
                  </div>
                </Link>
              </div>
              {/* Alternative button */}
              <div className="w-[16px] hidden xl:block"></div>
              <Link
                rel="alternate"
                href="/paslaugos"
                style={{ textDecoration: "none" }}
              >
                <div className="xl:hidden lg:px-3 px-[10px] py-[6px] rounded-lg bg-[#Ea5548] xl:hover:bg-[#D43C33] text-white font-bold leading-[22px] font-poppins text-sm">
                  Užsisakyti
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
