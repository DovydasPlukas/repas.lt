import React from 'react';
import { ContactInfo } from "@/components/contact-info"
import { Mail, MapPin, Phone, Store } from "lucide-react"

const Kontaktai: React.FC = () => {
  return (

<main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[--RepasBlue] px-6 py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">Susisiekime</h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
          Turite klausimų arba norite bendradarbiauti? Mielai išklausysime jūsų nuomonę.
          Parašykite mums žinutę ir mes kuo greičiau į ją atsakysime.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">


            {/* Contact Information */}
            <div>
              <h2 className="mb-6 text-balance text-3xl font-bold">Kontaktinė informacija</h2>
              <div className="space-y-8">
                <ContactInfo
                  icon={<Mail className="h-5 w-5" />}
                  title="El. paštas"
                  content="00repas@00repas.lt"
                  link="mailto:00repas@00repas.lt"
                />
                <ContactInfo
                  icon={<Phone className="h-5 w-5" />}
                  title="Telefonas"
                  content="+370 670 00003 000"
                  link="tel:+370 670 00003 000"
                />
                <ContactInfo
                  icon={<MapPin className="h-5 w-5" />}
                  title="Adresas"
                  content="Vytauto g. 265a, Šiauliai, Lietuva"
                />
                <ContactInfo
                    icon={<Store className="h-5 w-5" />}
                    title="Įmonės informacija"
                    content={'UAB "Repas"\nĮmonės kodas 144637537'}
                />

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Kontaktai;