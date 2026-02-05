/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import React from "react";

function TermsAndConditions() {
  // Statinė data
  const updatedAt = "2026 m. Vasario 5 d.";

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[--RepasBlue] px-6 py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">
            Terminai ir sąlygos
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
            Susipažinkite su mūsų paslaugų teikimo sąlygomis
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">1. Bendrosios nuostatos</h2>
              <p className="text-gray-600 leading-relaxed">
                Šios taisyklės ir sąlygos (toliau – Sąlygos) reglamentuoja UAB "Repas" (toliau – Repas)
                teikiamų skalbimo, valymo ir su tuo susijusių paslaugų sąlygas ir tvarką.
                Naudodamiesi mūsų paslaugomis, jūs sutinkate su šiomis Sąlygomis.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. Paslaugų užsakymas</h2>
              <p className="text-gray-600 leading-relaxed">
                Paslaugos užsakomos per Repas svetainę.
                Užsakymo metu klientas privalo pateikti tikslią informaciją apie pasirinktas paslaugas, adreso duomenis ir
                kontaktinę informaciją. Mes turime teisę atsisakyti užsakymo arba siūlyti alternatyvų įvykdymo laiką,
                jei yra objektyvių priežasčių (pvz. techniniai apribojimai, darbuotojų užimtumas).
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3. Paslaugų kainos ir apmokėjimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Visos kainos nurodomos eurais ir, jei taikoma, su PVM. Galutinė kaina yra ta, kuri nurodyta
                užsakymo patvirtinimo metu. Atsiskaitymas gali vykti vietoje arba per trečiųjų šalių mokėjimo
                paslaugas — mes nekaupiame ir neišsaugome kortelių duomenų.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">4. Paslaugų teikimo terminai</h2>
              <p className="text-gray-600 leading-relaxed">
                Standartinis paslaugų atlikimo terminas yra 2–3 darbo dienos nuo užsakymo priėmimo, jei nėra
                sutarta kitaip. Skubių užsakymų terminai ir papildomos kainos aptariami atskirai.
                Pristatymo / paėmimo laikai nurodomi užsakymo metu ir gali keistis dėl logistikos priežasčių.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">5. Paėmimas ir pristatymas</h2>
              <p className="text-gray-600 leading-relaxed">
                Repas paima jūsų skalbinius iš nurodyto adreso ir po paslaugos pristato juos atgal.
                Prašome pateikti tikslų adresą ir būti pasiekiamiems sutartu laiku. Jei reikės susisiekti
                dėl užsakymo ar pristatymo, naudosime jūsų nurodytą telefono numerį. Pristatymo laikas
                gali nežymiai keistis dėl eismo ar kitų nenumatytų aplinkybių.
              </p>
            </div>


            <div className="space-y-4">
              <h2 className="text-2xl font-bold">6. Atšaukimas ir grąžinimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Jei norite atšaukti užsakymą prieš paslaugos suteikimą, praneškite kuo skubiau. Už atšaukimą gali būti
                taikomi atšaukimo mokesčiai, jei paslauga jau paruošta arba jei yra papildomų išlaidų.
                Jei pastebėjote trūkumą paslaugos atlikimo metu (pvz. netinkama priežiūra), susisiekite per {" "}
                <strong>
                  <Link href="/kontaktai" className="text-[--RepasBlue] underline hover:opacity-80">
                    kontaktų puslapį
                  </Link>
                </strong> ir mes spręsime situaciją.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">7. Atsakomybė</h2>
              <p className="text-gray-600 leading-relaxed">
                Repas atsako už paslaugų kokybę ir, esant įrodytai mūsų kaltės žalai, prisiima atsakomybę pagal
                galiojančius teisės aktus. Mes neatsakome už drabužių pažeidimus, natūralų nusidėvėjimą
                ar už prekes, kurios nebuvo pažymėtos kaip jautrios specialiai priežiūrai.
                Kliento atsakomybė yra pateikti išsamią informaciją apie drabužių priežiūrą ir reagavimo pageidavimus.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">8. Sąlygų keitimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Repas pasilieka teisę bet kada keisti šias Sąlygas. Apie pakeitimus informuojame paskelbdami atnaujintą
                versiją svetainėje. Pakeitimai įsigalioja nuo jų paskelbimo dienos, jei nenurodyta kitaip.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">9. Kontaktai</h2>
              <p className="text-gray-600 leading-relaxed">
                Dėl klausimų ar pretenzijų susijusių su paslaugomis kreipkitės per{" "}
                <strong>
                  <Link href="/kontaktai" className="text-[--RepasBlue] underline hover:opacity-80">
                    kontaktų puslapį
                  </Link>
                </strong>.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-gray-500">
                Paskutinį kartą atnaujinta: {updatedAt}.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default TermsAndConditions;