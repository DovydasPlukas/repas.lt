import React from "react";


const Card_1 = () => {
  return (
        <a
          rel="alternate"
          className="group w-full flex flex-col py-3 px-2 rounded-[10px]  md:px-4 md:py-6 lg:h-[382px] xl:h-[360px] bg-[--RepasBlue] xl:hover:bg-[#505ba3]"
          href="/skalbimas"
          style={{ textDecoration: "none" }}
        >
          <div className="w-[64px] h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
            <svg
              className="mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="49"
              height="50"
              viewBox="0 0 49 50"
              fill="none"
            >
              <path
                d="M44 0H5C2.23858 0 0 2.23858 0 5V45C0 47.7614 2.23858 50 5 50H44C46.7614 50 49 47.7614 49 45V5C49 2.23858 46.7614 0 44 0Z"
                fill="white"
                fillOpacity="0.5"
              />
              <path
                d="M24.5 15C26.433 15 28 13.433 28 11.5C28 9.567 26.433 8 24.5 8C22.567 8 21 9.567 21 11.5C21 13.433 22.567 15 24.5 15Z"
                fill="white"
              />
              <path
                d="M36 11.5C36 12.8807 34.8807 14 33.5 14C32.1193 14 31 12.8807 31 11.5C31 10.1193 32.1193 9 33.5 9C34.8807 9 36 10.1193 36 11.5Z"
                fill="white"
              />
              <path
                d="M18 11.5C18 12.8807 16.8807 14 15.5 14C14.1193 14 13 12.8807 13 11.5C13 10.1193 14.1193 9 15.5 9C16.8807 9 18 10.1193 18 11.5Z"
                fill="white"
              />
              <path
                d="M24.5 42C31.4036 42 37 36.4036 37 29.5C37 22.5964 31.4036 17 24.5 17C17.5964 17 12 22.5964 12 29.5C12 36.4036 17.5964 42 24.5 42Z"
                fill="white"
              />
              <path
                d="M24.5 38C29.1944 38 33 34.1944 33 29.5C33 24.8056 29.1944 21 24.5 21C19.8056 21 16 24.8056 16 29.5C16 34.1944 19.8056 38 24.5 38Z"
                fill="#505ba3"
                fillOpacity="0.75"
              />
            </svg>
          </div>
          <div className=" hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">
            <svg
              className="mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="97"
              height="102"
              viewBox="0 0 97 102"
              fill="none"
            >
              <path
                d="M87 0H10C4.47715 0 0 4.47715 0 10V92C0 97.5229 4.47715 102 10 102H87C92.5229 102 97 97.5229 97 92V10C97 4.47715 92.5229 0 87 0Z"
                fill="white"
                fillOpacity="0.5"
              />
              <path
                d="M48.5 30C52.366 30 55.5 26.866 55.5 23C55.5 19.134 52.366 16 48.5 16C44.634 16 41.5 19.134 41.5 23C41.5 26.866 44.634 30 48.5 30Z"
                fill="white"
              />
              <path
                d="M71 23C71 25.7614 68.7614 28 66 28C63.2386 28 61 25.7614 61 23C61 20.2386 63.2386 18 66 18C68.7614 18 71 20.2386 71 23Z"
                fill="white"
              />
              <path
                d="M36 23C36 25.7614 33.7614 28 31 28C28.2386 28 26 25.7614 26 23C26 20.2386 28.2386 18 31 18C33.7614 18 36 20.2386 36 23Z"
                fill="white"
              />
              <path
                d="M48.5 86C62.5833 86 74 74.5833 74 60.5C74 46.4167 62.5833 35 48.5 35C34.4167 35 23 46.4167 23 60.5C23 74.5833 34.4167 86 48.5 86Z"
                fill="white"
              />
              <path
                d="M48.5 78C58.165 78 66 70.165 66 60.5C66 50.835 58.165 43 48.5 43C38.835 43 31 50.835 31 60.5C31 70.165 38.835 78 48.5 78Z"
                fill="#505ba3"
                fillOpacity="0.75"
              />
            </svg>
          </div>
          
          <div className="my-1 md:my-4 text-white font-bold text-center group-hover:underline">
            <h4>Skalbimas</h4>
          </div>
          <div className="font-poppins text-sm md:text-base font-normal text-white leading-[22px] md:leading-6 text-center break-words xl:group-hover:text-mlBlack">
            Drabužių skalbimas pagal svorį (paklausti)
          </div>
          <div className="flex-1"></div>
          <button className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-white text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins transition-all duration-300 ease-in-out xl:group-hover:bg-white xl:group-hover:border-white xl:group-hover:text-red-600">
          Užsisakyti
          </button>
        </a>
  );
};

export default Card_1;
