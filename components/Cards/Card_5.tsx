import React from "react";

const Card_5 = () => {
  return (
    <a
      rel="alternate"
      className="group w-full flex flex-col py-3 px-2 rounded-[10px]  md:px-4 md:py-6 lg:h-[382px] xl:h-[360px] bg-[#068D9D] xl:hover:bg-[#057080]"
      href="/patalines-valymas"
      style={{ textDecoration: "none" }}
    >
      <div className="w-[64px] h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <ellipse cx="25" cy="12" rx="15" ry="8" fill="white" />
          <ellipse cx="25" cy="12" rx="12" ry="6" fill="white" opacity="0.7" />

          <path
            d="M8 20 L8 28 Q8 30 10 30 L40 30 Q42 30 42 28 L42 20 Q42 18 40 18 L10 18 Q8 18 8 20 Z"
            fill="#EA5548"
          />
          <rect x="10" y="20" width="30" height="3" fill="#d94a3d" />

          <path d="M6 32 L6 40 Q6 42 8 42 L42 42 Q44 42 44 40 L44 32 Q44 30 42 30 L8 30 Q6 30 6 32 Z" fill="#494B8B" />
          <rect x="8" y="32" width="34" height="3" fill="#3a3c6e" />

          <rect x="4" y="42" width="42" height="4" rx="1" fill="white" opacity="0.9" />
          <rect x="2" y="46" width="46" height="2" rx="1" fill="white" opacity="0.7" />
        </svg>
      </div>

      <div className="hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90" fill="none">
          <ellipse cx="45" cy="22" rx="27" ry="14" fill="white" />
          <ellipse cx="45" cy="22" rx="22" ry="11" fill="white" opacity="0.7" />

          <path
            d="M14 36 L14 50 Q14 54 18 54 L72 54 Q76 54 76 50 L76 36 Q76 32 72 32 L18 32 Q14 32 14 36 Z"
            fill="#EA5548"
          />
          <rect x="18" y="36" width="54" height="5" fill="#d94a3d" />

          <path
            d="M11 57 L11 72 Q11 76 15 76 L75 76 Q79 76 79 72 L79 57 Q79 54 75 54 L15 54 Q11 54 11 57 Z"
            fill="#494B8B"
          />
          <rect x="15" y="57" width="60" height="5" fill="#3a3c6e" />

          <rect x="7" y="76" width="76" height="7" rx="2" fill="white" opacity="0.9" />
          <rect x="4" y="83" width="82" height="3" rx="1.5" fill="white" opacity="0.7" />
        </svg>
      </div>

      <div className="my-1 md:my-4 text-white font-bold text-center group-hover:underline">
        <h4>Patalinės valymas</h4>
      </div>
      <div className="font-poppins text-sm md:text-base font-normal text-white leading-[22px] md:leading-6 text-center break-words xl:group-hover:text-mlBlack">
        Sutvarkome Jūsų patalynę
      </div>
      <div className="flex-1"></div>
      <button className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-white text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins transition-all duration-300 ease-in-out xl:group-hover:bg-white xl:group-hover:border-white xl:group-hover:text-red-600">
        Užsisakyti
      </button>
    </a>
  )
}

export default Card_5;