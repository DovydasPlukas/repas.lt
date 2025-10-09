import React from "react";

const Card_3 = () => {
  return (
    <a
      rel="alternate"
      className="group w-full flex flex-col py-3 px-2 rounded-[10px]  md:px-4 md:py-6 lg:h-[382px] xl:h-[360px]  bg-[#45B69C] xl:hover:bg-[#3a9d87]"
      href="/lyginimas"
      style={{ textDecoration: "none" }}
    >
      <div className="w-[64px] h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="61" height="34" viewBox="0 0 61 34" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 22.5H60.5C61.05 22.5 61.5 22.05 61.5 21.5V0.5C61.5 -0.05 61.05 -0.5 60.5 -0.5C28.5 0 15.5 5.5 2.5 22.5Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 24.5H59.5C60.33 24.5 61 25.17 61 26V31C61 31.83 60.33 32.5 59.5 32.5H1.5C0.67 32.5 0.17 31.67 0.5 31L2.5 25.5C2.67 25 3.17 24.5 3.67 24.5H2.5Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>
      <div className="hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="111" height="64" viewBox="0 0 111 64" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 42H110C111.1 42 111.5 41.5 111.5 40.5V1C111.5 0 111 -0.5 110 -0.5C52 0.5 28 10 4 42Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 47H109C110.66 47 111.5 48.34 111.5 50V59C111.5 60.66 110.66 62 109 62H2C0.34 62 -0.5 60.34 0.5 59L3.5 48.5C3.83 47.5 4.83 47 5.83 47H4Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      <div className="my-1 md:my-4 text-white font-bold text-center group-hover:underline">
        <h4>Lyginimas</h4>
      </div>
      <div className="font-poppins text-sm md:text-base font-normal text-white leading-[22px] md:leading-6 text-center break-words xl:group-hover:text-mlBlack">
        Drabužių ir audinių išlyginimas (paklausti)
      </div>
      <div className="flex-1"></div>
      <button className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-white text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins transition-all duration-300 ease-in-out xl:group-hover:bg-white xl:group-hover:border-white xl:group-hover:text-red-600">
        Užsisakyti
      </button>
    </a>
  )
}

export default Card_3;