import Link from "next/link";
import TestCard from "@/components/TestCard";
import Cards from "@/components/Cards";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/How_it_works";
import FAQ from "@/components/Faq";


export default function Home() {
  return (
    <main>
      <div className=" px-4 md:px-[28px] xl:px-[145px] 2xl:px-0 ">
        <div className="mt-5 w-full sm:max-w-[688px]  md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto">

          {/*
            <div className='flex items-center justify-center bg"'>
              <h1 className="text-3xl font-bold p-11">Pagrindinius puslapis</h1>
            </div>
          */}

            <HeroSection /> {/*ZIP code*/}
            <div className="mt-16">
              <Cards /> {/*order objects*/}
            </div>

            {/*how it works container*/}
            <HowItWorks />
            {/*FAQs*/}
            <FAQ />


            {/*Testing */}
            <div className="pt-10 hidden">  {/*Hidden */}
            <h1>Boilerplate stuff to test out</h1>
            <Link href="/paslaugos">Paslaugos</Link> {/*changing <a> to <Link> to optimise */}

            <TestCard/> {/*Testing components */}
            <p>{new Date().toLocaleTimeString()}</p> {/*To test out if server client is static (helps with transporting code) */}
            </div>

          </div>
      </div>
    </main>
  )
}