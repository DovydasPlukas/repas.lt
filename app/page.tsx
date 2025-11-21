import Cards from "@/components/Cards";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/How_it_works";
import FAQ from "@/components/Faq";


export default function Home() {
  return (
    <main>
      <div className=" px-4 md:px-[28px] xl:px-[145px] 2xl:px-0 ">
        <div className="mt-5 w-full sm:max-w-[688px]  md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto">

            <HeroSection /> {/*ZIP code*/}

            <div className="mt-16">
              <Cards /> {/*Order objects*/}
            </div>

            <HowItWorks /> {/*How it works container*/}

            <FAQ /> {/*FAQs*/}

          </div>
      </div>
    </main>
  )
}