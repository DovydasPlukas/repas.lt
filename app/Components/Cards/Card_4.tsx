import React from "react";

const Card_4 = () => {
  return (
        <a
          rel="alternate"
          className="group w-full flex flex-col py-3 px-2 rounded-[10px]  md:px-4 md:py-6 lg:h-[382px] xl:h-[360px] bg-[#f3d37a] xl:hover:bg-[#fad879] xl:hover:text-black"
          href="/skalbimo-masinu-tvarkymas"
          style={{ textDecoration: "none" }}
        >
          <div className="w-[64px] h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
            
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-25 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
          </div>
          <div className="hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-25 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
          </div>
          <h4 className="my-1 md:my-4 text-offWhite ">
            <div className="hidden xl:block">Skalbimo masiniu tvarkymas
            </div>
            <div className="xl:hidden">
            Skalbimo masiniu tvarkymas
            <div></div>
            </div>
          </h4>
          <div className="font-poppins text-sm md:text-base font-normal leading-[22px] md:leading-6 text-center text-lightGrey ">
            <div className="xl:hidden">
            Skalbimo masiniu tvarkymas
            </div>
            <div className="hidden xl:block">
            Skalbimo masiniu tvarkymas
            </div>
          </div>
          <div className="flex-1"></div>
          <button className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-black text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins">
            Užsisakyti
          </button>
        </a>
  );
};

export default Card_4;
