import React from 'react';

const TermsAndConditions: React.FC = () => {
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
                Šios taisyklės ir sąlygos (toliau – Sąlygos) nustato UAB &quot;Repas&quot; (toliau – Repas) teikiamų skalbimo ir valymo paslaugų teikimo tvarką bei sąlygas.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. Paslaugų užsakymas</h2>
              <p className="text-gray-600 leading-relaxed">
                Paslaugos užsakomos per Repas interneto svetainę, telefonu arba fizinėje parduotuvėje. Užsakymo metu klientas privalo pateikti tikslią informaciją apie pageidaujamas paslaugas ir kontaktinius duomenis.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3. Paslaugų kainos ir apmokėjimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Visos kainos nurodomos eurais, įskaitant PVM. Galutinė kaina priklauso nuo užsakytų paslaugų kiekio ir tipo. Apmokėjimas vykdomas pagal pateiktą sąskaitą-faktūrą.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">4. Paslaugų teikimo terminai</h2>
              <p className="text-gray-600 leading-relaxed">
                Standartinis paslaugų atlikimo terminas yra 2-3 darbo dienos nuo užsakymo priėmimo. Skubių užsakymų vykdymo terminai aptariami individualiai.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">5. Atsakomybė</h2>
              <p className="text-gray-600 leading-relaxed">
                Repas įsipareigoja teikti kokybiškas paslaugas ir atlyginti žalą, patirtą dėl netinkamai suteiktų paslaugų. Klientas įsipareigoja pateikti teisingą informaciją apie drabužių priežiūros reikalavimus.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">6. Sąlygų keitimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Repas pasilieka teisę keisti šias sąlygas. Apie pakeitimus klientai informuojami svetainėje. Pakeitimai įsigalioja nuo jų paskelbimo dienos.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-gray-500">
                Paskutinį kartą atnaujinta: 2025 m. lapkričio 8 d.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;