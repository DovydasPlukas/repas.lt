import React from "react";

const Card_3 = () => {
  return (
   
        <a
          rel="alternate"
          className="group w-full flex flex-col py-3 px-2 rounded-[10px]  md:px-4 md:py-6 lg:h-[382px] xl:h-[360px]  bg-[#45B69C] xl:hover:bg-[#4dcaad]"
          href="/lyginimas"
          style={{ textDecoration: "none" }}
        >
          <div className="w-[64px] h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="61"
              height="34"
              viewBox="0 0 61 34"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.5756 17.3972H54.5646C54.8937 17.3972 55.1635 17.1303 55.1635 16.7982V6.13576C55.1635 5.80367 54.8848 5.53385 54.5527 5.53978C40.7177 5.73548 34.6185 8.19057 28.1101 16.4454C27.8047 16.8338 28.0834 17.3972 28.5756 17.3972ZM3.56515 24.9107H60.1182C60.4503 24.9107 60.7172 24.6438 60.7172 24.3117V0.596983C60.7201 0.264894 60.4384 -0.00196405 60.1063 0.00100103C30.0018 0.353846 17.1808 5.64356 3.09963 23.95C2.79719 24.3414 3.07294 24.9107 3.56811 24.9107H3.56515Z"
                fill="white"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.45544 26.494H59.6912C60.2576 26.494 60.7201 26.9922 60.7201 27.6089V32.8868C60.7201 33.5005 60.2605 33.9987 59.6912 33.9987H1.80685C1.10413 33.9987 0.608956 33.2515 0.834302 32.528L2.47992 27.2531C2.62225 26.8024 3.01364 26.497 3.45247 26.497L3.45544 26.494Z"
                fill="#A7EDE7"
              ></path>
            </svg>
          </div>
          <div className="hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="111"
              height="64"
              viewBox="0 0 111 64"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.7597 32.7291H99.4545C100.058 32.7291 100.554 32.2393 100.554 31.6299V12.0622C100.554 11.4528 100.042 10.9576 99.4327 10.9685C74.0427 11.3276 62.8495 15.8332 50.9054 30.9823C50.3449 31.6952 50.8564 32.7291 51.7597 32.7291ZM5.86062 46.5178H109.646C110.256 46.5178 110.746 46.0281 110.746 45.4187V1.8975C110.751 1.28805 110.234 0.798314 109.625 0.803756C54.3771 1.45129 30.848 11.1589 5.0063 44.7548C4.45127 45.4731 4.95733 46.5178 5.86606 46.5178H5.86062Z"
                fill="white"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.65928 49.4236H108.863C109.902 49.4236 110.751 50.3378 110.751 51.4696V61.1555C110.751 62.2819 109.908 63.196 108.863 63.196H2.63381C1.34417 63.196 0.435438 61.8248 0.848993 60.4971L3.86903 50.8166C4.13022 49.9895 4.8485 49.429 5.65384 49.429L5.65928 49.4236Z"
                fill="#A7EDE7"
              ></path>
            </svg>
          </div>

          <div className="my-1 md:my-4 text-white font-bold text-center group-hover:underline">
            <h4>Lyginimas</h4>
          </div>
          <div className="font-poppins text-sm md:text-base font-normal text-white leading-[22px] md:leading-6 text-center break-words xl:group-hover:text-mlBlack">
            Drabužių ir audinių išlyginimas (paklausti)
          </div>
          <div className="flex-1"></div>
          <button className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-white text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins  xl:group-hover:bg-white xl:group-hover:border-white xl:group-hover:text-red-600">
          Užsisakyti
          </button>
        </a>
       
  );
};

export default Card_3;
