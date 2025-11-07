import Link from "next/link";
import Image from "next/image";

// components/footer.tsx
const Footer = () => {
  return (
        <footer>
            <div id="last-element" className="pt-[30px] py-[32px] xl:py-10 px-4 md:px-7 xl:px-[145px] 2xl:px-[185px] ">
              <div className="max-w-[1150px] xl:max-w-[1550px] mx-auto">
                <div className="md:flex flex-row justify-between lg:-ml-[1px]">
                  <Link rel="alternate" href="/" style={{ textDecoration: "none" }}>
                  <Image
                    className="mx-auto md:mx-0 object-contain  xl:h-[120px] xl:w-[260px]"
                    src="/repas_logo.svg"
                    alt="Logo"
                    width={200}         
                    height={80}         
                    priority            
                  />
                  </Link>
                  <div className="mt-6 mb-4 md:mt-0 grid grid-cols-2 gap-x-6 md:gap-x-[65px] gap-y-2 xl:w-max">
                    <div className="text-right md:text-left leading-[22px]   xl:leading-6 font-semibold font-poppins text-sm  xl:text-base">
                      Įmonė</div>
                    <div className="text-left leading-[22px] font-semibold  xl:leading-6 font-poppins text-sm xl:text-base ">
                      Aptarnavimo apskritis</div>
                    <Link  href="/apie-mus" style={{ textDecoration: "none" }}>
                    <div className="text-[--RepasRed] underline text-right md:text-left leading-[22px] font-normal xl:leading-6 hoverwhite xl:w-[91px] font-poppins text-sm xl:text-base ">
                       Apie mus</div>
                    </Link>
                    <div className="text-[--RepasRed] text-left  leading-[22px] font-normal xl:leading-6 font-poppins text-sm xl:text-base ">
                      Šiauliai</div>
                    <a  href="/kontaktai" style={{ textDecoration: "none" }}>
                    <div className="text-[--RepasRed] underline text-right md:text-left  leading-[22px] font-normal  xl:leading-6 hoverwhite xl:w-[91px] font-poppins text-sm xl:text-base ">
                      Susisiekite su mumis</div>
                    </a>
                    </div>
                    </div>
                    <div className="w-[240px] md:w-full bg-[--RepasRed] h-[1px] mx-auto md:my-2"></div>
                    <div className="md:flex flex-row-reverse justify-between">

                      <div className="grid grid-cols-2 gap-x-[27px] xl:gap-x-[25px]  mt-4 mb-2 lg:hidden">
                        <Link href="/terms-and-conditions" className="text-right xl:w-[134px] text-[--RepasRed] leading-5 underline  xl:leading-[22px] hoverbold  text-xs font-poppins xl:text-sm">
                          Terminai ir sąlygos
                        </Link>
                        <Link href="/privacy-notice" className="text-left xl:text-right xl:w-[99px]  text-[--RepasRed]  leading-5 underline xl:leading-[22px] hoverbold  text-xs font-poppins xl:text-sm">
                          Privatumo politika
                        </Link>
                      </div>
                      <div className="hidden lg:flex flex-row  space-x-[24px]  mt-4 mb-2  w-[233px] xl:w-[300px]">
                        <Link href="/terms-and-conditions" className="text-right xl:w-[150px] text-xs text-[--RepasRed] font-poppins leading-5 underline xl:text-sm xl:leading-[22px] hoverbold">
                          Terminai ir sąlygos
                        </Link>
                        <Link href="/privacy-notice" className="text-left xl:text-right xl:w-[150px]  text-xs text-[--RepasRed] font-poppins leading-5 underline xl:text-sm xl:leading-[22px] hoverbold">
                          Privatumo politika
                        </Link>
                      </div>
                        <div className="text-center md:mt-4 text-xs xl:text-sm text-[--RepasRed] font-poppins leading-[18px] xl:leading-6  lg:w-[220px] xl:w-[267px] lg:text-left">
                          © 2025 Repas</div>
                        </div>
                        </div>
                        </div>
                        <div className="xl:hidden h-[25px]"></div>
                        </footer>
  );
};

export default Footer;