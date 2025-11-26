import React from 'react'
import { Card } from "@/components/ui/card"
import { Users, Target, Lightbulb, Award } from "lucide-react"

export default function ApieMus() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-[--RepasBlue] md:text-6xl lg:text-7xl">
            Apie Mus
          </h1>
          <p className="text-pretty text-xl leading-relaxed text-[--RepasBlue] md:text-2xl">
            UAB „Repas“ – profesionalių skalbimo paslaugų įmonė, teikianti aukščiausios kokybės drabužių ir tekstilės priežiūros sprendimus jau daugiau nei tris dešimtmečius.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-y border-border bg-muted/30 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-bold text-[--RepasBlue] md:text-4xl">Mūsų misija</h2>
          <p className="text-pretty text-lg leading-relaxed text-[--RepasBlue]/90">
            Mūsų misija – užtikrinti nepriekaištingą švarą ir kokybę kiekvienam klientui. Nuolat tobuliname paslaugas, siekdami, kad skalbimas būtų patogus, greitas ir draugiškas aplinkai. Pasitelkdami modernias technologijas bei patirtį, garantuojame profesionalų ir atsakingą požiūrį į kiekvieną užsakymą.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[--RepasBlue] md:text-4xl">Mūsų vertybės</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col items-start gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[--RepasBlue] text-white">
                <Users className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-[--RepasBlue]">Klientas – pirmoje vietoje</h3>
              <p className="text-pretty leading-relaxed text-[--RepasBlue]">
                Kiekvieną dieną siekiame suprasti ir atitikti klientų poreikius, užtikrindami aukščiausią paslaugų kokybę ir patikimumą.
              </p>
            </Card>

            <Card className="flex flex-col items-start gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[--RepasBlue] text-white">
                <Target className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-[--RepasBlue]">Kokybė</h3>
              <p className="text-pretty leading-relaxed text-[--RepasBlue]">
                Naudojame modernią įrangą ir profesionalias skalbimo priemones, siekdami nepriekaištingo rezultato kiekvienam audiniui.
              </p>
            </Card>

            <Card className="flex flex-col items-start gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[--RepasBlue] text-white">
                <Lightbulb className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-[--RepasBlue]">Inovacijos</h3>
              <p className="text-pretty leading-relaxed text-[--RepasBlue]">
                Nuolat diegiame naujas technologijas ir ekologiškus sprendimus, kad skalbimo procesai būtų efektyvūs ir tvarūs.
              </p>
            </Card>

            <Card className="flex flex-col items-start gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[--RepasBlue] text-white">
                <Award className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-[--RepasBlue]">Patikimumas</h3>
              <p className="text-pretty leading-relaxed text-[--RepasBlue]">
                Dirbame atsakingai, laikydamiesi terminų ir aukštų standartų, kad klientai visada galėtų mumis pasitikėti.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-t border-border bg-muted/30 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-bold text-[--RepasBlue] md:text-4xl">Mūsų istorija</h2>
          <div className="space-y-6 text-pretty leading-relaxed text-[--RepasBlue]/90">
            <p>
              UAB „Repas“ įkurta 1992 m., veiklą pradėjusi nuo prekybos skalbikliais ir buitinės chemijos priemonėmis. Pastebėjusi kokybiškos skalbimo paslaugos trūkumą, įmonė įrengė modernią skalbyklą ir pradėjo teikti profesionalias skalbimo paslaugas.
            </p>
            <p>
              Įmonė įsisavino trikotažo gaminių ir siuvimo įmonių technologinį skalbimą, o siekdama palengvinti klientų kasdienybę – nuolat plečia teikiamų paslaugų spektrą. Viena iš naujovių – ekologiškas pūkų ir plunksnų gaminių valymas, skatinantis sveiką gyvenimo būdą.
            </p>
            <p>
              Šiandien UAB „Repas“ yra vienas patikimiausių skalbimo paslaugų teikėjų Šiauliuose, siūlantis kokybę, ilgametę patirtį ir profesionalumą. Mūsų tikslas – kad kiekvienas klientas galėtų džiaugtis švariais, gaiviais ir kruopščiai išskalbtas drabužiais.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold text-[--RepasBlue] md:text-4xl">Susisiekite su mumis</h2>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-[--RepasBlue]/90">
            Norite patikėti mums savo skalbinius? Susisiekite – su malonumu pasirūpinsime jūsų skalbimu greitai, kokybiškai ir atsakingai.
          </p>
          <a
            href="/kontaktai"
            className="inline-flex items-center justify-center rounded-lg bg-[#494B8B] px-8 py-3 text-base font-medium text-white font-poppins transition-all duration-300 ease-in-out hover:bg-[#494B8B]/90"
          >
            Susisiekti
          </a>
        </div>
      </section>
    </div>
  )
}