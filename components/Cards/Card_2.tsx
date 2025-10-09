import React from "react";

const Card_2 = () => {
  return (
    <a
      rel="alternate"
      className="group w-full flex flex-col py-3 px-2 rounded-[10px]  md:px-4 md:py-6 lg:h-[382px] xl:h-[360px] bg-[#984447] xl:hover:bg-[#b75255]"
      href="/kostiumu-valymas"
      style={{ textDecoration: "none" }}
    >
      <div className="w-[64px] h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
          <path d="M29 6L12 13V50C12 52 13 54 15 54H43C45 54 46 52 46 50V13L29 6Z" fill="#494B8B" />
          <path d="M29 6L12 13V30L22 20L29 26V6Z" fill="#3A3D6E" />
          <path d="M29 6L46 13V30L36 20L29 26V6Z" fill="#3A3D6E" />
          <path d="M29 6L22 20L29 26L36 20L29 6Z" fill="white" />
          <path d="M29 26L26 29V42L29 46L32 42V29L29 26Z" fill="#2E3159" />
          <circle cx="21" cy="32" r="1.5" fill="white" />
          <circle cx="21" cy="39" r="1.5" fill="white" />
          <circle cx="21" cy="46" r="1.5" fill="white" />
          <rect x="33" y="22" width="7" height="4" rx="0.5" fill="white" opacity="0.8" />
        </svg>
      </div>

      <div className="hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M50 10L20 22V86C20 89 22 92 25 92H75C78 92 80 89 80 86V22L50 10Z" fill="#494B8B" />
          <path d="M50 10L20 22V52L38 36L50 45V10Z" fill="#3A3D6E" />
          <path d="M50 10L80 22V52L62 36L50 45V10Z" fill="#3A3D6E" />
          <path d="M50 10L38 36L50 45L62 36L50 10Z" fill="white" />
          <path d="M50 45L45 50V72L50 78L55 72V50L50 45Z" fill="#2E3159" />
          <circle cx="36" cy="56" r="2.5" fill="white" />
          <circle cx="36" cy="68" r="2.5" fill="white" />
          <circle cx="36" cy="80" r="2.5" fill="white" />
          <rect x="57" y="40" width="12" height="8" rx="1" fill="white" opacity="0.8" />
        </svg>
      </div>

      <div className="my-1 md:my-4 text-white font-bold text-center group-hover:underline">
        <h4>Kostiumų valymas</h4>
      </div>
      <div className="font-poppins text-sm md:text-base font-normal text-white leading-[22px] md:leading-6 text-center break-words xl:group-hover:text-mlBlack">
        Specialus kostiumų valymas (paklausti)
      </div>
      <div className="flex-1"></div>
      <button className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-white text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins transition-all duration-300 ease-in-out xl:group-hover:bg-white xl:group-hover:border-white xl:group-hover:text-red-600">
        Užsisakyti
      </button>
    </a>
  )
}

export default Card_2;
