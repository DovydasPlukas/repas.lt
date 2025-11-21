import Cards from '@/components/Cards';
import React from 'react';

const Cart: React.FC = () => {
  return (

<main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[--RepasBlue] px-6 py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">Vežymėlis</h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className='px-4 md:px-[28px] xl:px-[145px] 2xl:px-0 '> 
            <div className='mt-5 text-center w-full sm:max-w-[688px]  md:max-w-[968px] lg:max-w-[1150px] xl:max-w-[1550px] mx-auto'>
                <div className='p-10'>
                    <Cards/>
                </div>
            </div>
        </div>
    </section>
</main>
  );
};

export default Cart;