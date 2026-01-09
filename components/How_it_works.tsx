import Image from "next/image"
import React from "react"

export default function HowItWorks() {
  return (
    <section className="mt-[48px] xl:mt-20">
      <h2 className="text-center text-3xl font-bold xl:text-4xl">Kaip tai veikia</h2>
      <div className="h-[2px] bg-[#494B8B] w-[45px] mx-auto my-4 xl:w-[60px] xl:my-6"></div>

      <div className="text-center break-words text-sm text-[var(--text-dark-grey)] leading-[22px] xl:text-base xl:leading-[24px] max-w-[1150px] mx-auto">
        Mūsų profesionali skalbimo paslauga padaro drabužių skalbimą tokį pat
        greitą ir patogų kaip apsipirkimą internetu. Mūsų patogi naudoti sąsaja leidžia pritaikyti užsakymo pagal
        Jūsų pageidavimus.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 md:gap-10 mb-6 xl:mb-10 xl:mt-4 mx-auto lg:max-w-[724px] xl:max-w-[924px] 2xl:max-w-none">
        {/* Step 1 */}
        <div className="mt-6 flex flex-row-reverse md:flex-col-reverse">
          <div className="w-full">
            <h3 className="text-left sm:text-center text-xl font-semibold">Pasirinkite ir pritaikykite</h3>
            <div className="text-xs font-normal text-[var(--text-dark-grey)] leading-[18px] xl:text-sm xl:leading-[22px] mt-2 sm:text-center md:h-[110px]">
              Pasirinkę mūsų siūlomas paslaugas, galite pritaikyti savo užsakymą
              su papildomomis paslaugomis ir priedais patraukliomis kainomis.
            </div>
          </div>
          <div className="w-7 h-7"></div>
          <Image
            alt="Asmuo galvojantis apie skalbimo paslaugas (Iliustracija)"
            className="object-cover w-[136px] h-[136px] md:w-[245px] md:h-[245px] m-auto rounded-full"
            src="/Thinking.png"
            width={245}
            height={245}
          />
        </div>

        {/* Step 2 */}
        <div className="mt-6 flex flex-row md:flex-col-reverse">
          <div className="w-full">
            <h3 className="text-left sm:text-center text-xl font-semibold">Aiškios kainos</h3>
            <div className="text-xs font-normal text-[var(--text-dark-grey)] leading-[18px] xl:text-sm xl:leading-[22px] mt-2 sm:text-center md:h-[110px]">
                Visos mūsų kainos yra visiškai įtrauktos.
                Mokame už daiktų skaičių, o ne už svorį, ir visos kainos aiškiai nurodytos.
            </div>
          </div>
          <div className="w-7 h-7"></div>
          <Image
            alt="Kainų skaičiuoklė (Iliustracija)"
            className="object-cover w-[136px] h-[136px] md:w-[245px] md:h-[245px] m-auto rounded-full"
            src="/Money.png"
            width={245}
            height={245}
          />
        </div>

        {/* Step 3 */}
        <div className="mt-6 flex flex-row-reverse md:flex-col-reverse">
          <div className="w-full">
            <h3 className="text-left sm:text-center text-xl font-semibold">Greitas paėmimas</h3>
            <div className="text-xs font-normal text-[var(--text-dark-grey)] leading-[18px] xl:text-sm xl:leading-[22px] mt-2 sm:text-center md:h-[110px]">
              Užsakykite iki 21:00 valandos ir mes pasiimame jūsų drabužius kitą dieną jums patogiu laiku. Mūsų patikimi
              vairuotojai atvyks į jūsų duris nustatytu laiku.
            </div>
          </div>
          <div className="w-7 h-7"></div>
          <Image
            alt="Pristatymo automobilis (Iliustracija)"
            className="object-cover w-[136px] h-[136px] md:w-[245px] md:h-[245px] m-auto rounded-full"
            src="/delivery-van.png"
            width={245}
            height={245}
          />
        </div>

        {/* Step 4 */}
        <div className="mt-6 flex flex-row md:flex-col-reverse">
          <div className="w-full">
            <h3 className="text-left sm:text-center text-xl font-semibold">Grąžinimas kitą dieną</h3>
            <div className="text-xs font-normal text-[var(--text-dark-grey)] leading-[18px] xl:text-sm xl:leading-[22px] mt-2 sm:text-center md:h-[110px]">
              Jūsų drabužiai bus profesionaliai išvalyti ir grąžinti jums kitą dieną švarūs, švieži ir paruošti dėvėti.
              Garantuojame kokybę ir greitą aptarnavimą.
            </div>
          </div>
          <div className="w-7 h-7"></div>
          <Image
            alt="Švarūs drabužiai (Iliustracija)"
            className="object-cover w-[136px] h-[136px] md:w-[245px] md:h-[245px] m-auto rounded-full"
            src="/clean-folded-clothes.jpg"
            width={245}
            height={245}
          />
        </div>
      </div>
    </section>
  )
}