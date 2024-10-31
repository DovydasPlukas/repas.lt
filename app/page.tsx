import Link from "next/link";
import ProductCard from "./Components/ProductCard";

export default function Home() {
  return (
    <main>
      <div className=" px-4 md:px-[28px] xl:px-[145px] 2xl:px-0 ">
        <div className="min-h-screen w-full  sm:max-w-[688px]  md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto">
            <h1>Boilerplate stuff to test out</h1>

            <Link href="/paslaugos">Paslaugos</Link> {/*changing <a> to <Link> to optimise */}
            <ProductCard/> {/*Testing components */}
            <p>{new Date().toLocaleTimeString()}</p> {/*To test out if server client is static (helps with transporting code) */}

            <div className='flex items-center justify-center bg"'>
              <h1 className="text-3xl font-bold">Pagrindinius puslapis</h1>
            </div>
          </div>
      </div>
    </main>
  )
}