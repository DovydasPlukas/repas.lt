import Link from "next/link";
import ProductCard from "./Components/ProductCard";
import Navbar from "./Components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar/>

      <h1>Boilerplate stuff to test out</h1>

      <Link href="/paslaugos">Paslaugos</Link> {/*changing <a> to <Link> to optimise */}
      <ProductCard/> {/*Testing components */}
      <p>{new Date().toLocaleTimeString()}</p> {/*To test out if server client is static (helps with transporting code) */}

      <div className='flex items-center justify-center bg"'>
        <h1 className="text-3xl font-bold">Pagrindinius puslapis</h1>
      </div>
    </main>
  )
}