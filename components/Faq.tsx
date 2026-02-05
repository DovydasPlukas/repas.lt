"use client";

import { useState } from "react";
import Image from "next/image";

const faqs = [
  {
    question: "Kokias teritorijas aptarnaujate?",
    answer:
      "Šiuo metu teikiame paslaugas Šiaulių mieste ir jo apylinkėse.",
  },
  {
    question: "Per kiek laiko atvykstate atsiimti skalbinių po užsakymo pateikimo?",
    answer:
      "Pasirenkate laiką, o mes atvykstame tuo laikotarpiu. Jei vėluojame – pranešame.",
  },
  {
    question: "Kiek laiko trunka užsakymo įvykdymas?",
    answer:
      "Dažniausiai užsakymas įvykdomas per 24–48 valandas nuo atsiėmimo, priklausomai nuo paslaugos tipo ir pristatymo laiko.",
  },
  {
    question: "Kaip apskaičiuojama paslaugų kaina?",
    answer:
      "Kaina priklauso nuo skalbinių kiekio, tipo ir pasirinktos paslaugos (plovimas, lyginimas, valymas ir kt.).",
  },
  {
    question: "Kokius mokėjimo būdus priimate?",
    answer:
      "Priimame mokėjimus kortele, bankiniu pavedimu ir grynaisiais drabužių paėmimo metu.",
  },
  {
    question: "Ar galiu pakeisti arba atšaukti užsakymą?",
    answer:
      "Taip, susisiekite su mumis kuo anksčiau telefonu arba per kontaktų puslapį.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 px-4 md:px-[115px] lg:px-[152px] xl:px-[145px] 2xl:px-[0px] mx-auto max-w-[1550px] py-12">
      <div>
        <h2 className="text-center text-2xl font-bold text-[#494B8B] xl:text-3xl">
          Dažniausiai užduodami klausimai
        </h2>
        <div className="h-[2px] bg-[#494B8B] w-[45px] mx-auto my-4 xl:w-[60px] xl:my-6"></div>
        <p className="text-center text-sm text-textDarkGrey leading-[22px] xl:text-base xl:leading-[24px] font-poppins">
          Čia pateikiame dažniausiai užduodamus klausimus apie mūsų skalbimo paslaugų užsakymo sistemą.
        </p>

        <div className="my-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#D0D3E5] py-2">
              <button
                className="w-full flex justify-between items-center text-left text-sm xl:text-base font-semibold text-textDarkGrey py-2 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <svg
                  className={`w-5 h-5 text-[#494B8B] transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 text-[#6E7191] text-sm xl:text-base font-poppins ${
                  openIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="pb-3">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
        </div>
      </div>

      <div className="hidden lg:flex justify-center items-center">
        <Image
          src="/Faq.jpg"
          alt="FAQ iliustracija"
          width={435}
          height={435}
          className="hidden mt-[52px] lg:block w-[285px] h-[285px] lg:h-[329px] lg:w-[329px] xl:h-[435px] xl:w-[435px]  mx-auto  my-auto  rounded-full"
        />
      </div>
    </section>
  );
}