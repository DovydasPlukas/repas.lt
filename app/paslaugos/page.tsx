import React from 'react'
import Cards from '../Components/Cards'

const PaslaugosPage = () => {
  return (
     
    <div className='px-4 md:px-[28px] xl:px-[145px] 2xl:px-0 '> 
      <div className='mt-5 text-center w-full sm:max-w-[688px]  md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto'>
      <h1 className="text-3xl font-bold p-10">Paslaugos puslapis</h1>
      <p className="text-xl font-bold p-10">Pasirinkite norima paslauga</p>
        <div className='p-10'>
        <Cards/>
        </div>
      </div>
    </div>
  )
}

export default PaslaugosPage
