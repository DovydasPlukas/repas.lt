/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import React from "react";

function PrivacyNotice() {
  // Statinė data
  const updatedAt = "2026 m. Vasario 5 d.";

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[--RepasBlue] px-6 py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">
            Privatumo politika
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
            Jūsų privatumo apsauga mums yra svarbi.
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
                Ši privatumo politika apibrėžia, kaip UAB "Repas" (toliau – „mes“) renka,
                naudoja, saugo ir tvarko Jūsų asmens duomenis naudojantis mūsų svetaine.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. Slapukai ir lokalus saugojimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Naudodamiesi šiuo puslapiu jūs sutinkate su mūsų <strong>slapukų politika</strong>.
                Slapukai ir (ar) vietinė naršyklės saugykla (localStorage) gali būti naudojami:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>naudotojo autentifikacijos ir sesijos palaikymui (lokaliai);</li>
                <li>vartotojo pridėtų paslaugų / užsakymo krepšelio laikinam saugojimui naršyklėje;</li>
                <li>svetainės naudojimo patirties gerinimui (pvz. nustatymai, prevencinė apsauga nuo CSRF ir kt.).</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Galite valdyti arba ištrinti slapukus savo naršyklės nustatymuose. Tačiau tai gali
                paveikti tam tikrų svetainės funkcijų veikimą.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3. Kokius duomenis renkame</h2>
              <p className="text-gray-600 leading-relaxed">Duomenų bazėje saugomi šie duomenys:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>El. pašto adresas (registracija per el. paštą arba Google);</li>
                <li>Vardas ir pavardė;</li>
                <li>Telefono numeris;</li>
                <li>Pristatymo / paėmimo adresas;</li>
                <li>Paėmimo ir pristatymo laikas;</li>
                <li>Užsakymo informacija ir jo reikalavimai / komentarai;</li>
                <li>Prisijungimo informacija: jei registruojatės el. paštu – saugomas ir slaptažodis.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                <strong>Mokėjimo būdai nėra saugomi.</strong> Jei mokėjimai vykdomi per trečiųjų
                šalių paslaugas, mes neįrašome kortelių duomenų mūsų duomenų bazėje.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">4. Registracija per Google</h2>
              <p className="text-gray-600 leading-relaxed">
                Jei registruojatės arba prisijungiate per Google, vartotojo informacija gaunama per
                Google autorizaciją (OAuth). Mes saugome tik tuos duomenis, kuriuos leidžiate
                perduoti (pvz. el. paštą, vardą). Google veikia kaip trečiosios šalies teikėjas –
                detalesnę informaciją apie Google privatumo praktiką rasite tiesiogiai pas Google.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">5. Duomenų naudojimo tikslai</h2>
              <p className="text-gray-600 leading-relaxed">
                Jūsų duomenys yra naudojami šiais tikslais:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>užsakymų apdorojimui ir vykdymui;</li>
                <li>klientų aptarnavimui ir susisiekimui (kontaktams);</li>
                <li>paslaugų teikimo logistikai (paėmimo/pristatymo laiko planavimui);</li>
                <li>teisiniams ir apskaitos reikalavimams vykdyti, jeigu taikoma.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">6. Duomenų saugojimas ir saugumas</h2>
              <p className="text-gray-600 leading-relaxed">
                Duomenys saugomi mūsų duomenų bazėje (serveryje). Slaptažodžiai yra užšifruoti.
                Jei pageidaujate ištrinti ar atnaujinti savo duomenis, kreipkitės per{' '}
                <strong>
                  <Link href="/kontaktai" className="text-[--RepasBlue] underline hover:opacity-80">
                    kontaktų puslapį
                  </Link>
                </strong>.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">7. Duomenų atskleidimas tretiesiems asmenims</h2>
              <p className="text-gray-600 leading-relaxed">
                Duomenys gali būti perduoti tik paslaugų teikėjams, reikalingiems paslaugoms teikti
                (pvz. pristatymo partneriams), arba teisėsaugai, jei to reikalauja įstatymai.
                Registracija per Google reiškia, kad dalis duomenų gaunama per Google autorizaciją.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">8. Jūsų teisės</h2>
              <p className="text-gray-600 leading-relaxed">Jūs turite teisę:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>susipažinti su savo asmens duomenimis;</li>
                <li>reikalauti neteisingų duomenų taisymo;</li>
                <li>prašyti duomenų ištrynimo („teisė būti pamirštam“), jeigu netrukdo teisėtiems
                    mūsų ar trečiųjų šalių reikalavimams;</li>
                <li>riboti duomenų tvarkymą;</li>
                <li>teisė prieštarauti duomenų tvarkymui tam tikrais atvejais;</li>
                <li>prašyti duomenų perkeliamumo (jei techniniu požiūriu įmanoma).</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Norėdami įgyvendinti savo teises, kreipkitės per{' '}
                <strong>
                  <Link href="/kontaktai" className="text-[--RepasBlue] underline hover:opacity-80">
                    kontaktų puslapį
                  </Link>
                </strong>.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">9. Kontaktai</h2>
              <p className="text-gray-600 leading-relaxed">
                Dėl klausimų ar prašymų susijusių su asmens duomenimis kreipkitės per{' '}
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

export default PrivacyNotice;